"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";

interface AdminSidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(
  undefined
);

const STORAGE_KEY = "cozzer_admin_sidebar_collapsed";

export function AdminSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Restore collapsed state from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // localStorage unavailable or restricted
    }
  }, []);

  // Sync isCollapsed to localStorage when updated
  const handleSetCollapsed = useCallback(
    (action: boolean | ((prev: boolean) => boolean)) => {
      setIsCollapsed((prev) => {
        const nextVal = typeof action === "function" ? action(prev) : action;
        try {
          localStorage.setItem(STORAGE_KEY, String(nextVal));
        } catch {
          // localStorage unavailable or restricted
        }
        return nextVal;
      });
    },
    []
  );

  const toggleCollapsed = useCallback(() => {
    handleSetCollapsed((prev) => !prev);
  }, [handleSetCollapsed]);

  const toggleMobileOpen = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Automatically close mobile drawer when navigating between pages
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileOpen]);

  // Global keyboard shortcuts (Escape to close mobile drawer, Ctrl/Cmd + B to toggle collapse)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b" && !isInput) {
        e.preventDefault();
        toggleCollapsed();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, toggleCollapsed]);

  const value = useMemo(
    () => ({
      isCollapsed,
      setIsCollapsed: handleSetCollapsed,
      toggleCollapsed,
      isMobileOpen,
      setIsMobileOpen,
      toggleMobileOpen,
      closeMobile,
    }),
    [
      isCollapsed,
      handleSetCollapsed,
      toggleCollapsed,
      isMobileOpen,
      toggleMobileOpen,
      closeMobile,
    ]
  );

  return (
    <AdminSidebarContext.Provider value={value}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar(): AdminSidebarContextType {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error(
      "useAdminSidebar must be used within an AdminSidebarProvider"
    );
  }
  return context;
}
