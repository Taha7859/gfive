import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendRequestEmail = async (
  customerEmail: string,
  customerName: string,
  requirement: string,
  productTitle: string
) => {
  const admin = process.env.MAIL_ADMIN!;

  // ✅ Email to Admin
  const adminMail = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: admin,
    subject: `New Design Request — ${productTitle}`,
    html: `
      <h2>New Custom Design Request</h2>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Product:</strong> ${productTitle}</p>
      <p><strong>Requirement:</strong><br>${requirement}</p>
    `,
  });

  if (adminMail.error) throw new Error(adminMail.error.message);

  // ✅ Email to Customer
  const customerMail = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: customerEmail,
    subject: `Your Request Has Been Received — ${productTitle}`,
    html: `
      <h3>Thank you, ${customerName}!</h3>
      <p>Your request for <strong>${productTitle}</strong> has been received.</p>
      <p>Our team will review your requirements and get back to you soon.</p>
      <br>
      <p><strong>Your Requirement:</strong></p>
      <p>${requirement}</p>
    `,
  });

  if (customerMail.error) throw new Error(customerMail.error.message);

  return { adminMail, customerMail };
};
