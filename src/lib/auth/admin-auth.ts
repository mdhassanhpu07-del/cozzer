"use client";

import { isSupabaseConfigured, supabase } from "../supabase/client";

const ADMIN_SESSION_KEY = "cozzer_admin_session_token";
const DEMO_ADMIN_EMAIL = "admin@cozzer.in";
const DEMO_ADMIN_PASSWORD = "cozzer_luxury_admin";

export interface AdminSession {
  email: string;
  role: string;
  token: string;
  isDemo?: boolean;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  // 1. If Supabase is configured, use Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        const session: AdminSession = {
          email: data.user.email || email,
          role: "admin",
          token: data.session.access_token,
          isDemo: false,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        }
        return { success: true, session };
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication failed";
      return { success: false, error: msg };
    }
  }

  // 2. Demo / Preview mode authentication
  if (
    (email.trim().toLowerCase() === DEMO_ADMIN_EMAIL.toLowerCase() && password === DEMO_ADMIN_PASSWORD) ||
    (email.includes("@") && password.length >= 6)
  ) {
    const session: AdminSession = {
      email,
      role: "admin",
      token: `demo-token-${Date.now()}`,
      isDemo: true,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }
    return { success: true, session };
  }

  return {
    success: false,
    error: `Invalid credentials. For preview mode, use ${DEMO_ADMIN_EMAIL} and password: ${DEMO_ADMIN_PASSWORD}`,
  };
}

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

export async function logoutAdmin(): Promise<void> {
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
