"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { siteConfig } from "@/config/site";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  CheckCircle2,
  AlertTriangle,
  Building,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Shield,
  Database,
  ExternalLink,
} from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <AdminHeader
        title="Store & Integration Settings"
        description="Verify business communication endpoints, database status, and pre-launch credentials."
      />

      {/* Database Connection Status Card */}
      <div className="bg-white border border-[#EAE4D8] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D8]">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#9B7B50]" />
            <h2 className="font-sans text-lg font-bold text-[#171717] tracking-[-0.015em]">
              Supabase PostgreSQL & Auth Status
            </h2>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isSupabaseConfigured
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isSupabaseConfigured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected & Live</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Preview Mode (In-Memory / Local Storage)</span>
              </>
            )}
          </span>
        </div>

        <p className="text-xs text-stone-600 font-normal leading-relaxed">
          {isSupabaseConfigured
            ? "Your Supabase project URL and anonymous API keys are active. Products, variants, categories, and images are synchronized with cloud PostgreSQL."
            : "The application is currently operating in zero-latency preview mode. To connect your cloud database, supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file or deployment environment."}
        </p>

        <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded text-xs space-y-1 font-mono text-stone-600">
          <div>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "Using fallback preview data store"}</div>
          <div>Migration File: supabase/migrations/01_initial_schema.sql (Ready for execution)</div>
        </div>
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
