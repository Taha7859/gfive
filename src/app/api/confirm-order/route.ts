import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { Resend } from "resend";

// ✅ Database connection
connect();

// ✅ ENVIRONMENT VALIDATION
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM;
const adminEmail = process.env.MAIL_ADMIN;

if (!resendApiKey || !fromEmail || !adminEmail) {
  throw new Error("Email configuration is incomplete");
}

// ✅ Resend initialization
const resend = new Resend(resendApiKey);
const FROM_EMAIL = fromEmail;
const ADMIN_EMAIL = adminEmail;

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface EmailOptions {
  from: string;
  to: string;
  contentType?: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

// ✅ Helper function to convert price to number
const getPriceAsNumber = (price: any): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const num = parseFloat(price);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

// =============================================
// ✅ GET REQUEST HANDLER (FOR PAYMENT-SELECT PAGE)
// =============================================
export async function GET(req: Request) {
  console.log("🎯 GET Confirm-order API called");
  
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    // ✅ INPUT VALIDATION
    if (!orderId) {
      return NextResponse.json({ 
        success: false, 
        message: "Order ID is required" 
      }, { status: 400 });
    }

    // ✅ FIND ORDER
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    console.log("✅ GET: Order found:", order._id);

    // ✅ Get price as number using helper function
    const productPrice = getPriceAsNumber(order.productPrice);
    
    // ✅ Return only necessary order data
    const orderData = {
      _id: order._id.toString(),
      productId: order.productId,
      productTitle: order.productTitle,
      productPrice: productPrice,
      userName: order.userName,
      userEmail: order.userEmail,
      requirement: order.requirement,
      additional: order.additional || "",
      status: order.status,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod || "",
      stripeSessionId: order.stripeSessionId || "",
      paypalOrderId: order.paypalOrderId || "",
    };

    return NextResponse.json({
      success: true,
      order: orderData,
      message: "Order data fetched successfully"
    });

  } catch (error: any) {
    console.error("GET Confirm-order API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Failed to fetch order data" 
    }, { status: 500 });
  }
}

// =============================================
// ✅ POST REQUEST HANDLER (FOR EMAIL CONFIRMATION)
// =============================================
export async function POST(req: Request) {
  console.log("🎯 POST Confirm-order API called");
  
  try {
    const { sessionId, orderId } = await req.json();

    // ✅ INPUT VALIDATION
    if (!sessionId && !orderId) {
      return NextResponse.json({ 
        success: false, 
        message: "Session ID or Order ID is required" 
      }, { status: 400 });
    }

    // ✅ FIND ORDER
    let order;
    if (sessionId) {
      order = await Order.findOne({ stripeSessionId: sessionId });
    } else {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: "Order not found" 
      }, { status: 404 });
    }

    console.log("✅ POST: Order found:", order._id);

    // ✅ Update order status
    order.status = "paid";
    order.paidAt = new Date();
    await order.save();

    console.log("✅ Order status updated to paid");

    // ✅ Get price as number
    const productPrice = getPriceAsNumber(order.productPrice);
    
    // ✅ PREPARE EMAIL ATTACHMENTS
    const attachments: EmailAttachment[] = [];
    
    if (order.referenceFile && order.referenceFile.startsWith('data:')) {
      try {
        const matches = order.referenceFile.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          
          if (buffer.length <= 10 * 1024 * 1024) {
            let fileExtension = 'bin';
            if (mimeType.includes('pdf')) fileExtension = 'pdf';
            else if (mimeType.includes('png')) fileExtension = 'png';
            else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) fileExtension = 'jpg';
            else if (mimeType.includes('gif')) fileExtension = 'gif';
            else if (mimeType.includes('zip')) fileExtension = 'zip';
            else if (mimeType.includes('text')) fileExtension = 'txt';
            
            const fileName = `reference-${order._id}.${fileExtension}`;
            
            attachments.push({
              filename: fileName,
              content: buffer,
              contentType: mimeType
            });
          }
        }
      } catch (fileError) {
        console.error("File attachment error:", fileError);
      }
    }

    // ✅ EMAIL TEMPLATES (FIXED toFixed() errors)
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #22c55e; text-align: center;">Payment Successful! 🎉</h2>
        <p>Dear <strong>${order.userName}</strong>,</p>
        <p>Thank you for your purchase! Your payment for <strong>${order.productTitle}</strong> has been successfully processed.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Summary:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Product:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.productTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Amount Paid:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${productPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Order ID:</strong></td>
              <td style="padding: 8px;">${order._id.toString()}</td>
            </tr>
          </table>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1565c0; margin-top: 0;">Your Requirements:</h3>
          <p style="white-space: pre-wrap;">${order.requirement}</p>
          ${order.additional ? `<p><strong>Additional Notes:</strong><br>${order.additional}</p>` : ''}
        </div>

        <p>We will review your requirements and contact you within <strong>24 hours</strong>.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 14px;">If you have any questions, please reply to this email.</p>
        </div>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d63384;">💰 NEW PAID ORDER</h2>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #856404; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${order.userName}</p>
          <p><strong>Email:</strong> ${order.userEmail}</p>
          <p><strong>Order ID:</strong> ${order._id.toString()}</p>
          <p><strong>Paid At:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #0c5460; margin-top: 0;">Order Details</h3>
          <p><strong>Product:</strong> ${order.productTitle}</p>
          <p><strong>Price:</strong> $${productPrice.toFixed(2)}</p>
          <p><strong>Requirement:</strong></p>
          <div style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #0c5460; white-space: pre-wrap;">
            ${order.requirement}
          </div>
          ${order.additional ? `
            <p style="margin-top: 15px;"><strong>Additional Notes:</strong></p>
            <div style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #0c5460;">
              ${order.additional}
            </div>
          ` : ''}
        </div>

        ${attachments.length > 0 ? `
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #155724; margin-top: 0;">📎 Reference File Attached</h3>
            <p>Customer has attached a reference file.</p>
          </div>
        ` : `
          <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #721c24; margin-top: 0;">📎 Reference File</h3>
            <p>No reference file was attached.</p>
          </div>
        `}

        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${order.userEmail}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            📧 Reply to Customer
          </a>
        </div>
      </div>
    `;

    // ✅ PREPARE EMAIL OPTIONS
    const userEmailOptions: EmailOptions = {
      from: FROM_EMAIL,
      to: order.userEmail,
      subject: `Order Confirmed - ${order.productTitle}`,
      html: userHtml,
    };

    const adminEmailOptions: EmailOptions = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🛍️ New Order: ${order.userName} - ${order.productTitle} - $${productPrice.toFixed(2)}`,
      html: adminHtml,
    };

    if (attachments.length > 0) {
      adminEmailOptions.attachments = attachments;
    }

    // ✅ SEND EMAILS
    const emailResults = await Promise.allSettled([
      resend.emails.send(userEmailOptions),
      resend.emails.send(adminEmailOptions)
    ]);

    const emailStatus = {
      user: emailResults[0].status === 'fulfilled',
      admin: emailResults[1].status === 'fulfilled'
    };

    console.log("📧 Email sending status:", emailStatus);

    return NextResponse.json({ 
      success: true, 
      message: "Order confirmed and emails sent",
      orderId: order._id,
      fileAttached: attachments.length > 0,
      emailsSent: emailStatus
    });

  } catch (error: any) {
    console.error("POST Confirm order error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || "Order confirmation failed" 
    }, { status: 500 });
  }
}