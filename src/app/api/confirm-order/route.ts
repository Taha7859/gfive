// import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
// import Order from "@/models/orderModel";
// import { Resend } from "resend";

// // ✅ Database connection with better error handling
// connect();

// // ✅ PROPER ENVIRONMENT VALIDATION WITH DEBUGGING
// console.log("🔧 Environment check started...");
// const resendApiKey = process.env.RESEND_API_KEY;
// const fromEmail = process.env.RESEND_FROM;
// const adminEmail = process.env.MAIL_ADMIN;

// console.log("📧 Resend API Key exists:", !!resendApiKey);
// console.log("📧 From Email exists:", !!fromEmail);
// console.log("📧 Admin Email exists:", !!adminEmail);

// if (!resendApiKey || !fromEmail || !adminEmail) {
//   console.error("❌ Email configuration is incomplete");
//   throw new Error("Email configuration is incomplete");
// }

// // ✅ Resend initialization with proper typing
// let resend: Resend;
// try {
//   resend = new Resend(resendApiKey);
//   console.log("✅ Resend initialized successfully");
// } catch (error) {
//   console.error("❌ Resend initialization failed:", error);
//   throw new Error("Resend initialization failed");
// }

// const FROM_EMAIL = fromEmail;
// const ADMIN_EMAIL = adminEmail;

// interface EmailAttachment {
//   filename: string;
//   content: Buffer;
//   contentType: string;
// }

// interface EmailOptions {
//   from: string;
//   to: string;
//   subject: string;
//   html: string;
//   attachments?: EmailAttachment[];
// }

// export async function POST(req: Request) {
//   console.log("🎯 Confirm-order API called at:", new Date().toISOString());
  
//   try {
//     // ✅ Request body parsing with error handling
//     let requestBody: { sessionId?: string; orderId?: string };
//     try {
//       requestBody = await req.json();
//       console.log("📦 Received request body:", requestBody);
//     } catch (parseError) {
//       console.error("❌ Request body parsing failed:", parseError);
//       return NextResponse.json({ 
//         success: false, 
//         message: "Invalid request body" 
//       }, { status: 400 });
//     }

//     const { sessionId, orderId } = requestBody;

//     // ✅ INPUT VALIDATION
//     if (!sessionId && !orderId) {
//       console.log("❌ No sessionId or orderId provided");
//       return NextResponse.json({ 
//         success: false, 
//         message: "Session ID or Order ID is required" 
//       }, { status: 400 });
//     }

//     console.log("🔍 Searching for order with:", { sessionId, orderId });

//     let order;
//     try {
//       if (sessionId) {
//         order = await Order.findOne({ stripeSessionId: sessionId });
//         console.log("📋 Order found by sessionId:", order ? order._id : "NOT FOUND");
//       } else {
//         order = await Order.findById(orderId);
//         console.log("📋 Order found by orderId:", order ? order._id : "NOT FOUND");
//       }
//     } catch (dbError) {
//       console.error("❌ Database query error:", dbError);
//       return NextResponse.json({ 
//         success: false, 
//         message: "Database error" 
//       }, { status: 500 });
//     }

//     if (!order) {
//       console.log("❌ Order not found in database");
//       return NextResponse.json({ 
//         success: false, 
//         message: "Order not found" 
//       }, { status: 404 });
//     }

//     console.log("✅ Order found:", {
//       id: order._id,
//       userEmail: order.userEmail,
//       userName: order.userName,
//       currentStatus: order.status
//     });

//     // ✅ DUPLICATE PROCESSING CHECK
//     if (order.status === "paid") {
//       console.log("🔄 Order already paid, skipping email:", order._id);
//       return NextResponse.json({ 
//         success: true, 
//         message: "Order already confirmed",
//         alreadyProcessed: true 
//       });
//     }

//     // ✅ Update order status
//     order.status = "paid";
//     order.paidAt = new Date();
//     await order.save();

//     console.log("✅ Order status updated to paid:", order._id);

//     // ✅ PREPARE EMAIL ATTACHMENTS
//     const attachments: EmailAttachment[] = [];
    
//     if (order.referenceFile && order.referenceFile.startsWith('data:')) {
//       try {
//         console.log("📎 Processing file attachment...");
//         const matches = order.referenceFile.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
//         if (matches && matches.length === 3) {
//           const mimeType = matches[1];
//           const base64Data = matches[2];
//           const buffer = Buffer.from(base64Data, 'base64');
          
//           if (buffer.length > 10 * 1024 * 1024) {
//             console.warn("📎 File too large for email attachment, skipping");
//           } else {
//             let fileExtension = 'bin';
//             if (mimeType.includes('pdf')) fileExtension = 'pdf';
//             else if (mimeType.includes('png')) fileExtension = 'png';
//             else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) fileExtension = 'jpg';
//             else if (mimeType.includes('gif')) fileExtension = 'gif';
//             else if (mimeType.includes('zip')) fileExtension = 'zip';
//             else if (mimeType.includes('text')) fileExtension = 'txt';
            
//             const fileName = `reference-${order._id}.${fileExtension}`;
            
//             attachments.push({
//               filename: fileName,
//               content: buffer,
//               contentType: mimeType
//             });
            
//             console.log("✅ File attachment prepared:", fileName);
//           }
//         }
//       } catch (fileError) {
//         console.error("❌ File attachment preparation failed:", fileError);
//       }
//     } else {
//       console.log("📎 No file attachment found");
//     }

//     // ✅ EMAIL TEMPLATES
//     console.log("📧 Preparing email templates...");
    
//     const userHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <h2 style="color: #22c55e; text-align: center;">Payment Successful! 🎉</h2>
//         <p>Dear <strong>${order.userName}</strong>,</p>
//         <p>Thank you for your purchase! Your payment for <strong>${order.productTitle}</strong> has been successfully processed.</p>
        
//         <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
//           <h3 style="color: #333; margin-top: 0;">Order Summary:</h3>
//           <table style="width: 100%; border-collapse: collapse;">
//             <tr>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Product:</strong></td>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.productTitle}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Amount Paid:</strong></td>
//               <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${order.productPrice.toFixed(2)}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px;"><strong>Order ID:</strong></td>
//               <td style="padding: 8px;">${order._id.toString()}</td>
//             </tr>
//           </table>
//         </div>

//         <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
//           <h3 style="color: #1565c0; margin-top: 0;">Your Requirements:</h3>
//           <p style="white-space: pre-wrap;">${order.requirement}</p>
//           ${order.additional ? `<p><strong>Additional Notes:</strong><br>${order.additional}</p>` : ''}
//         </div>

//         <p>We will review your requirements and contact you within <strong>24 hours</strong>.</p>
        
//         <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
//           <p style="color: #666; font-size: 14px;">If you have any questions, please reply to this email.</p>
//         </div>
//       </div>
//     `;

//     const adminHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #d63384;">💰 NEW PAID ORDER</h2>
        
//         <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
//           <h3 style="color: #856404; margin-top: 0;">Customer Information</h3>
//           <p><strong>Name:</strong> ${order.userName}</p>
//           <p><strong>Email:</strong> ${order.userEmail}</p>
//           <p><strong>Order ID:</strong> ${order._id.toString()}</p>
//           <p><strong>Paid At:</strong> ${new Date().toLocaleString()}</p>
//         </div>

//         <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0;">
//           <h3 style="color: #0c5460; margin-top: 0;">Order Details</h3>
//           <p><strong>Product:</strong> ${order.productTitle}</p>
//           <p><strong>Price:</strong> $${order.productPrice.toFixed(2)}</p>
//           <p><strong>Requirement:</strong></p>
//           <div style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #0c5460; white-space: pre-wrap;">
//             ${order.requirement}
//           </div>
//           ${order.additional ? `
//             <p style="margin-top: 15px;"><strong>Additional Notes:</strong></p>
//             <div style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #0c5460;">
//               ${order.additional}
//             </div>
//           ` : ''}
//         </div>

//         ${attachments.length > 0 ? `
//           <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <h3 style="color: #155724; margin-top: 0;">📎 Reference File Attached</h3>
//             <p>Customer has attached a reference file with this order.</p>
//           </div>
//         ` : `
//           <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <h3 style="color: #721c24; margin-top: 0;">📎 Reference File</h3>
//             <p>No reference file was attached by the customer.</p>
//           </div>
//         `}

//         <div style="text-align: center; margin-top: 20px;">
//           <a href="mailto:${order.userEmail}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
//             📧 Reply to Customer
//           </a>
//         </div>
//       </div>
//     `;

//     // ✅ PREPARE EMAIL OPTIONS
//     console.log("📧 Preparing email options...");
    
//     const userEmailOptions: EmailOptions = {
//       from: FROM_EMAIL,
//       to: order.userEmail,
//       subject: `Order Confirmed - ${order.productTitle}`,
//       html: userHtml,
//     };

//     const adminEmailOptions: EmailOptions = {
//       from: FROM_EMAIL,
//       to: ADMIN_EMAIL,
//       subject: `🛍️ New Order: ${order.userName} - ${order.productTitle} - $${order.productPrice.toFixed(2)}`,
//       html: adminHtml,
//     };

//     if (attachments.length > 0) {
//       adminEmailOptions.attachments = attachments;
//       console.log("✅ Attachments added to admin email");
//     }

//     // ✅ SEND EMAILS with detailed error handling
//     console.log("🔄 Starting email sending process...");
    
//     let emailResults: PromiseSettledResult<any>[];
//     try {
//       emailResults = await Promise.allSettled([
//         resend.emails.send(userEmailOptions),
//         resend.emails.send(adminEmailOptions)
//       ]);
//       console.log("✅ Email sending completed");
//     } catch (emailError) {
//       console.error("❌ Email sending failed:", emailError);
//       return NextResponse.json({ 
//         success: false, 
//         message: "Email service error" 
//       }, { status: 500 });
//     }

//     // ✅ DETAILED EMAIL STATUS LOGGING
//     const emailStatus = {
//       user: emailResults[0].status === 'fulfilled',
//       admin: emailResults[1].status === 'fulfilled'
//     };

//     console.log("📧 Email sending status:", emailStatus);

//     // Log detailed results
//     emailResults.forEach((result, index) => {
//       const emailType = index === 0 ? 'User' : 'Admin';
//       if (result.status === 'fulfilled') {
//         console.log(`✅ ${emailType} email sent successfully:`, result.value);
//       } else {
//         console.error(`❌ ${emailType} email failed:`, result.reason);
//       }
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Order confirmed and emails sent",
//       orderId: order._id,
//       fileAttached: attachments.length > 0,
//       emailsSent: emailStatus
//     });

//   } catch (error) {
//     console.error("❌ Confirm order error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error instanceof Error ? error.message : "Order confirmation failed" 
//     }, { status: 500 });
//   }
// }


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
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

export async function POST(req: Request) {
  console.log("🎯 Confirm-order API called");
  
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

    console.log("✅ Order found:", order._id);

    // ✅ REMOVED DUPLICATE CHECK - FORCE EMAIL SEND
    // Yeh line hatadi duplicate check ki - ab hamesha email bhejega

    // ✅ Update order status
    order.status = "paid";
    order.paidAt = new Date();
    await order.save();

    console.log("✅ Order status updated to paid");

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

    // ✅ EMAIL TEMPLATES
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
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${order.productPrice.toFixed(2)}</td>
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
          <p><strong>Price:</strong> $${order.productPrice.toFixed(2)}</p>
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
      subject: `🛍️ New Order: ${order.userName} - ${order.productTitle} - $${order.productPrice.toFixed(2)}`,
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

  } catch (error) {
    console.error("Confirm order error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Order confirmation failed" 
    }, { status: 500 });
  }
}