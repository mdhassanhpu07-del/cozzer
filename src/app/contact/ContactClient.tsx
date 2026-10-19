"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Building2,
  Sparkles,
} from "lucide-react";

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    subject: "Product Sizing & Availability",
    message: "",
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "");
    
    const lines = [
      `*COZZER Direct Enquiry*`,
      `-----------------------`,
      `*Name:* ${form.name || "Customer"}`,
      form.phone ? `*Phone:* ${form.phone}` : null,
      `*Subject:* ${form.subject}`,
      `*Message:* ${form.message || "I would like to enquire about COZZER footwear."}`,
      `-----------------------`,
    ].filter(Boolean);

    const fullMessage = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${cleanNumber}?text=${fullMessage}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 space-y-16">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-[#9B7B50] font-bold">
          Client Concierge
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#171717] font-normal">
          Contact The House of COZZER
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
          Our footwear specialists are available to answer inquiries regarding sizes, custom requests, catalogue releases, and retail wholesale opportunities.
        </p>
      </div>

      {/* Main Grid: Contact Channels + Direct Consultation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#EAE4D8] p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="font-serif-luxury text-xl font-medium text-[#171717] pb-3 border-b border-[#EAE4D8]">
              Direct Assistance Channels
            </h2>

            {/* WhatsApp Box */}
            <div className="p-4 bg-[#FAF8F5] border border-[#C4AC8D] space-y-2">
              <div className="flex items-center gap-2.5 text-[#171717] font-semibold text-xs uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Instant WhatsApp Concierge</span>
              </div>
              <p className="text-stone-500 text-xs font-light">
                Average response time: Under 15 minutes during studio hours.
              </p>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  "Hello COZZER Team, I would like to consult regarding your footwear catalogue."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#171717] hover:text-[#9B7B50] font-bold pt-1"
              >
                <span>Launch WhatsApp Chat</span>
                <span className="text-xs">&rarr;</span>
              </a>
            </div>

            {/* Telephone */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">
                Direct Telephone
              </span>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                className="text-base text-[#171717] font-medium hover:text-[#9B7B50] flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#9B7B50]" />
                {siteConfig.contact.phone}
              </a>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">
                Official Email
              </span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-sm text-[#171717] font-medium hover:text-[#9B7B50] flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#9B7B50]" />
                {siteConfig.contact.email}
              </a>
            </div>

            {/* Showroom Address */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">
                Experience Studio & Atelier
              </span>
              <div className="text-xs text-stone-600 font-light flex items-start gap-2 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#9B7B50] flex-shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold block">
                Concierge Hours
              </span>
              <div className="text-xs text-stone-600 font-light flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9B7B50] flex-shrink-0" />
                <span>{siteConfig.contact.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Wholesale link notice */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EAE4D8] flex items-start gap-3">
            <Building2 className="w-5 h-5 text-[#9B7B50] flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-[#171717] block">
                Wholesale & Multi-Brand Inquiries?
              </span>
              <p className="text-stone-500 font-light">
                For retailer accounts, bulk catalogues, and distribution terms, please visit our wholesale section.
              </p>
              <a href="/wholesale" className="text-[#9B7B50] hover:underline font-bold block pt-1">
                Go to Wholesale Desk &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Consultation Composer (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#EAE4D8] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-[#EAE4D8] pb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
              Direct Route
            </span>
            <h2 className="font-serif-luxury text-2xl font-normal text-[#171717]">
              Compose a Consultation Message
            </h2>
            <p className="text-stone-500 text-xs font-light">
              This will format your enquiry and open a direct WhatsApp consultation thread with our team.
            </p>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Subject of Enquiry
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
              >
                <option value="Product Sizing & Availability">Product Sizing & Availability</option>
                <option value="Custom / Bespoke Footwear Enquiry">Custom / Bespoke Footwear Enquiry</option>
                <option value="Wholesale & Bulk Retail Purchase">Wholesale & Bulk Retail Purchase</option>
                <option value="Studio Appointment Booking">Studio Appointment Booking</option>
                <option value="General Brand Enquiry">General Brand Enquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Detailed Message
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Mention the shoe model, SKU, your foot size, or specific requirements..."
                className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-white py-3.5 px-6 text-xs uppercase tracking-widest font-bold border border-[#9B7B50] shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Send Enquiry via WhatsApp</span>
            </button>

            <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded text-[11px] text-stone-500 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9B7B50] flex-shrink-0 mt-0.5" />
              <span>
                We respect your privacy. Submitting this form opens a verified WhatsApp consultation and does not store your private data on untrusted third-party servers.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
