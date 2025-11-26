import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

// ✅ Helper function to verify JWT token
async function verifyToken(token: string): Promise<{ id: string; email: string } | null> {
  try {
    if (!process.env.TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as { id: string; email: string };
    return decoded;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // ✅ Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: "Authentication required" 
        },
        { status: 401 }
      );
    }

    // ✅ Verify token
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      // ✅ Clear invalid token
      const response = NextResponse.json(
        { 
          success: false,
          message: "Invalid or expired token" 
        },
        { status: 401 }
      );
      
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });

      return response;
    }

    // ✅ Find user in database
    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          message: "User not found" 
        },
        { status: 404 }
      );
    }

    // ✅ Prepare user response
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.username,
      role: user.role || "user",
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "User found",
      user: userResponse,
    });

  } catch (error: unknown) {
    console.error("❌ User me API error:", error);

    // ✅ Generic error response
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch user information" 
      },
      { status: 500 }
    );
  }
}