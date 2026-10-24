"use client";

import React, { useEffect, useState } from "react";
import { getAdminSession, AdminSession } from "@/lib/auth/admin-auth";
import { useAdminSidebar } from "./AdminSidebarContext";
import { User, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({
  title,
  description,
  action,
}: AdminHeaderProps) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    toggleMobileOpen,
  } = useAdminSidebar();

  useEffect(() => {
    setSession(getAdminSession());
  }, []);

  return (
    <header className="bg-white border border-[#EAE4D8] px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={toggleMobileOpen}
          className="md:hidden p-1.5 -ml-1 text-stone-700 hover:text-[#171717] hover:bg-[#FAF8F5] rounded border border-[#EAE4D8] focus:outline-none focus:ring-2 focus:ring-[#9B7B50] transition-colors shrink-0"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileOpen}
          aria-controls="admin-mobile-drawer"
        >
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>

        {/* Desktop Sidebar Toggle in Header */}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden md:flex p-1.5 -ml-1 text-stone-500 hover:text-[#171717] hover:bg-[#FAF8F5] rounded border border-transparent hover:border-[#EAE4D8] focus:outline-none focus:ring-2 focus:ring-[#9B7B50] transition-colors shrink-0"
          aria-label={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-stone-600" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-stone-600" />
          )}
        </button>

        <div className="min-w-0">
          <h1 className="font-sans text-xl sm:text-2xl font-bold text-[#171717] truncate leading-tight tracking-[-0.015em]">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-stone-500 font-normal mt-0.5 line-clamp-1 sm:line-clamp-none">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 shrink-0">
        {action}

        {/* User Identity Pill */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EAE4D8] px-3 py-1.5 rounded text-xs text-stone-700">
          <User className="w-3.5 h-3.5 text-[#9B7B50] shrink-0" />
          <span className="font-medium text-[11px] truncate max-w-[120px] sm:max-w-[150px]">
            {session?.email || "admin@cozzer.in"}
          </span>
          <span className="text-[9px] uppercase tracking-wider bg-[#171717] text-white px-1.5 py-0.5 rounded font-bold shrink-0">
            {session?.isDemo ? "Preview" : "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
