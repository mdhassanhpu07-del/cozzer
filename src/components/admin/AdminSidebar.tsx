"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth/admin-auth";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Layers,
  FileSpreadsheet,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const navItems = [
    {
      title: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Products Catalogue",
      href: "/admin/products",
      icon: Package,
      exact: false,
    },
    {
      title: "Add New Product",
      href: "/admin/products/new",
      icon: PlusCircle,
      exact: true,
    },
    {
      title: "Category Manager",
      href: "/admin/categories",
      icon: Layers,
      exact: true,
    },
    {
      title: "CSV Bulk Import",
      href: "/admin/import",
      icon: FileSpreadsheet,
      exact: true,
    },
    {
      title: "Store Settings",
      href: "/admin/settings",
      icon: Settings,
      exact: true,
    },
  ];

  return (
    <aside className="w-64 bg-[#171717] text-white min-h-screen flex flex-col justify-between border-r border-[#2A2927]">
      <div>
        {/* Brand Area */}
        <div className="p-6 border-b border-[#2A2927]">
          <Link href="/admin" className="block">
            <span className="font-display font-extrabold text-2xl tracking-[0.2em] text-white">
              COZZER
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9B7B50] font-bold block mt-0.5">
              Admin Workspace
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) &&
                !(item.href === "/admin/products" && pathname === "/admin/products/new");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded transition-all",
                  isActive
                    ? "bg-[#9B7B50] text-white font-semibold shadow-sm"
                    : "text-stone-300 hover:bg-[#242424] hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Live Site Link & Logout */}
      <div className="p-4 border-t border-[#2A2927] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 text-xs text-stone-400 hover:text-white hover:bg-[#242424] rounded transition-all"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#9B7B50]" />
            View Live Catalogue
          </span>
          <span className="text-[10px] text-stone-500 font-mono">Public</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 rounded transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
