import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminServer, COOKIE_NAME } from "@/lib/auth/server-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          errorType: "invalid_user",
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await authenticateAdminServer(email, password, clientIp);

    if (!result.success) {
      const status = result.errorType === "rate_limited" ? 429 : 401;
      return NextResponse.json(
        {
          success: false,
          errorType: result.errorType,
          error: result.error,
        },
        { status }
      );
    }

    const response = NextResponse.json({
      success: true,
      session: {
        email: result.user.email,
        role: result.user.role,
        token: result.token,
      },
    });

    // Set secure HttpOnly session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    console.error("Login route error:", err);
    return NextResponse.json(
      {
        success: false,
        errorType: "invalid_user",
        error: "An unexpected error occurred during authentication.",
      },
      { status: 500 }
    );
  }
}
