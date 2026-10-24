import { NextRequest, NextResponse } from "next/server";

const SESSION_SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SESSION_SECRET ||
  "cozzer-luxury-footwear-secret-key-2026-secure";

const COOKIE_NAME = "cozzer_admin_session";

async function verifyTokenEdge(token: string): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [b64Payload, hmac] = token.split(".");
  if (!b64Payload || !hmac) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(b64Payload));
    const hex = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hex !== hmac) return false;

    // Decode base64url payload
    const base64 = b64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);

    if (payload.exp && Date.now() > payload.exp) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only protect admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isValid = token ? await verifyTokenEdge(token) : false;

  // On the login page: if already authenticated, redirect to /admin
  if (pathname === "/admin/login") {
    if (isValid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // On all other /admin routes: if not authenticated, redirect to /admin/login
  if (!isValid) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
