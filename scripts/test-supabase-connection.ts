import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testConnection() {
  console.log("====================================================");
  console.log(" SUPABASE DATABASE & CREDENTIALS VERIFICATION");
  console.log("====================================================\n");

  if (!supabaseUrl || !anonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    process.exit(1);
  }

  console.log(`Connecting to: ${supabaseUrl}`);

  const supabase = createClient(supabaseUrl, anonKey);
  const adminClient = secretKey ? createClient(supabaseUrl, secretKey) : null;

  // Check categories table
  const { data: catData, error: catError } = await supabase.from("categories").select("count");
  if (catError) {
    console.log(`[x] Categories table status: ${catError.message} (code: ${catError.code})`);
  } else {
    console.log("[✓] Categories table is active and reachable!");
  }

  // Check products table
  const { data: prodData, error: prodError } = await supabase.from("products").select("count");
  if (prodError) {
    console.log(`[x] Products table status: ${prodError.message} (code: ${prodError.code})`);
  } else {
    console.log("[✓] Products table is active and reachable!");
  }

  if (adminClient) {
    const { data: buckets, error: bucketError } = await adminClient.storage.listBuckets();
    if (bucketError) {
      console.log(`[x] Storage buckets check: ${bucketError.message}`);
    } else {
      console.log(`[✓] Storage buckets accessible: ${buckets.map((b) => b.name).join(", ") || "(none yet)"}`);
    }
  }

  console.log("\n====================================================");
  if (catError?.code === "PGRST205" || prodError?.code === "PGRST205") {
    console.log("Next step: Run 'supabase/migrations/01_initial_schema.sql' in Supabase SQL Editor.");
  } else if (!catError && !prodError) {
    console.log("Supabase connection and tables are completely ready!");
  }
  console.log("====================================================");
}

testConnection().catch(console.error);
