import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin, isServiceRoleConfigured } from "../supabase/admin";

// Secret used for HMAC signing of session tokens
const SESSION_SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SESSION_SECRET ||
  "cozzer-luxury-footwear-secret-key-2026-secure";

export const COOKIE_NAME = "cozzer_admin_session";

// Path to local secure hashed credentials store (persistent backup)
const DATA_DIR = path.resolve(process.cwd(), ".data");
const CREDENTIALS_FILE = path.join(DATA_DIR, "admin-auth.json");

// Default initial admin (hashed, never plain text)
const DEFAULT_ADMIN_EMAIL = "admin@cozzer.in";
const DEFAULT_INITIAL_PASSWORD = "cozzer_luxury_admin";

// In-memory failed login attempts tracker for brute-force prevention
interface AttemptRecord {
  attempts: number;
  lockUntil: number;
  lastAttempt: number;
}

const failedAttemptsMap = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_DURATION_MS = 15 * 60 * 1000;

/**
 * Check if an IP or identifier is currently rate limited
 */
export function checkRateLimit(identifier: string): { isLocked: boolean; remainingMinutes: number } {
  const record = failedAttemptsMap.get(identifier);
  if (!record) return { isLocked: false, remainingMinutes: 0 };

  const now = Date.now();
  if (record.lockUntil > now) {
    const remainingMinutes = Math.max(1, Math.ceil((record.lockUntil - now) / 60000));
    return { isLocked: true, remainingMinutes };
  }

  // Reset if window has expired
  if (now - record.lastAttempt > WINDOW_DURATION_MS) {
    failedAttemptsMap.delete(identifier);
  }

  return { isLocked: false, remainingMinutes: 0 };
}

/**
 * Record a failed attempt
 */
export function recordFailedAttempt(identifier: string): { isNowLocked: boolean; remainingMinutes: number } {
  const now = Date.now();
  let record = failedAttemptsMap.get(identifier);

  if (!record || now - record.lastAttempt > WINDOW_DURATION_MS) {
    record = { attempts: 1, lockUntil: 0, lastAttempt: now };
  } else {
    record.attempts += 1;
    record.lastAttempt = now;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_DURATION_MS;
    failedAttemptsMap.set(identifier, record);
    return { isNowLocked: true, remainingMinutes: Math.ceil(LOCKOUT_DURATION_MS / 60000) };
  }

  failedAttemptsMap.set(identifier, record);
  return { isNowLocked: false, remainingMinutes: 0 };
}

/**
 * Clear failed attempts after successful authentication
 */
export function clearFailedAttempts(identifier: string) {
  failedAttemptsMap.delete(identifier);
}

/**
 * Cryptographic password hash helper (scrypt with 16-byte random salt)
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

/**
 * Verify password against stored scrypt hash and salt
 */
export function verifyPasswordHash(password: string, hash: string, salt: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

interface StoredCredentials {
  email: string;
  hash: string;
  salt: string;
  updatedAt: string;
}

/**
 * Read or initialize local hashed credentials store
 */
export function getLocalAdminCredentials(): StoredCredentials {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));
      if (data && data.email && data.hash && data.salt) {
        return data as StoredCredentials;
      }
    }
  } catch (e) {
    console.error("Error reading credentials file:", e);
  }

  // Initialize with default hashed credentials
  const { hash, salt } = hashPassword(DEFAULT_INITIAL_PASSWORD);
  const initialData: StoredCredentials = {
    email: DEFAULT_ADMIN_EMAIL,
    hash,
    salt,
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving initial credentials file:", e);
  }

  return initialData;
}

/**
 * Save updated hashed credentials to local store
 */
export function saveLocalAdminCredentials(email: string, password: string): StoredCredentials {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const { hash, salt } = hashPassword(password);
  const updatedData: StoredCredentials = {
    email: email.trim().toLowerCase(),
    hash,
    salt,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(updatedData, null, 2), "utf-8");
  return updatedData;
}

/**
 * Sign session token (HMAC-SHA256)
 */
export function signSessionToken(payload: { email: string; role: string; exp: number }): string {
  const jsonStr = JSON.stringify(payload);
  const b64Payload = Buffer.from(jsonStr).toString("base64url");
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(b64Payload).digest("hex");
  return `${b64Payload}.${hmac}`;
}

/**
 * Verify session token (HMAC-SHA256)
 */
export function verifySessionToken(token: string): { email: string; role: string; exp: number } | null {
  if (!token || !token.includes(".")) return null;

  const [b64Payload, hmac] = token.split(".");
  if (!b64Payload || !hmac) return null;

  const expectedHmac = crypto.createHmac("sha256", SESSION_SECRET).update(b64Payload).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
    return null;
  }

  try {
    const payloadStr = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a new signed session for admin
 */
export function createAdminSession(email: string) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signSessionToken({ email, role: "admin", exp });
  return {
    email,
    role: "admin",
    token,
    exp,
  };
}

/**
 * Ensure an admin user exists in Supabase Auth
 */
async function ensureSupabaseAdminUser(targetEmail: string, initialPassword: string) {
  const adminClient = getSupabaseAdmin();
  if (!adminClient) return null;

  try {
    const { data } = await adminClient.auth.admin.listUsers();
    const existing = data?.users?.find(
      (u) => u.email?.toLowerCase() === targetEmail.toLowerCase()
    );

    if (existing) {
      return existing;
    }

    // Create user in Supabase Auth if none exists
    const createRes = await adminClient.auth.admin.createUser({
      email: targetEmail,
      password: initialPassword,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });

    return createRes.data?.user || null;
  } catch (err) {
    console.error("Error ensuring Supabase admin user:", err);
    return null;
  }
}

export type AuthResult =
  | { success: true; user: { email: string; role: string }; token: string }
  | { success: false; error: string; errorType: "incorrect_password" | "invalid_user" | "rate_limited" };

/**
 * Server-side verification of admin credentials
 */
export async function authenticateAdminServer(
  emailInput: string,
  passwordInput: string,
  clientIp: string
): Promise<AuthResult> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput;

  // 1. Check Rate Limit
  const rateLimit = checkRateLimit(clientIp);
  if (rateLimit.isLocked) {
    return {
      success: false,
      errorType: "rate_limited",
      error: `Too many failed login attempts. Please wait ${rateLimit.remainingMinutes} minute(s) before trying again.`,
    };
  }

  // 2. Try Supabase Auth first if service role is configured
  const adminClient = getSupabaseAdmin();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (adminClient && supabaseUrl && anonKey) {
    try {
      const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers();

      if (!listError && usersData?.users) {
        // If Supabase Auth is completely empty, initialize default admin
        if (usersData.users.length === 0) {
          const localCreds = getLocalAdminCredentials();
          await ensureSupabaseAdminUser(
            localCreds.email || DEFAULT_ADMIN_EMAIL,
            DEFAULT_INITIAL_PASSWORD
          );
        }

        const freshUsers = (await adminClient.auth.admin.listUsers()).data?.users || [];
        const matchingUser = freshUsers.find((u) => u.email?.toLowerCase() === email);

        if (!matchingUser) {
          // Check if it matches local credentials before declaring invalid user
          const localCreds = getLocalAdminCredentials();
          if (localCreds.email.toLowerCase() !== email) {
            recordFailedAttempt(clientIp);
            return {
              success: false,
              errorType: "invalid_user",
              error: "Invalid username or password.",
            };
          }
        } else {
          // User exists in Supabase Auth! Verify password with Supabase client
          const publicClient = createClient(supabaseUrl, anonKey);
          const { data: signInData, error: signInError } = await publicClient.auth.signInWithPassword({
            email,
            password,
          });

          if (!signInError && signInData.session) {
            clearFailedAttempts(clientIp);
            const session = createAdminSession(email);
            return {
              success: true,
              user: { email, role: "admin" },
              token: session.token,
            };
          }

          // Since the user exists in Supabase Auth, failure means the password was wrong!
          const failRecord = recordFailedAttempt(clientIp);
          if (failRecord.isNowLocked) {
            return {
              success: false,
              errorType: "rate_limited",
              error: `Too many failed login attempts. Please wait ${failRecord.remainingMinutes} minute(s) before trying again.`,
            };
          }
          return {
            success: false,
            errorType: "incorrect_password",
            error: "Incorrect password. Please try again.",
          };
        }
      }
    } catch (e) {
      console.warn("Supabase Auth verification encountered error, checking local store fallback:", e);
    }
  }

  // 3. Fallback to secure server hashed credentials store
  const localCreds = getLocalAdminCredentials();

  if (localCreds.email.toLowerCase() !== email) {
    const failRecord = recordFailedAttempt(clientIp);
    if (failRecord.isNowLocked) {
      return {
        success: false,
        errorType: "rate_limited",
        error: `Too many failed login attempts. Please wait ${failRecord.remainingMinutes} minute(s) before trying again.`,
      };
    }
    return {
      success: false,
      errorType: "invalid_user",
      error: "Invalid username or password.",
    };
  }

  const isPasswordValid = verifyPasswordHash(password, localCreds.hash, localCreds.salt);

  if (!isPasswordValid) {
    const failRecord = recordFailedAttempt(clientIp);
    if (failRecord.isNowLocked) {
      return {
        success: false,
        errorType: "rate_limited",
        error: `Too many failed login attempts. Please wait ${failRecord.remainingMinutes} minute(s) before trying again.`,
      };
    }
    return {
      success: false,
      errorType: "incorrect_password",
      error: "Incorrect password. Please try again.",
    };
  }

  // Password is correct
  clearFailedAttempts(clientIp);
  const session = createAdminSession(email);
  return {
    success: true,
    user: { email, role: "admin" },
    token: session.token,
  };
}

/**
 * Server-side update of admin credentials
 */
export async function updateAdminCredentialsServer(
  currentPassword: string,
  newEmailInput: string,
  newPasswordInput: string,
  currentUserEmail?: string
): Promise<{ success: boolean; error?: string; session?: { email: string; role: string; token: string } }> {
  const newEmail = newEmailInput.trim().toLowerCase();
  const newPassword = newPasswordInput;

  if (!newEmail || !newEmail.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const activeEmail = currentUserEmail || getLocalAdminCredentials().email;

  // 1. Verify current password
  const verifyRes = await authenticateAdminServer(activeEmail, currentPassword, "internal-update");
  if (!verifyRes.success) {
    return {
      success: false,
      error: "Current password verification failed. Please enter your correct current password.",
    };
  }

  // 2. Update Supabase Auth if connected
  const adminClient = getSupabaseAdmin();
  if (adminClient) {
    try {
      const { data } = await adminClient.auth.admin.listUsers();
      const user = data?.users?.find((u) => u.email?.toLowerCase() === activeEmail.toLowerCase());

      if (user) {
        const updateRes = await adminClient.auth.admin.updateUserById(user.id, {
          email: newEmail,
          password: newPassword,
        });

        if (updateRes.error) {
          console.warn("Supabase user update note:", updateRes.error.message);
        }

        // Also update public.admin_users if table exists
        try {
          await adminClient
            .from("admin_users")
            .update({ email: newEmail })
            .eq("id", user.id);
        } catch {
          // ignore if table not created yet
        }
      } else {
        // Create the user with new credentials
        await adminClient.auth.admin.createUser({
          email: newEmail,
          password: newPassword,
          email_confirm: true,
          user_metadata: { role: "admin" },
        });
      }
    } catch (e) {
      console.warn("Could not synchronize credentials update to Supabase Auth:", e);
    }
  }

  // 3. Save to local hashed store (scrypt hash + salt)
  saveLocalAdminCredentials(newEmail, newPassword);

  // 4. Issue updated session
  const newSession = createAdminSession(newEmail);

  return {
    success: true,
    session: {
      email: newEmail,
      role: "admin",
      token: newSession.token,
    },
  };
}
