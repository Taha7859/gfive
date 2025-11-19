import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, message, services } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const adminEmail = process.env.MAIL_ADMIN;
    if (!adminEmail) {
      return NextResponse.json({ error: "MAIL_ADMIN not set" }, { status: 500 });
    }

    const serviceList = Array.isArray(services) && services.length > 0
      ? services.join(", ")
      : "No service selected";

    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><strong>Services Selected:</strong> ${serviceList}</p>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM!, 
      to: adminEmail,
      subject: "New Contact Form Submission",
      html,
    });

    return NextResponse.json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error("CONTACT_API_ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
