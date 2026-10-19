"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAdminSession } from "@/lib/auth/admin-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If on login page, don't protect
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    const session = getAdminSession();
    if (!session) {
      setIsAuthenticated(false);
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#9B7B50] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-stone-500">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Fixed/Sticky Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
