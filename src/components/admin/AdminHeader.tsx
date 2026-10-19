"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminSession, AdminSession } from "@/lib/auth/admin-auth";
import { Shield, ExternalLink, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({ title, description, action }: AdminHeaderProps) {
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    setSession(getAdminSession());
  }, []);

  return (
    <header className="bg-white border-b border-[#EAE4D8] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-serif-luxury text-2xl font-semibold text-[#171717]">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-stone-500 font-light mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {action}

        {/* User Identity Pill */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EAE4D8] px-3 py-1.5 rounded text-xs text-stone-700">
          <User className="w-3.5 h-3.5 text-[#9B7B50]" />
          <span className="font-medium text-[11px] truncate max-w-[150px]">
            {session?.email || "admin@cozzer.in"}
          </span>
          <span className="text-[9px] uppercase tracking-wider bg-[#171717] text-white px-1.5 py-0.5 rounded font-bold">
            {session?.isDemo ? "Preview" : "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
