import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import crypto from "crypto";

connect();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Generate new verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes

    user.verifyToken = verifyToken;
    user.verifyTokenExpiry = verifyTokenExpiry;
    await user.save();

    // ✅ Send email using Resend (already converted)
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: user._id.toString(),
    });

    return NextResponse.json({
      message: "Verification email sent",
      success: true,
      expiresIn: 120,
    });
  } catch (error: unknown) {
  let message = "Unexpected error";

  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

}
