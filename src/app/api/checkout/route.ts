import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import Stripe from "stripe";

connect();

// ✅ PROPER ENVIRONMENT VALIDATION
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract and sanitize Form Fields
    const productId = formData.get("productId")?.toString()?.trim() || "";
    const productTitle = formData.get("productTitle")?.toString()?.trim() || "";
    const productPrice = Number(formData.get("productPrice")) || 0;
    const userName = formData.get("userName")?.toString()?.trim() || "";
    const userEmail = formData.get("userEmail")?.toString()?.trim() || "";
    const requirement = formData.get("requirement")?.toString()?.trim() || "";
    const additional = formData.get("additional")?.toString()?.trim() || "";
    const referenceFile = formData.get("file") as File | null;

    // ✅ ENHANCED VALIDATIONS
    if (!productId || !productTitle || !userName || !userEmail || !requirement) {
      return NextResponse.json({ 
        success: false, 
        message: "All required fields are missing" 
      }, { status: 400 });
    }

    // ✅ PRICE VALIDATION
    if (productPrice <= 0 || productPrice > 100000) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid product price. Must be between $0.01 and $1000" 
      }, { status: 400 });
    }

    // ✅ EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid email address format" 
      }, { status: 400 });
    }

    // ✅ REQUIREMENT LENGTH VALIDATION
    if (requirement.length < 10) {
      return NextResponse.json({ 
        success: false, 
        message: "Requirements should be at least 10 characters long" 
      }, { status: 400 });
    }

    // ✅ FILE SIZE VALIDATION (10MB limit)
    let referenceFileBase64 = "";
    if (referenceFile && referenceFile.size > 0) {
      if (referenceFile.size > 10 * 1024 * 1024) {
        return NextResponse.json({ 
          success: false, 
          message: "File size too large. Maximum 10MB allowed" 
        }, { status: 400 });
      }

      try {
        const arrayBuffer = await referenceFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString("base64");
        
        if (referenceFile.type && base64String && base64String.length > 0) {
          referenceFileBase64 = `data:${referenceFile.type};base64,${base64String}`;
        }
      } catch (fileError) {
        console.error("File processing error:", fileError);
        return NextResponse.json({ 
          success: false, 
          message: "File processing failed" 
        }, { status: 400 });
      }
    }

    // ✅ Save order in DB
    const newOrder = await Order.create({
      productId,
      productTitle,
      productPrice,
      userName,
      userEmail,
      requirement,
      additional: additional.substring(0, 1000),
      referenceFile: referenceFileBase64,
      status: "pending",
      createdAt: new Date(),
    });

    // ✅ Create Stripe Checkout Session
    let session;
    try {
      // ✅ PROPER BASE URL HANDLING
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: productTitle,
              },
              unit_amount: Math.round(productPrice * 100),
            },
            quantity: 1,
          },
        ],
        customer_email: userEmail,
        metadata: {
          orderId: newOrder._id.toString(),
          userName: userName,
          productTitle: productTitle,
          timestamp: Date.now().toString()
        },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${newOrder._id}`,
        cancel_url: `${baseUrl}/cancel`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });
    } catch (stripeError) {
      await Order.findByIdAndDelete(newOrder._id);
      console.error("Stripe session creation failed:", stripeError);
      return NextResponse.json({ 
        success: false, 
        message: "Payment service temporarily unavailable" 
      }, { status: 503 });
    }

    newOrder.stripeSessionId = session.id;
    await newOrder.save();

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      orderId: newOrder._id.toString(),
      sessionId: session.id
    });

  } catch (err: unknown) {
    console.error("Checkout API Error:", err);
    return NextResponse.json({ 
      success: false, 
      message: "Checkout process failed. Please try again." 
    }, { status: 500 });
  }
}