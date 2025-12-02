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

    // User ko database se fetch karo name ke liye
    const user = await User.findById(userId);
    const userName = user?.username || "User"; // Fallback agar name nahi hai

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
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
        : `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;

      
    const subject =
      emailType === "VERIFY" ? "Verify your email" : "Reset your password";

    const response = await resend.emails.send({
      from: "support@shpfusion.com",
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 font-sans">
          <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-sm my-8 overflow-hidden">
            <!-- Header -->
            

            <!-- Content -->
            <div class="px-6 py-8">
              <!-- Greeting -->
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                Hi ${userName},
              </h2>

              <!-- Welcome Message -->
              <div class="text-gray-600 mb-6 leading-relaxed">
                <p class="mb-3">Welcome to ShpFusion! 🎉</p>
                <p>Your account has been created successfully. ✅</p>
              </div>

              <!-- Action Button -->
              <div class="text-center my-8">
                <a 
                  href="${link}" 
                  class="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:-translate-y-0.5"
                >
                  <span class="mr-2">👉</span>
                  ${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}
                </a>
              </div>

              <!-- Alternative Link -->
              <div class="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                <p class="text-sm text-gray-600 mb-2 font-medium">Or paste this link in your browser:</p>
                <p class="text-blue-600 break-all text-sm">${link}</p>
              </div>

              <!-- Security Notice -->
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 text-sm font-medium">
                   <strong> ℹ Important:</strong> If this wasn't you, please ignore this message.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-100 px-6 py-6 text-center border-t border-gray-200">
              <p class="font-semibold text-gray-800">ShpFusion Ltd.</p>
              <p class="text-gray-600 text-sm mt-1">Chadwell Heath, Essex, UK</p>
              <p class="text-gray-500 text-xs mt-4">
                © ${new Date().getFullYear()} ShpFusion. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
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
