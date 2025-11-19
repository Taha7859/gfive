import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import Stripe from "stripe";

connect();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // -----------------------------
    // 1) Extract Form Fields
    // -----------------------------
    const productId = formData.get("productId")?.toString();
    const productTitle = formData.get("productTitle")?.toString();
    const productPrice = Number(formData.get("productPrice"));
    const userName = formData.get("userName")?.toString();
    const userEmail = formData.get("userEmail")?.toString();
    const requirement = formData.get("requirement")?.toString();
    const additional = formData.get("additional")?.toString();
    const referenceFile = formData.get("file") as File | null;

    if (!productId || !productTitle || !productPrice || !userName || !userEmail) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    // -----------------------------
    // 2) Convert file to Base64 (Vercel-compatible)
    // -----------------------------
    let referenceFileBase64 = "";
    if (referenceFile) {
      const arrayBuffer = await referenceFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = buffer.toString("base64");
      referenceFileBase64 = `data:${referenceFile.type};base64,${base64String}`;
    }

    // -----------------------------
    // 3) Save order in DB (status: pending)
    // -----------------------------
    const newOrder = await Order.create({
      productId,
      productTitle,
      productPrice,
      userName,
      userEmail,
      requirement,
      additional,
      referenceFile: referenceFileBase64, // store base64 string
      status: "pending",
    });

    // -----------------------------
    // 4) Create Stripe Checkout Session
    // -----------------------------
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: productTitle },
            unit_amount: Math.round(productPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: newOrder._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    newOrder.stripeSessionId = session.id;
    await newOrder.save();

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });

  } catch (err: unknown) {
    console.error("Checkout ERROR:", err);

    const message = err instanceof Error ? err.message : "Something went wrong";

    return NextResponse.json({ success: false, message });
  }
}
