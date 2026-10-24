"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/lib/auth/admin-auth";
import { Lock, Mail, Shield, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginAdmin(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Authentication failed.");
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@cozzer.in");
    setPassword("cozzer_luxury_admin");
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col justify-center items-center p-4 selection:bg-[#9B7B50] selection:text-white">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <span className="font-sans font-extrabold text-3xl tracking-[0.2em] text-white uppercase">
              COZZER
            </span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#9B7B50]">
              Administrative Atelier Access
            </h1>
            <p className="text-stone-400 text-xs font-normal">
              Secure portal for product cataloguing, inventory, and B2B pricing.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 border border-[#EAE4D8] shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cozzer.in"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-white py-3 px-6 text-xs uppercase tracking-widest font-bold border border-[#9B7B50] shadow-md transition-all disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Enter Admin Workspace"}</span>
              <ArrowRight className="w-4 h-4 text-[#9B7B50]" />
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-4 border-t border-[#EAE4D8] text-center space-y-2">
            <p className="text-[11px] text-stone-500">
              Evaluating the application preview?
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs text-[#9B7B50] hover:text-[#7D623C] font-semibold underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Credentials (admin@cozzer.in)</span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-white transition-colors"
          >
            &larr; Return to Public Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
