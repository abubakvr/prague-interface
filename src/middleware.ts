import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Get the token from cookies or localStorage (in client components)
  const token = request.cookies.get("accessToken")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Check if user has verified email
    const verificationResponse = await fetch(
      "http://localhost:5005/api/auth/verify-status",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verificationData = await verificationResponse.json();

    if (!verificationData.isVerified) {
      return NextResponse.redirect(new URL("/verifyemail", request.url));
    }

    // Check if user has API keys
    const apiKeysResponse = await fetch(
      "http://localhost:5005/api/keys/api_keys",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const apiKeysData = await apiKeysResponse.json();

    // If user doesn't have API keys and is trying to access protected routes
    // that require API keys, redirect to add keys page
    if (
      !apiKeysData.isKeyAdded &&
      !request.nextUrl.pathname.includes("/addkeys")
    ) {
      return NextResponse.redirect(new URL("/addkeys", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    // return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ads/:path*",
    "/orderdetails/:path*",
    "/orders/:path*",
    "/paying/:path*",
    "/pendingpayment/:path*",
    "/selling/:path*",
    "/user/:path*",
  ],
};
