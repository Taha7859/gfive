import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("❌ No user found for email:", email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    console.log("🧩 Password Entered:", password);
    console.log("🧩 Stored Hash:", user.password);
    console.log("🔍 bcrypt Result:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.username,
        role: user.role || "user",
      },
    });

    // ✅ Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    console.log("✅ Token set successfully in cookie");
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Login error:", error.message);
    } else {
      console.error("❌ Unknown error during login:", error);
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
