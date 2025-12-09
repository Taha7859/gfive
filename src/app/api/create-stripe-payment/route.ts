import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import Stripe from "stripe";

connect();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(stripeSecretKey);

// ✅ FIXED: Helper function with proper type (any -> unknown)
const getPriceAsNumber = (price: unknown): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const num = parseFloat(price);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ 
        success: false, 
        message: "Order ID is required" 
      }, { status: 400 });
    }

    // Get order from database
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    // Check if order is already paid
    if (order.status === 'paid') {
      return NextResponse.json({ 
        success: false, 
        message: "Order is already paid" 
      }, { status: 400 });
    }

    // ✅ Convert productPrice to number
    const productPrice = getPriceAsNumber(order.productPrice);
    
    // ✅ Validate price
    if (productPrice <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid product price" 
      }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: order.productTitle,
            },
            unit_amount: Math.round(productPrice * 100), // ✅ Now using number
          },
          quantity: 1,
        },
      ],
      customer_email: order.userEmail,
      metadata: {
        orderId: order._id.toString(),
        userName: order.userName,
        productTitle: order.productTitle,
        paymentMethod: "stripe"
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}&payment_method=stripe`,
      cancel_url: `${baseUrl}/payment-select?orderId=${order._id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    // Update order with Stripe session ID
    order.stripeSessionId = session.id;
    order.status = 'pending'; // Change back to pending for Stripe
    await order.save();

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      orderId: order._id.toString(),
      sessionId: session.id
    });

  } catch (err: unknown) {
    console.error("Stripe Payment API Error:", err);
    return NextResponse.json({ 
      success: false, 
      message: "Payment service temporarily unavailable" 
    }, { status: 503 });
  }
}