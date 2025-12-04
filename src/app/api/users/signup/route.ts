// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";

// connect();

// export async function POST(request: NextRequest) {
//   try {
//     const { username, email, password } = await request.json();

//     // ✅ Trim inputs
//     const cleanUsername = username?.trim();
//     const cleanEmail = email?.trim().toLowerCase();
//     const cleanPassword = password?.trim();

//     // ✅ Validate fields
//     if (!cleanUsername || !cleanEmail || !cleanPassword) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(cleanEmail)) {
//       return NextResponse.json(
//         { message: "Please enter a valid email address" },
//         { status: 400 }
//       );
//     }

//     // ✅ NEW: Simple password validation - 6 characters with at least 1 number
//     const passwordRegex = /^(?=.*\d).{6,}$/;
//     if (!passwordRegex.test(cleanPassword)) {
//       return NextResponse.json(
//         {
//           message: "Password must be at least 6 characters long and contain at least 1 number",
//         },
//         { status: 400 }
//       );
//     }

//     // ✅ Check if user already exists
//     const existingUser = await User.findOne({ email: cleanEmail });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: "An account with this email already exists. Please login." },
//         { status: 400 }
//       );
//     }

//     // ✅ Hash password securely
//     const hashedPassword = await bcryptjs.hash(cleanPassword, 12);

//     // ✅ Create user
//     const newUser = await User.create({
//       username: cleanUsername,
//       email: cleanEmail,
//       password: hashedPassword,
//     });

//     // ✅ Send verification email
//     await sendEmail({
//       email: newUser.email,
//       emailType: "VERIFY",
//       userId: newUser._id.toString(),
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Account created successfully! Please check your email to verify your account.",
//         user: {
//           id: newUser._id.toString(),
//           username: newUser.username,
//           email: newUser.email,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error: unknown) {
//     console.error("❌ Signup error:", error);
    
//     return NextResponse.json(
//       { message: "Something went wrong. Please try again." },
//       { status: 500 }
//     );
//   }
// }
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    // ✅ YEH CHANGE KAREIN: confirmPassword bhi receive karein
    const { username, email, password, confirmPassword } = await request.json();

    // ✅ Trim inputs
    const cleanUsername = username?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();
    const cleanConfirmPassword = confirmPassword?.trim(); // ✅ NAYA

    // ✅ Validate fields - confirmPassword bhi add karein
    if (!cleanUsername || !cleanEmail || !cleanPassword || !cleanConfirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // ✅ NEW: Password match validation
    if (cleanPassword !== cleanConfirmPassword) {
      return NextResponse.json(
        { message: "Password and Confirm Password do not match" },
        { status: 400 }
      );
    }

    // ✅ NEW: Simple password validation - 6 characters with at least 1 number
    const passwordRegex = /^(?=.*\d).{6,}$/;
    if (!passwordRegex.test(cleanPassword)) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters long and contain at least 1 number",
        },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please login." },
        { status: 400 }
      );
    }

    // ✅ Hash password securely
    const hashedPassword = await bcryptjs.hash(cleanPassword, 12);

    // ✅ Create user
    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    // ✅ Send verification email
    await sendEmail({
      email: newUser.email,
      emailType: "VERIFY",
      userId: newUser._id.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
        user: {
          id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("❌ Signup error:", error);
    
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}