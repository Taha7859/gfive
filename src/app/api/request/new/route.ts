import { NextResponse } from "next/server";
import Order from "@/models/orderModel";
import { connect } from "@/dbConfig/dbConfig";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

connect(); // DB connect

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = process.env.RESEND_FROM!; // Free plan = noreply@resend.dev
const ADMIN_EMAIL = process.env.MAIL_ADMIN!;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // ===== 1. Form Data =====
    const productId = formData.get("productId") as string;
    const productTitle = formData.get("productTitle") as string;
    const productPrice = Number(formData.get("productPrice"));
    const userName = formData.get("userName") as string;
    const userEmail = formData.get("userEmail") as string;
    const requirement = formData.get("requirement") as string;
    const additional = formData.get("additional") as string;

    // ===== 2. File Handling =====
    const referenceFile = formData.get("file") as File | null;
    let filePath = "";
    let attachment: { filename: string; content: Buffer } | null = null;

    if (referenceFile) {
      const bytes = await referenceFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      filePath = path.join(uploadDir, `${uuidv4()}-${referenceFile.name}`);
      fs.writeFileSync(filePath, buffer);

      attachment = { filename: referenceFile.name, content: buffer };
    }

    // ===== 3. Save Order to DB =====
    const newOrder = await Order.create({
      productId,
      productTitle,
      productPrice,
      userName,
      userEmail,
      requirement,
      additional,
      referenceFile: filePath || "",
    });

    // ===== 4. Send Emails (separate & simultaneous) =====
    await Promise.all([
      // ➤ User confirmation email
      resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: `Order Confirmation — ${productTitle}`,
        html: `
          <p>Hi ${userName},</p>
          <p>Thank you for your order! Here are the details:</p>
          <ul>
            <li><strong>Product:</strong> ${productTitle}</li>
            <li><strong>Price:</strong> ${productPrice}</li>
            <li><strong>Requirement:</strong> ${requirement}</li>
            <li><strong>Additional:</strong> ${additional || "None"}</li>
            <li><strong>Order ID:</strong> ${newOrder._id}</li>
          </ul>
        `,
        attachments: attachment ? [{ filename: attachment.filename, content: attachment.content }] : undefined,
      }),

      // ➤ Admin notification email
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Order Received — ${productTitle}`,
        html: `
          <h3>New Order Details</h3>
          <p><strong>User Name:</strong> ${userName}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Product:</strong> ${productTitle}</p>
          <p><strong>Price:</strong> ${productPrice}</p>
          <p><strong>Requirement:</strong> ${requirement}</p>
          <p><strong>Additional:</strong> ${additional}</p>
          <p><strong>Order ID:</strong> ${newOrder._id}</p>
        `,
        attachments: attachment ? [{ filename: attachment.filename, content: attachment.content }] : undefined,
      }),
    ]);

    return NextResponse.json({
      success: true,
      orderId: newOrder._id,
    });
  } catch (error: unknown) {
  let message = "Unknown server error";

  if (error instanceof Error) {
    message = error.message;
  }

  console.error("API Error:", message);

  return NextResponse.json({
    success: false,
    message,
  });

  }
}
 