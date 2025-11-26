// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getDataFromToken } from "@/helpers/getDataFromToken";

// export const config = {
//   matcher: [
//     "/login",
//     "/signup",
//     "/dashboard/:path*",
//     "/profile/:path*",
//     "/recuirment", // ✅ add your protected route here
//   ],
//   runtime: "nodejs",
// };

// export function middleware(req: NextRequest) {
//   const tokenData = getDataFromToken(req); // function jo token se user data nikalti hai
//   const { pathname } = req.nextUrl;

//   // Agar user login hai aur login/signup route par ja raha hai → redirect to home
//   if (tokenData && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // Agar user login nahi hai aur protected route access kar raha hai → redirect to login
//   const protectedRoutes = ["/dashboard", "/profile", "/recuirment"];
//   const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

//   if (!tokenData && isProtected) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// ✅ Production level configuration
export const config = {
  matcher: [
    "/login",
    "/signup", 
    "/dashboard/:path*",
    "/profile/:path*",
    "/recuirment/:path*",
    "/success/:path*", // ✅ Success page ko bhi protect karega
    "/checkout/:path*" // ✅ Checkout page bhi protect rahe
  ],
  runtime: "nodejs",
};

// ✅ Protected routes define karte hain
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile", 
  "/recuirment",
  "/success", // ✅ Success page protected
  "/checkout" // ✅ Checkout page protected
];

// ✅ Public routes (jahan authenticated users ko redirect karna hai)
const PUBLIC_ROUTES = [
  "/login",
  "/signup"
];

export function middleware(req: NextRequest) {
  const tokenData = getDataFromToken(req);
  const { pathname } = req.nextUrl;

  // ✅ Current route check karte hain
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // ✅ CASE 1: User already logged in but trying to access login/signup
  if (tokenData && isPublicRoute) {
    console.log(`🔄 Authenticated user redirected from ${pathname} to home`);
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ CASE 2: User not logged in but trying to access protected routes
  if (!tokenData && isProtectedRoute) {
    console.log(`🚫 Unauthorized access attempt to ${pathname}`);
    
    // ✅ Login page par redirect karte hain with return URL
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // ✅ CASE 3: Success page specific protection
  if (pathname.startsWith("/success") && !tokenData) {
    console.log(`🔒 Unauthorized access to success page`);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ All checks passed - allow request
  return NextResponse.next();
}