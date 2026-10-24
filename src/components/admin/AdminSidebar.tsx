"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth/admin-auth";
import { useAdminSidebar } from "./AdminSidebarContext";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Layers,
  FileSpreadsheet,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    closeMobile,
  } = useAdminSidebar();

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
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP PERMANENT / COLLAPSIBLE SIDEBAR (>= md)      */}
      {/* ======================================================== */}
      <aside
        aria-label="Admin Desktop Navigation"
        className={cn(
          "hidden md:flex flex-col justify-between bg-[#171717] text-white border-r border-[#2A2927] shrink-0 sticky top-0 h-screen z-30 select-none overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          isCollapsed ? "w-[76px]" : "w-[250px]"
        )}
      >
        <div>
          {/* Brand Header */}
          <div
            className={cn(
              "h-16 border-b border-[#2A2927] flex items-center transition-all duration-300",
              isCollapsed ? "justify-center px-2" : "justify-between px-4"
            )}
          >
            {!isCollapsed ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 group overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#9B7B50] rounded"
                >
                  <div className="w-8 h-8 rounded bg-[#242424] border border-[#9B7B50]/40 flex items-center justify-center shrink-0 group-hover:border-[#9B7B50] transition-colors">
                    <span className="font-sans font-extrabold text-sm text-[#9B7B50]">
                      C
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-sans font-extrabold text-lg tracking-[0.2em] text-white block leading-none uppercase">
                      COZZER
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#9B7B50] font-semibold block mt-1">
                      Admin Workspace
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  className="p-1.5 rounded text-stone-400 hover:text-white hover:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-[#9B7B50] transition-colors"
                  title="Collapse sidebar (Ctrl+B)"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4 text-stone-300" />
                </button>
              </>
            ) : (
              <Link
                href="/admin"
                className="group relative flex items-center justify-center w-9 h-9 rounded bg-[#242424] border border-[#9B7B50]/40 hover:border-[#9B7B50] focus:outline-none focus:ring-1 focus:ring-[#9B7B50] transition-colors"
                aria-label="COZZER Admin Home"
              >
                <span className="font-sans font-extrabold text-base text-[#9B7B50]">
                  C
                </span>
                <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block group-focus-visible:block z-50 rounded bg-[#171717] px-2.5 py-1 text-[11px] font-medium text-white shadow-xl ring-1 ring-[#9B7B50]/40 whitespace-nowrap animate-fadeIn">
                  COZZER Admin
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#171717]" />
                </span>
              </Link>
            )}
          </div>

          {/* Toggle Action Strip (Always visible and effortless to access in both states) */}
          <div className="px-2 pt-2 pb-1 border-b border-[#2A2927]/60">
            <button
              type="button"
              onClick={toggleCollapsed}
              className={cn(
                "w-full flex items-center py-1.5 rounded text-xs text-stone-400 hover:text-white hover:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-[#9B7B50] transition-all",
                isCollapsed ? "justify-center px-0 h-9" : "justify-between px-3 h-8"
              )}
              title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <div className="group relative flex items-center justify-center">
                  <PanelLeftOpen className="w-4 h-4 text-stone-300 group-hover:text-[#9B7B50] transition-colors" />
                  <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block group-focus-visible:block z-50 rounded bg-[#171717] px-2.5 py-1 text-[11px] font-medium text-white shadow-xl ring-1 ring-[#9B7B50]/40 whitespace-nowrap animate-fadeIn">
                    Expand Sidebar (Ctrl+B)
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#171717]" />
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-[11px] font-medium text-stone-400 flex items-center gap-2">
                    <PanelLeftClose className="w-3.5 h-3.5 text-[#9B7B50]" />
                    <span>Collapse Sidebar</span>
                  </span>
                  <kbd className="text-[9px] bg-[#242424] border border-[#2A2927] px-1.5 py-0.5 rounded text-stone-400 font-mono">
                    Ctrl+B
                  </kbd>
                </>
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav
            className={cn(
              "py-3 space-y-1.5 transition-all duration-300",
              isCollapsed ? "px-2" : "px-3"
            )}
            aria-label="Admin Desktop Links"
          >
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) &&
                  !(item.href === "/admin/products" && pathname === "/admin/products/new");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.title}
                  className={cn(
                    "group relative flex items-center h-10 rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#9B7B50]",
                    isCollapsed
                      ? "w-10 mx-auto justify-center px-0"
                      : "w-full px-3 gap-3",
                    isActive
                      ? "bg-[#9B7B50] text-white font-semibold shadow-sm"
                      : "text-stone-300 hover:bg-[#242424] hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-200 overflow-hidden text-xs",
                      isCollapsed
                        ? "w-0 opacity-0 pointer-events-none"
                        : "w-auto opacity-100 flex-1 truncate"
                    )}
                  >
                    {item.title}
                  </span>

                  {/* Accessible tooltip when collapsed */}
                  {isCollapsed && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block group-focus-visible:block z-50 rounded bg-[#171717] px-2.5 py-1.5 text-xs font-medium text-white shadow-xl ring-1 ring-[#9B7B50]/40 whitespace-nowrap animate-fadeIn"
                    >
                      {item.title}
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#171717]" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Bottom Area: Live Site Link & Logout */}
        <div
          className={cn(
            "border-t border-[#2A2927] space-y-1.5 transition-all duration-300",
            isCollapsed ? "p-2" : "p-3"
          )}
        >
          {isCollapsed ? (
            <>
              <Link
                href="/"
                target="_blank"
                aria-label="View Live Catalogue (Public)"
                className="group relative flex items-center justify-center w-10 h-10 mx-auto rounded text-stone-400 hover:text-white hover:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-[#9B7B50] transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#9B7B50] transition-transform group-hover:scale-105" />
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block group-focus-visible:block z-50 rounded bg-[#171717] px-2.5 py-1.5 text-xs font-medium text-white shadow-xl ring-1 ring-[#9B7B50]/40 whitespace-nowrap animate-fadeIn"
                >
                  View Live Catalogue (Public)
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#171717]" />
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign Out"
                className="group relative flex items-center justify-center w-10 h-10 mx-auto rounded text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
              >
                <LogOut className="w-4 h-4 transition-transform group-hover:scale-105" />
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block group-focus-visible:block z-50 rounded bg-[#171717] px-2.5 py-1.5 text-xs font-medium text-white shadow-xl ring-1 ring-[#9B7B50]/40 whitespace-nowrap animate-fadeIn"
                >
                  Sign Out
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#171717]" />
                </div>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-2 text-xs text-stone-400 hover:text-white hover:bg-[#242424] rounded focus:outline-none focus:ring-1 focus:ring-[#9B7B50] transition-all"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <ExternalLink className="w-3.5 h-3.5 text-[#9B7B50] shrink-0" />
                  <span className="truncate">View Live Catalogue</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider bg-[#242424] text-stone-400 px-1.5 py-0.5 rounded font-mono shrink-0 ml-1">
                  Public
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MOBILE DRAWER SIDEBAR (< md)                          */}
      {/* ======================================================== */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        id="admin-mobile-drawer"
        aria-label="Admin Navigation Drawer"
        role="dialog"
        aria-modal={isMobileOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#171717] text-white flex flex-col justify-between border-r border-[#2A2927] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden overflow-y-auto motion-reduce:transition-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        )}
      >
        <div>
          {/* Drawer Header */}
          <div className="h-16 px-4 border-b border-[#2A2927] flex items-center justify-between">
            <Link
              href="/admin"
              onClick={closeMobile}
              className="flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-[#9B7B50] rounded"
            >
              <div className="w-8 h-8 rounded bg-[#242424] border border-[#9B7B50]/40 flex items-center justify-center shrink-0">
                <span className="font-sans font-extrabold text-sm text-[#9B7B50]">
                  C
                </span>
              </div>
              <div>
                <span className="font-sans font-extrabold text-lg tracking-[0.2em] text-white block leading-none uppercase">
                  COZZER
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#9B7B50] font-semibold block mt-1">
                  Admin Workspace
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              className="p-2 rounded text-stone-400 hover:text-white hover:bg-[#242424] focus:outline-none focus:ring-1 focus:ring-[#9B7B50] transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5 text-stone-300" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5" aria-label="Mobile Admin Navigation">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) &&
                  !(item.href === "/admin/products" && pathname === "/admin/products/new");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#9B7B50]",
                    isActive
                      ? "bg-[#9B7B50] text-white font-semibold shadow-sm"
                      : "text-stone-300 hover:bg-[#242424] hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Bottom Area: Live Site Link & Logout */}
        <div className="p-3 border-t border-[#2A2927] space-y-2">
          <Link
            href="/"
            target="_blank"
            onClick={closeMobile}
            className="flex items-center justify-between px-3.5 py-2.5 text-xs text-stone-400 hover:text-white hover:bg-[#242424] rounded focus:outline-none focus:ring-1 focus:ring-[#9B7B50] transition-all"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#9B7B50] shrink-0" />
              <span>View Live Catalogue</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider bg-[#242424] text-stone-400 px-1.5 py-0.5 rounded font-mono">
              Public
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              closeMobile();
              handleLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
