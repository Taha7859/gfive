// api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/models/orderModel";
import { connect } from "@/dbConfig/dbConfig";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize connections
connect();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = process.env.RESEND_FROM!;
const ADMIN_EMAIL = process.env.MAIL_ADMIN!;

// Helper function to determine file extension
const getFileExtension = (mimeType: string): string => {
  const extensions: { [key: string]: string } = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'application/pdf': 'pdf',
  };
  return extensions[mimeType] || 'file';
};

// Helper function to extract base64 data and content type
const parseBase64File = (base64String: string): { data: Buffer; mimeType: string; extension: string } | null => {
  try {
    const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const extension = getFileExtension(mimeType);

    return { data: buffer, mimeType, extension };
  } catch (error) {
    console.error('Error parsing base64 file:', error);
    return null;
  }
};

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

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
    console.error(`❌ Webhook signature verification failed: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("❌ Missing orderId in session metadata");
      return new NextResponse("Missing order metadata", { status: 400 });
    }

    try {
      // -----------------------------------
      // 1) Idempotency Check
      // -----------------------------------
      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`❌ Order not found: ${orderId}`);
        return new NextResponse("Order not found", { status: 404 });
      }

      if (order.status === "paid") {
        console.log(`✅ Duplicate webhook ignored for order: ${orderId}`);
        return new NextResponse("OK", { status: 200 });
      }

      // -----------------------------------
      // 2) Update order status to PAID
      // -----------------------------------
      order.status = "paid";
      order.stripePaymentIntentId = session.payment_intent?.toString() || "";
      order.paidAt = new Date();
      await order.save();

      console.log(`✅ Order ${orderId} marked as paid`);

      // -----------------------------------
      // 3) Prepare email content
      // -----------------------------------
      const userHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; }
            .content { padding: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed! 🎉</h1>
            </div>
            <div class="content">
              <h2>Thank you, ${order.userName}!</h2>
              <p>Your payment for <strong>${order.productTitle}</strong> has been successfully processed.</p>
              
              <h3>Order Details:</h3>
              <p><strong>Product:</strong> ${order.productTitle}</p>
              <p><strong>Amount Paid:</strong> $${order.productPrice.toFixed(2)}</p>
              <p><strong>Order ID:</strong> ${order._id}</p>
              
              <h3>Your Requirements:</h3>
              <p>${order.requirement}</p>
              
              ${order.additional ? `
              <h3>Additional Notes:</h3>
              <p>${order.additional}</p>
              ` : ''}
              
              <p>We will review your requirements and contact you shortly regarding the next steps.</p>
            </div>
            <div class="footer">
              <p>If you have any questions, please reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px 0; }
            .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Paid Order!</h1>
            </div>
            <div class="content">
              <div class="order-details">
                <h3>Customer Information:</h3>
                <p><strong>Name:</strong> ${order.userName}</p>
                <p><strong>Email:</strong> ${order.userEmail}</p>
                <p><strong>Order ID:</strong> ${order._id}</p>
              </div>
              
              <div class="order-details">
                <h3>Product Details:</h3>
                <p><strong>Product:</strong> ${order.productTitle}</p>
                <p><strong>Price:</strong> $${order.productPrice.toFixed(2)}</p>
                <p><strong>Stripe Session:</strong> ${session.id}</p>
              </div>
              
              <div class="order-details">
                <h3>Customer Requirements:</h3>
                <p>${order.requirement}</p>
              </div>
              
              ${order.additional ? `
              <div class="order-details">
                <h3>Additional Notes:</h3>
                <p>${order.additional}</p>
              </div>
              ` : ''}
              
              <p><strong>Reference File:</strong> ${order.referenceFile ? 'Attached with this email' : 'No file provided'}</p>
              
              <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order._id}">View Full Order Details</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      // -----------------------------------
      // 4) Send emails with attachments
      // -----------------------------------
      const emailPromises = [];

      // User email (no attachment needed)
      emailPromises.push(
        resend.emails.send({
          from: FROM_EMAIL,
          to: order.userEmail,
          subject: `Order Confirmed - ${order.productTitle}`,
          html: userHtml,
        })
      );

      // Admin email (with attachment if file exists)
      const adminEmailConfig: any = {
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `💰 New Paid Order - ${order.productTitle} - $${order.productPrice}`,
        html: adminHtml,
      };

      // Add attachment if reference file exists
      if (order.referenceFile) {
        const fileData = parseBase64File(order.referenceFile);
        if (fileData) {
          adminEmailConfig.attachments = [
            {
              filename: `reference-${order._id}.${fileData.extension}`,
              content: fileData.data,
            },
          ];
          console.log(`✅ File attachment added for order: ${orderId}`);
        } else {
          console.warn(`⚠️ Could not parse file for order: ${orderId}`);
        }
      }

      emailPromises.push(resend.emails.send(adminEmailConfig));

      // Send all emails
      await Promise.all(emailPromises);
      console.log(`✅ All emails sent successfully for order: ${orderId}`);

      return new NextResponse("OK", { status: 200 });

    } catch (error) {
      console.error(`❌ Webhook processing error for order ${orderId}:`, error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error(`Error name: ${error.name}`);
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
      }
      
      return new NextResponse("Webhook processing failed", { status: 500 });
    }
  }

  // Handle other event types if needed
  console.log(`ℹ️ Unhandled event type: ${event.type}`);
  return new NextResponse("OK", { status: 200 });
}