import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ Input validation and sanitization
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: "Email and password are required" 
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { 
          success: false,
          message: "Email and password cannot be empty" 
        },
        { status: 400 }
      );
    }

    // ✅ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { 
          success: false,
          message: "Please enter a valid email address" 
        },
        { status: 400 }
      );
    }

    // ✅ Find user with better error handling
    const user = await User.findOne({ email: cleanEmail }).select("+password");
    if (!user) {
      // ✅ Security: Same error message for both invalid email and password
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid email or password" 
        },
        { status: 401 }
      );
    }

    // ✅ Check email verification
    if (!user.isVerified) {
      return NextResponse.json(
        { 
          success: false,
          message: "Please verify your email before logging in",
          requiresVerification: true 
        },
        { status: 403 }
      );
    }

    // ✅ Password comparison with timing attack protection
    const isPasswordValid = await bcryptjs.compare(cleanPassword, user.password);
    
    if (!isPasswordValid) {
      // ✅ Security: Same error message for both invalid email and password
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid email or password" 
        },
        { status: 401 }
      );
    }

    // ✅ JWT token creation with proper payload
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      username: user.username
    };

    if (!process.env.TOKEN_SECRET) {
      console.error("❌ TOKEN_SECRET is not defined");
      return NextResponse.json(
        { 
          success: false,
          message: "Server configuration error" 
        },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.TOKEN_SECRET,
      { 
        expiresIn: process.env.NODE_ENV === "production" ? "1h" : "7d" 
      }
    );

    // ✅ Prepare success response
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.username,
      role: user.role || "user",
      isVerified: user.isVerified,
    };

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });

    // ✅ Set secure HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: process.env.NODE_ENV === "production" ? 60 * 60 : 7 * 24 * 60 * 60, // 1h in production, 7d in development
    });

    // ✅ Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;

  } catch (error: unknown) {
    console.error("❌ Login error:", error);
    
    // ✅ Generic error message for security
    return NextResponse.json(
      { 
        success: false,
        message: "Authentication failed. Please try again." 
      },
      { status: 500 }
    );
  }
}