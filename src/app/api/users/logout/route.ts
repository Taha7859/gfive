import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // ✅ PRODUCTION-READY COOKIE CLEARING
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS in production
      sameSite: "lax", // ✅ CSRF protection
      path: "/", // ✅ Clear for all paths
      expires: new Date(0), // ✅ Immediate expiration
    });

    // ✅ ADD SECURITY HEADERS
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");

    return response;

  } catch (error: unknown) {
    console.error("❌ Logout error:", error);
    
    // ✅ BETTER ERROR RESPONSE
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { 
        message: "Logout failed", 
        error: errorMessage,
        success: false 
      }, 
      { status: 500 }
    );
  }
}