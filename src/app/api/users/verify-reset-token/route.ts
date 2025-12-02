import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: "Reset token is required" 
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

    return NextResponse.json({
      success: true,
      message: "Token is valid",
      email: user.email
    });

  } catch (error: unknown) {
    console.error("❌ Verify reset token error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to verify reset token" 
      },
      { status: 500 }
    );
  }
}