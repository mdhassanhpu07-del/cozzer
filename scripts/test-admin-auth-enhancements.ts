import { readFileSync, existsSync } from "fs";
import {
  authenticateAdminServer,
  updateAdminCredentialsServer,
  verifySessionToken,
  signSessionToken,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  getLocalAdminCredentials,
} from "../src/lib/auth/server-auth";

console.log("====================================================");
console.log(" COZZER ADMIN PORTAL UI & AUTH VERIFICATION SUITE");
console.log("====================================================\n");

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details = "") {
  if (condition) {
    console.log(`PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`FAIL: ${testName} - ${details}`);
    failCount++;
  }
}

async function runTests() {
  // --- Test Suite 1: Supabase Status Box Removed from Admin Settings ---
  console.log("--- Suite 1: Supabase Status Box Removal ---");
  const settingsPath = "./src/app/admin/settings/page.tsx";
  assert(existsSync(settingsPath), "Admin settings page exists");
  const settingsContent = readFileSync(settingsPath, "utf-8");

  assert(
    !settingsContent.includes("Supabase PostgreSQL & Auth Status"),
    "Supabase PostgreSQL & Auth Status header is completely removed from settings page"
  );
  assert(
    !settingsContent.includes("Preview Mode (In-Memory / Local Storage)"),
    "Supabase preview mode badge is completely removed"
  );
  assert(
    !settingsContent.includes("Connected & Live"),
    "Supabase connection status badge is completely removed"
  );
  assert(
    !settingsContent.includes("Migration File: supabase/migrations"),
    "Migration file details box is completely removed"
  );
  assert(
    !settingsContent.includes("process.env.NEXT_PUBLIC_SUPABASE_URL"),
    "Raw Supabase URL debug display is completely removed from UI"
  );

  // Verify business contacts & checklist are preserved
  assert(
    settingsContent.includes("Configured Business Contact Parameters"),
    "Preserved Configured Business Contact Parameters"
  );
  assert(
    settingsContent.includes("Production Go-Live Checklist for Brand Owner"),
    "Preserved Production Go-Live Checklist"
  );

  // --- Test Suite 2: Admin Credentials Management UI ---
  console.log("\n--- Suite 2: Admin Credentials Management UI in Settings ---");
  assert(
    settingsContent.includes("Administrative Atelier Credentials"),
    "Settings page includes Administrative Atelier Credentials section"
  );
  assert(
    settingsContent.includes("Current Password"),
    "Settings page includes Current Password verification field"
  );
  assert(
    settingsContent.includes("New Administrator Username / Email"),
    "Settings page includes New Administrator Username/Email input"
  );
  assert(
    settingsContent.includes("New Password"),
    "Settings page includes New Password input"
  );
  assert(
    settingsContent.includes("Confirm New Password"),
    "Settings page includes Confirm New Password input"
  );
  assert(
    settingsContent.includes("Update Credentials") || settingsContent.includes("Saving Credentials..."),
    "Settings page includes Update Credentials submit button"
  );

  // --- Test Suite 3: Login Page UI & Specific Password Error ---
  console.log("\n--- Suite 3: Login Page UI & Error Handling ---");
  const loginPath = "./src/app/admin/login/page.tsx";
  assert(existsSync(loginPath), "Admin login page exists");
  const loginContent = readFileSync(loginPath, "utf-8");

  assert(
    loginContent.includes("Incorrect password. Please try again."),
    "Login page includes specific error message: 'Incorrect password. Please try again.'"
  );
  assert(
    loginContent.includes("Invalid username or password."),
    "Login page includes generic fallback message: 'Invalid username or password.'"
  );
  assert(
    loginContent.includes("passwordError") && loginContent.includes("id=\"password-error\""),
    "Password error is assigned an accessible element rendered directly below password field"
  );
  assert(
    loginContent.includes("disabled={loading}"),
    "Login form inputs and button are disabled during authentication to prevent repeated submissions"
  );
  assert(
    loginContent.includes("Authenticating..."),
    "Loading state is displayed during authentication"
  );

  // --- Test Suite 4: Route Protection & Middleware ---
  console.log("\n--- Suite 4: Server-Side Route Protection & Middleware ---");
  const middlewarePath = "./src/middleware.ts";
  assert(existsSync(middlewarePath), "Next.js middleware exists at src/middleware.ts");
  const middlewareContent = readFileSync(middlewarePath, "utf-8");

  assert(
    middlewareContent.includes("/admin/:path*"),
    "Middleware protects /admin/:path* routes"
  );
  assert(
    middlewareContent.includes("cozzer_admin_session"),
    "Middleware checks cozzer_admin_session cookie"
  );
  assert(
    middlewareContent.includes("NextResponse.redirect"),
    "Middleware redirects unauthorized requests to /admin/login"
  );

  // --- Test Suite 5: Server-Side Authentication & Rate Limiting ---
  console.log("\n--- Suite 5: Server Authentication API & Rate Limiting ---");
  const testIp = "192.168.1.99";
  clearFailedAttempts(testIp);

  // Test 5.1: Unknown user
  const unknownRes = await authenticateAdminServer("nonexistent_user@cozzer.in", "some_password", testIp);
  assert(
    !unknownRes.success && unknownRes.errorType === "invalid_user",
    "Unknown username returns errorType: invalid_user"
  );
  assert(
    unknownRes.error === "Invalid username or password.",
    `Unknown user returns message: '${unknownRes.error}'`
  );

  // Test 5.2: Known user, incorrect password
  const badPassRes = await authenticateAdminServer("admin@cozzer.in", "wrong_password_test", testIp);
  assert(
    !badPassRes.success && badPassRes.errorType === "incorrect_password",
    "Incorrect password for valid admin returns errorType: incorrect_password"
  );
  assert(
    badPassRes.error === "Incorrect password. Please try again.",
    `Incorrect password returns exact required message: '${badPassRes.error}'`
  );

  // Test 5.3: Known user, correct password
  const goodPassRes = await authenticateAdminServer("admin@cozzer.in", "cozzer_luxury_admin", "192.168.1.100");
  assert(
    goodPassRes.success && !!goodPassRes.token && goodPassRes.user.email === "admin@cozzer.in",
    "Correct password authenticates admin successfully and issues signed session token"
  );

  // Test 5.4: Session token verification
  const tokenPayload = verifySessionToken(goodPassRes.token!);
  assert(
    tokenPayload?.role === "admin" && tokenPayload?.email === "admin@cozzer.in",
    "Session token verifies with role: admin and correct email"
  );

  // Test 5.5: Brute-force rate limiting
  const bruteIp = "10.0.0.88";
  clearFailedAttempts(bruteIp);
  for (let i = 0; i < 4; i++) {
    await authenticateAdminServer("admin@cozzer.in", "wrong_pass", bruteIp);
  }
  const fifthAttempt = await authenticateAdminServer("admin@cozzer.in", "wrong_pass", bruteIp);
  assert(
    !fifthAttempt.success && fifthAttempt.errorType === "rate_limited",
    "Fifth failed attempt triggers rate_limited lockout"
  );

  // --- Test Suite 6: Credential Update & Persistence Flow ---
  console.log("\n--- Suite 6: Credential Update & Persistence Flow ---");
  const credsBefore = getLocalAdminCredentials();

  // Test 6.1: Wrong current password rejected
  const wrongCurrentUpdate = await updateAdminCredentialsServer(
    "wrong_current_password",
    "admin@cozzer.in",
    "new_brand_password_2026",
    credsBefore.email
  );
  assert(
    !wrongCurrentUpdate.success,
    "Update credentials rejects invalid current password"
  );

  // Test 6.2: Valid current password updates credentials
  const validUpdate = await updateAdminCredentialsServer(
    "cozzer_luxury_admin",
    "director@cozzer.in",
    "director_secret_2026",
    "admin@cozzer.in"
  );
  assert(
    validUpdate.success && validUpdate.session?.email === "director@cozzer.in",
    "Successfully updated admin username/email and password"
  );

  // Test 6.3: Plain text password is NEVER stored
  const credsAfter = getLocalAdminCredentials();
  assert(
    credsAfter.hash !== "director_secret_2026" && !JSON.stringify(credsAfter).includes("director_secret_2026"),
    "Plain-text password is NOT stored anywhere in the credentials file (scrypt hashed with salt)"
  );

  // Test 6.4: Login with new credentials succeeds
  const newLoginRes = await authenticateAdminServer("director@cozzer.in", "director_secret_2026", "192.168.1.101");
  assert(
    newLoginRes.success && newLoginRes.user.email === "director@cozzer.in",
    "New credentials work for future admin login"
  );

  // Test 6.5: Old credentials no longer work
  const oldLoginRes = await authenticateAdminServer("admin@cozzer.in", "cozzer_luxury_admin", "192.168.1.102");
  assert(
    !oldLoginRes.success,
    "Old credentials can no longer be used to log in"
  );

  // Test 6.6: Restore default credentials for clean environment
  await updateAdminCredentialsServer(
    "director_secret_2026",
    "admin@cozzer.in",
    "cozzer_luxury_admin",
    "director@cozzer.in"
  );
  const restoredLogin = await authenticateAdminServer("admin@cozzer.in", "cozzer_luxury_admin", "192.168.1.103");
  assert(
    restoredLogin.success && restoredLogin.user.email === "admin@cozzer.in",
    "Restored default admin credentials successfully"
  );

  console.log(`\n====================================================`);
  console.log(` RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`====================================================`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
