import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";

connect();

// ✅ ADDED: Helper function to convert price to number
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

    // ✅ IMPORTANT: Convert productPrice to number
    const productPrice = getPriceAsNumber(order.productPrice);
    
    // ✅ Validate price
    if (productPrice <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid product price" 
      }, { status: 400 });
    }

    // ✅ IMPORTANT: Aapko PayPal credentials environment variables mein set karni hain
    const paypalClientId = process.env.PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_SECRET;
    const paypalApiUrl = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com';

    if (!paypalClientId || !paypalSecret) {
      console.error("PayPal credentials missing");
      return NextResponse.json({ 
        success: false, 
        message: "PayPal payment is currently unavailable" 
      }, { status: 503 });
    }

    // 1. Get PayPal Access Token
    const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString('base64');
    
    const tokenResponse = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("PayPal token error:", tokenData);
      return NextResponse.json({ 
        success: false, 
        message: "PayPal authentication failed" 
      }, { status: 503 });
    }

    const accessToken = tokenData.access_token;

    // 2. Create PayPal Order
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': orderId,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderId,
          description: order.productTitle,
          amount: {
            currency_code: 'USD',
            // ✅ FIXED: .toFixed(2) use kiya number par
            value: productPrice.toFixed(2),
          },
        }],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              brand_name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Site',
              locale: 'en-US',
              landing_page: 'LOGIN',
              user_action: 'PAY_NOW',
              return_url: `${baseUrl}/api/paypal-capture?orderId=${orderId}`,
              cancel_url: `${baseUrl}/payment-select?orderId=${orderId}`,
            }
          }
        }
      }),
    });

    const paypalOrder = await orderResponse.json();
    
    if (!orderResponse.ok) {
      console.error("PayPal order error:", paypalOrder);
      return NextResponse.json({ 
        success: false, 
        message: paypalOrder.message || "Failed to create PayPal order" 
      }, { status: 500 });
    }

    // 3. Update order in database
    order.paypalOrderId = paypalOrder.id;
    order.status = 'paypal_pending';
    order.paymentMethod = 'paypal';
    await order.save();

    // 4. Find approval URL
    let approveUrl = '';
    for (const link of paypalOrder.links || []) {
      if (link.rel === 'payer-action' || link.rel === 'approve') {
        approveUrl = link.href;
        break;
      }
    }

    if (!approveUrl) {
      return NextResponse.json({ 
        success: false, 
        message: "PayPal approval URL not found" 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      approveUrl,
      orderId: order._id.toString(),
      paypalOrderId: paypalOrder.id
    });

  } catch (err: unknown) {
    console.error("PayPal Payment API Error:", err);
    return NextResponse.json({ 
      success: false, 
      message: "Payment service temporarily unavailable" 
    }, { status: 503 });
  }
}