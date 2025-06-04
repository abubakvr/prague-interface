import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BASE_URL } from "./lib/constants";

async function customFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export default async function middleware(request: NextRequest) {
  // Get the token from cookies or localStorage (in client components)
  const token = request.cookies.get("accessToken")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Check if user has verified email
    const verificationData = await customFetch(
      `${BASE_URL}/api/auth/verify-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!verificationData.isVerified) {
      return NextResponse.redirect(new URL("/verifyemail", request.url));
    }

    // Check if user has API keys
    const apiKeysData = await customFetch(`${BASE_URL}/api/keys/api_keys`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

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
    "/agent/:path*",
    "/paid-orders/:path*",
    "/pendingpayment/:path*",
    "/selling/:path*",
    "/user/:path*",
  ],
};
