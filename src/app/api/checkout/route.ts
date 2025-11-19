import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

    if (!productId || !productTitle || !productPrice || !userName || !userEmail)
      return NextResponse.json({ success: false, message: "Missing fields" });

    // -----------------------------
    // 2) Save file in TEMP folder
    // -----------------------------
    let tempFilePath = "";
    if (referenceFile) {
      const buffer = Buffer.from(await referenceFile.arrayBuffer());
      const tempDir = path.join(process.cwd(), "temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const fileName = `${uuidv4()}-${referenceFile.name}`;
      tempFilePath = path.join(tempDir, fileName);

      await fs.promises.writeFile(tempFilePath, buffer);
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
      referenceFile: tempFilePath,
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

    // Attach Stripe session ID
    newOrder.stripeSessionId = session.id;
    await newOrder.save();

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (err: unknown) {
  console.error("Checkout ERROR:", err);

  // safe message extraction
  const message =
    err instanceof Error ? err.message : "Something went wrong";

  return NextResponse.json({ success: false, message });
}
}
