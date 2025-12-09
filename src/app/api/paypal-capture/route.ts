import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";

connect();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.redirect(new URL('/payment-failed', req.url));
    }

    // Get order from database
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.redirect(new URL('/payment-failed', req.url));
    }

    // ✅ IMPORTANT: PayPal credentials
    const paypalClientId = process.env.PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_SECRET;
    const paypalApiUrl = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com';

    if (!paypalClientId || !paypalSecret || !order.paypalOrderId) {
      console.error("PayPal capture missing data");
      return NextResponse.redirect(new URL('/payment-failed', req.url));
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
      return NextResponse.redirect(new URL('/payment-failed', req.url));
    }

    const accessToken = tokenData.access_token;

    // 2. Capture PayPal Order
    const captureResponse = await fetch(
      `${paypalApiUrl}/v2/checkout/orders/${order.paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const captureData = await captureResponse.json();

    if (captureResponse.ok && captureData.status === 'COMPLETED') {
      // 3. Update order as paid
      order.status = 'paid';
      order.paymentMethod = 'paypal';
      order.paymentId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      order.paidAt = new Date();
      await order.save();

      // 4. Redirect to success page
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      return NextResponse.redirect(
        new URL(`/success?order_id=${orderId}&payment_method=paypal`, baseUrl)
      );
    } else {
      console.error("PayPal capture failed:", captureData);
      order.status = 'failed';
      order.paymentError = captureData.message || 'Capture failed';
      await order.save();
      
      return NextResponse.redirect(
        new URL(`/payment-failed?orderId=${orderId}`, req.url)
      );
    }

  } catch (err: unknown) {
    console.error("PayPal Capture Error:", err);
    return NextResponse.redirect(new URL('/payment-failed', req.url));
  }
}