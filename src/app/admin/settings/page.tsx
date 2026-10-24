"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { siteConfig } from "@/config/site";
import { getAdminSession, updateAdminCredentials } from "@/lib/auth/admin-auth";
import {
  Building,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const session = getAdminSession();
    if (session?.email) {
      setCurrentEmail(session.email);
      setNewEmail(session.email);
    }
  }, []);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setErrorMsg("Please enter your current password to authorize this change.");
      return;
    }

    if (!newEmail || !newEmail.includes("@")) {
      setErrorMsg("Please enter a valid administrator email address.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation password do not match.");
      return;
    }

    setIsUpdating(true);
    const result = await updateAdminCredentials(currentPassword, newEmail, newPassword);
    setIsUpdating(false);

    if (result.success && result.session) {
      setCurrentEmail(result.session.email);
      setSuccessMsg("Administrator credentials updated successfully. Please use these credentials for your next login.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setErrorMsg(result.error || "Failed to update administrator credentials.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <AdminHeader
        title="Store & Integration Settings"
        description="Verify business communication endpoints, administrative credentials, and pre-launch configuration."
      />

      {/* Administrative Access & Credentials Card */}
      <div className="bg-white border border-[#EAE4D8] p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D8]">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-[#9B7B50]" />
            <h2 className="font-sans text-lg font-bold text-[#171717] tracking-[-0.015em]">
              Administrative Atelier Credentials
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Active: <strong className="text-[#171717]">{currentEmail || "admin@cozzer.in"}</strong>
          </span>
        </div>

        <p className="text-xs text-stone-600 font-normal leading-relaxed">
          Update your administrator username/email and password. Changes take effect immediately and persist securely across sessions and deployments.
        </p>

        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Password */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={isUpdating}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to verify identity"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* New Administrator Username / Email */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                New Administrator Username / Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={isUpdating}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@cozzer.in"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={isUpdating}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={isUpdating}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-white py-2.5 px-6 text-xs uppercase tracking-widest font-bold border border-[#9B7B50] shadow-sm transition-all disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#9B7B50] border-t-transparent rounded-full animate-spin" />
                  <span>Saving Credentials...</span>
                </>
              ) : (
                <span>Update Credentials</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Configured Business Contact Endpoints */}
      <div className="bg-white border border-[#EAE4D8] p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#EAE4D8]">
          <Building className="w-5 h-5 text-[#9B7B50]" />
          <h2 className="font-sans text-lg font-bold text-[#171717] tracking-[-0.015em]">
            Configured Business Contact Parameters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] space-y-1">
            <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              WhatsApp Concierge Number
            </span>
            <p className="font-semibold text-sm text-[#171717]">
              +{siteConfig.contact.whatsappNumber}
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] space-y-1">
            <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#9B7B50]" />
              Support Phone Line
            </span>
            <p className="font-semibold text-sm text-[#171717]">
              {siteConfig.contact.phone}
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] space-y-1">
            <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#9B7B50]" />
              Concierge Email
            </span>
            <p className="font-semibold text-sm text-[#171717]">
              {siteConfig.contact.email}
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] space-y-1">
            <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9B7B50]" />
              Operating Hours
            </span>
            <p className="font-semibold text-sm text-[#171717]">
              {siteConfig.contact.businessHours}
            </p>
          </div>

          <div className="md:col-span-2 p-3 bg-[#FAF8F5] border border-[#EAE4D8] space-y-1">
            <span className="text-stone-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#9B7B50]" />
              Studio Address
            </span>
            <p className="font-semibold text-sm text-[#171717]">
              {siteConfig.contact.address}
            </p>
          </div>
        </div>
      </div>

      {/* Production Launch Checklist */}
      <div className="bg-[#FAF8F5] border-2 border-[#9B7B50]/30 p-6 space-y-4">
        <h2 className="font-sans text-xl font-bold text-[#171717] flex items-center gap-2 tracking-[-0.015em]">
          <Shield className="w-5 h-5 text-[#9B7B50]" />
          Production Go-Live Checklist for Brand Owner
        </h2>

        <div className="space-y-3 text-xs text-stone-700">
          <label className="flex items-start gap-2.5">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#9B7B50] rounded mt-0.5" />
            <div>
              <strong>1. Custom Domain DNS Record:</strong> Add CNAME/A records pointing to Vercel/production host for <code>cozzer.in</code>.
            </div>
          </label>

          <label className="flex items-start gap-2.5">
            <input type="checkbox" className="w-4 h-4 text-[#9B7B50] rounded mt-0.5" />
            <div>
              <strong>2. Real WhatsApp & Phone:</strong> Update <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code> and <code>NEXT_PUBLIC_SUPPORT_PHONE</code> with your designated Indian SIM or WhatsApp Business API line.
            </div>
          </label>

          <label className="flex items-start gap-2.5">
            <input type="checkbox" className="w-4 h-4 text-[#9B7B50] rounded mt-0.5" />
            <div>
              <strong>3. Supabase Cloud Project:</strong> Create a project on supabase.com, run <code>supabase/migrations/01_initial_schema.sql</code>, and paste the URL and keys in your host environment variables.
            </div>
          </label>

          <label className="flex items-start gap-2.5">
            <input type="checkbox" className="w-4 h-4 text-[#9B7B50] rounded mt-0.5" />
            <div>
              <strong>4. CSV Footwear Import:</strong> Download the CSV template, populate with real inventory and image URLs, and use the CSV Bulk Importer in this admin portal.
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
