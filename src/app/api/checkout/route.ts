import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";

connect();

// ✅ PROPER ENVIRONMENT VALIDATION
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

// ✅ CHANGED: Stripe variable ko comment kiya kyun ke abhi use nahi ho raha
// const stripe = new Stripe(stripeSecretKey);

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

    // ✅ Save order in DB with 'payment_pending' status
    const newOrder = await Order.create({
      productId,
      productTitle,
      productPrice,
      userName,
      userEmail,
      requirement,
      additional: additional.substring(0, 1000),
      referenceFile: referenceFileBase64,
      status: "payment_pending",
      createdAt: new Date(),
    });

    // ✅ Return payment selection page URL instead of Stripe URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    return NextResponse.json({
      success: true,
      paymentSelectUrl: `${baseUrl}/payment-select?orderId=${newOrder._id.toString()}`,
      orderId: newOrder._id.toString(),
      message: "Order saved successfully. Please select payment method."
    });

  } catch (err: unknown) {
    console.error("Checkout API Error:", err);
    return NextResponse.json({ 
      success: false, 
      message: "Checkout process failed. Please try again." 
    }, { status: 500 });
  }
}