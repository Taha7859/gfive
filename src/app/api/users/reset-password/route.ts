import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // ✅ Validate input
    if (!token || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: "Reset token and new password are required" 
        },
        { status: 400 }
      );
    }

    // ✅ Password validation
    const passwordRegex = /^(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { 
          success: false,
          message: "Password must be at least 6 characters long and contain at least 1 number" 
        },
        { status: 400 }
      );
    }

    // ✅ Find user with valid reset token
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid or expired reset token" 
        },
        { status: 400 }
      );
    }

    // ✅ Hash new password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // ✅ Update user password and clear reset token
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error: unknown) {
    console.error("❌ Reset password error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to reset password" 
      },
      { status: 500 }
    );
  }
}