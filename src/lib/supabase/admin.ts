import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServiceRoleConfigured = Boolean(
  isSupabaseConfigured &&
  serviceRoleKey &&
  !serviceRoleKey.includes("your-supabase-service-role")
);

// Server-side Admin Supabase client using Service Role
export const getSupabaseAdmin = () => {
  if (!isServiceRoleConfigured) {
    return null;
  }
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
