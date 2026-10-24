import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/server-auth";

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get(COOKIE_NAME)?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role,
    },
  });
}
