import { NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/models/orderModel";
import { connect } from "@/dbConfig/dbConfig";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

connect();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = process.env.RESEND_FROM!;
const ADMIN_EMAIL = process.env.MAIL_ADMIN!;

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    if (!orderId) return new NextResponse("Missing metadata", { status: 400 });

    // -----------------------------------
    // 1) Idempotency Check
    // -----------------------------------
    const order = await Order.findById(orderId);
    if (!order) return new NextResponse("Order not found", { status: 404 });

    if (order.status === "paid") {
      console.log("Duplicate webhook ignored");
      return new NextResponse("OK", { status: 200 });
    }

    // -----------------------------------
    // 2) Move file from temp → uploads
    // -----------------------------------
    let finalPath = "";

    if (order.referenceFile) {
      const tempFile = order.referenceFile;
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const fileName = path.basename(tempFile);
      finalPath = path.join(uploadsDir, fileName);

      await fs.promises.rename(tempFile, finalPath);
    }

    // -----------------------------------
    // 3) Update order → PAID
    // -----------------------------------
    order.status = "paid";
    order.referenceFile = finalPath;
    order.stripePaymentIntentId = session.payment_intent?.toString() || "";
    await order.save();

    // -----------------------------------
    // 4) Send Emails (User + Admin)
    // -----------------------------------
    const userHtml = `
      <h2>Thank you, ${order.userName}!</h2>
      <p>Your payment for <strong>${order.productTitle}</strong> has been received.</p>
      <p>We will contact you shortly.</p>
    `;

    const adminHtml = `
      <h2>New Paid Order</h2>
      <p><strong>${order.userName}</strong> (${order.userEmail})</p>
      <p>Product: ${order.productTitle}</p>
      <p>Price: $${order.productPrice}</p>
    `;

    await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: order.userEmail,
        subject: `Order Confirmed — ${order.productTitle}`,
        html: userHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Paid Order`,
        html: adminHtml,
      }),
    ]);

    console.log("Order updated & emails sent.");
  }

  return new NextResponse("OK", { status: 200 });
}
