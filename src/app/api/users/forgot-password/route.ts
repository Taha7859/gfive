import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import { rateLimiter, RATE_LIMITS } from "@/lib/rateLimit";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // ✅ Validate input
    if (!email) {
      return NextResponse.json(
        { 
          success: false,
          message: "Email is required" 
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // ✅ Apply rate limiting for forgot password attempts (per email)
    const rateLimitResult = rateLimiter.check(`forgot_password:${cleanEmail}`, RATE_LIMITS.FORGOT_PASSWORD);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          message: rateLimitResult.message 
        },
        { status: 429 }
      );
    }

    // ✅ Find user
    const user = await User.findOne({ email: cleanEmail });
    
    // ✅ Security: Always return success even if user doesn't exist
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // ✅ Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          success: false,
          message: "Please verify your email before resetting password" 
        },
        { status: 400 }
      );
    }

    // ✅ Send reset password email
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id.toString(),
    });

    const response = NextResponse.json({
      success: true,
      message: "Password reset link has been sent to your email"
    });

    // ✅ Add rate limit headers
    response.headers.set('X-RateLimit-Limit', RATE_LIMITS.FORGOT_PASSWORD.max.toString());
    response.headers.set('X-RateLimit-Remaining', (RATE_LIMITS.FORGOT_PASSWORD.max - rateLimiter.hits.get(`forgot_password:${cleanEmail}`)!.count).toString());

    return response;

  } catch (error: unknown) {
    console.error("❌ Forgot password error:", error);
    
    
    return NextResponse.json(
      { 
        success: false,
        message: "Something went wrong. Please try again." 
      },
      { status: 500 }
    );
  }
}