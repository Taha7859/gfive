

import { NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/models/orderModel";
import { connect } from "@/dbConfig/dbConfig";

export const config = { 
  api: { 
    bodyParser: false 
  } 
};

connect();

// ✅ PROPER ENVIRONMENT VALIDATION WITH TYPE SAFETY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is required");
}

// ✅ NOW THESE ARE DEFINITELY STRINGS (not undefined)
const stripe = new Stripe(stripeSecretKey);
const WEBHOOK_SECRET = webhookSecret;

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return new NextResponse("Missing signature", { status: 400 });
  }

  let body: string;
  try {
    body = await req.text();
  } catch (error) {
    console.error("❌ Failed to read request body:", error);
    return new NextResponse("Invalid body", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET // ✅ Now this is definitely a string
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    console.error("❌ Webhook verification failed:", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log("✅ Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("❌ Missing orderId in session metadata");
      return new NextResponse("Missing order metadata", { status: 400 });
    }

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        console.error("❌ Order not found:", orderId);
        return new NextResponse("Order not found", { status: 404 });
      }

      if (order.status === "paid") {
        console.log("🔄 Duplicate webhook ignored for order:", orderId);
        return new NextResponse("OK - Already processed", { status: 200 });
      }

      order.status = "paid";
      order.stripePaymentIntentId = session.payment_intent?.toString() || "";
      order.paidAt = new Date();
      await order.save();

      console.log("✅ Order marked as paid via webhook:", orderId);

      return new NextResponse("OK", { status: 200 });

    } catch (processError) {
      console.error("❌ Webhook processing error:", processError);
      return new NextResponse("OK", { status: 200 });
    }
  }

  return new NextResponse("OK", { status: 200 });
}