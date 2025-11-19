import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/profile/:path*",
    "/recuirment", // ✅ add your protected route here
  ],
  runtime: "nodejs",
};

export function middleware(req: NextRequest) {
  const tokenData = getDataFromToken(req); // function jo token se user data nikalti hai
  const { pathname } = req.nextUrl;

  // Agar user login hai aur login/signup route par ja raha hai → redirect to home
  if (tokenData && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Agar user login nahi hai aur protected route access kar raha hai → redirect to login
  const protectedRoutes = ["/dashboard", "/profile", "/recuirment"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!tokenData && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
