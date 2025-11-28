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

// ✅ PRODUCTION LEVEL CONFIGURATION
export const config = {
  matcher: [
    "/login",
    "/signup", 
    "/dashboard/:path*",
    "/profile/:path*",
    "/recuirment/:path*",
    "/checkout/:path*"
    // ❌ SUCCESS PAGE REMOVE KARDO - yeh public honi chahiye
  ],
  runtime: "nodejs",
};

// ✅ PROTECTED ROUTES (jahan login required hai)
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile", 
  "/recuirment",
  "/checkout"
  // ❌ SUCCESS PAGE REMOVE KARDO
];

// ✅ PUBLIC ROUTES (jahan authenticated users ko redirect karna hai)
const PUBLIC_ROUTES = [
  "/login",
  "/signup"
];

// ✅ ALWAYS PUBLIC ROUTES (kisi bhi state mein access ho saken)
const ALWAYS_PUBLIC_ROUTES = [
  "/success",  // ✅ Payment ke baad public honi chahiye
  "/cancel",   // ✅ Cancel page bhi public
  "/api"       // ✅ API routes bhi public (with proper auth in APIs)
];

export function middleware(req: NextRequest) {
  const tokenData = getDataFromToken(req);
  const { pathname } = req.nextUrl;

  // ✅ Pehle check karo agar route always public hai
  const isAlwaysPublic = ALWAYS_PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isAlwaysPublic) {
    return NextResponse.next(); // ✅ Direct allow karo
  }

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

  // ✅ All checks passed - allow request
  return NextResponse.next();
}