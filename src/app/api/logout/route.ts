import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Create a response
  const response = NextResponse.redirect(new URL("/login", request.url));

  // Clear the cookie by setting it with an expired date
  response.cookies.set({
    name: "accessToken",
    value: "",
    expires: new Date(0), // Set to epoch time (1970-01-01)
    path: "/",
    sameSite: "strict",
  });

  return response;
}
