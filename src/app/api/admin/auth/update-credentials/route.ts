import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  updateAdminCredentialsServer,
  COOKIE_NAME,
} from "@/lib/auth/server-auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify that the requester has an active admin session
    const token =
      req.cookies.get(COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to update credentials." },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session. Please re-authenticate." },
        { status: 401 }
      );
    }

    // 2. Parse payload
    const body = await req.json();
    const { currentPassword, newEmail, newPassword } = body || {};

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "Current password is required to confirm identity." },
        { status: 400 }
      );
    }

    if (!newEmail || !newPassword) {
      return NextResponse.json(
        { success: false, error: "New admin username/email and new password are required." },
        { status: 400 }
      );
    }

    // 3. Update credentials securely
    const result = await updateAdminCredentialsServer(
      currentPassword,
      newEmail,
      newPassword,
      session.email
    );

    if (!result.success || !result.session) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update admin credentials." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin credentials successfully updated.",
      session: {
        email: result.session.email,
        role: result.session.role,
        token: result.session.token,
      },
    });

    // Update session cookie with new token
    response.cookies.set({
      name: COOKIE_NAME,
      value: result.session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    console.error("Update credentials error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while updating credentials." },
      { status: 500 }
    );
  }
}
