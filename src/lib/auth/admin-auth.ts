"use client";

import { isSupabaseConfigured, supabase } from "../supabase/client";

const ADMIN_SESSION_KEY = "cozzer_admin_session_token";

export interface AdminSession {
  email: string;
  role: string;
  token: string;
  isDemo?: boolean;
}

export interface LoginResult {
  success: boolean;
  session?: AdminSession;
  error?: string;
  errorType?: "incorrect_password" | "invalid_user" | "rate_limited";
}

/**
 * Authenticate admin against server-side endpoint with Supabase Auth verification
 */
export async function loginAdmin(email: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Authentication failed.",
        errorType: data.errorType || "invalid_user",
      };
    }

    const session: AdminSession = {
      email: data.session.email,
      role: data.session.role || "admin",
      token: data.session.token,
      isDemo: false,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }

    // Keep client-side Supabase session synchronized if active
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signInWithPassword({ email, password });
      } catch {
        // Handled silently since server session is already valid
      }
    }

    return { success: true, session };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Authentication network request failed.";
    return { success: false, error: msg, errorType: "invalid_user" };
  }
}

/**
 * Retrieve current active admin session
 */
export function getAdminSession(): AdminSession | null {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Securely update admin username/email and password
 */
export async function updateAdminCredentials(
  currentPassword: string,
  newEmail: string,
  newPassword: string
): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  try {
    const currentSession = getAdminSession();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (currentSession?.token) {
      headers["Authorization"] = `Bearer ${currentSession.token}`;
    }

    const res = await fetch("/api/admin/auth/update-credentials", {
      method: "POST",
      headers,
      body: JSON.stringify({ currentPassword, newEmail, newPassword }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Failed to update admin credentials.",
      };
    }

    const session: AdminSession = {
      email: data.session.email,
      role: data.session.role || "admin",
      token: data.session.token,
      isDemo: false,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }

    return { success: true, session };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to communicate with credentials service.";
    return { success: false, error: msg };
  }
}

/**
 * Logout admin and clear both server cookies and client storage
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await fetch("/api/admin/auth/logout", { method: "POST" });
  } catch {
    // ignore
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
