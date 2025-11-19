import { Resend } from "resend";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

    const subject =
      emailType === "VERIFY" ? "Verify your email" : "Reset your password";

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject,
      html: `
        <p>
          Click 
          <a href="${link}">here</a> 
          to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
          <br><br>
          Or paste this link in your browser:<br>${link}
        </p>
      `,
    });

    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Error sending email");
  }
};
