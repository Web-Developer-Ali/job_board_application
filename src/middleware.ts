import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({ req:req, secret: process.env.NEXTAUTH_SECRET });
console.log("token:",token)
  if (token !== null) {
    // Redirect new users who haven't completed onboarding
    if (
      token.isNewUser === true &&
      token.onboardComplete === false &&
      (url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up"))
    ) {
      return NextResponse.redirect(
        new URL(`/onboard/email=${token.email}`, req.url)
      );
    }

    // Redirect users who haven't completed onboarding
    if (
      token.onboardComplete === false &&
      (url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up"))
    ) {
      return NextResponse.redirect(
        new URL(`/onboard/email=${token.email}`, req.url)
      );
    }

    // Redirect authenticated users away from sign-in or sign-up pages
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Prevent candidates from accessing recruiter routes
    if (token.role === 'candidate' && url.pathname.startsWith("/recruiter")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/recruiter/:path*"], // Protect recruiter routes
};
