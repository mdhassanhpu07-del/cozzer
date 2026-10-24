"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { generateWholesaleWhatsAppUrl } from "@/lib/utils";
import {
  Building2,
  Package,
  Truck,
  CheckCircle2,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Percent,
} from "lucide-react";

export default function WholesaleClient() {
  const [form, setForm] = useState({
    businessName: "",
    contactPerson: "",
    city: "",
    category: "Casual Shoes",
    estimatedPairs: "24",
    notes: "",
  });

  const handleWholesaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateWholesaleWhatsAppUrl({
      businessName: form.businessName,
      contactPerson: form.contactPerson,
      city: form.city,
      categoryOfInterest: form.category,
      estimatedPairs: form.estimatedPairs,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="bg-[#171717] text-white py-16 md:py-24 px-4 md:px-8 border-b border-[#2A2927]">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 border border-[#9B7B50]/60 bg-black/40 px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#F5F1E8]">
            <Building2 className="w-3.5 h-3.5 text-[#9B7B50]" />
            <span>B2B Retailer & Distributor Desk</span>
          </div>
          <h1 className="font-sans text-[clamp(2.25rem,4.5vw+0.5rem,3.75rem)] font-extrabold uppercase tracking-[-0.03em] leading-[1.08]">
            Wholesale Alliances & Distribution
          </h1>
          <p className="text-stone-300 text-sm md:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Partner with COZZER to introduce bespoke-grade Indian luxury footwear into your retail stores, multi-brand boutiques, and regional footwear chains.
          </p>
        </div>
      </section>

      {/* Wholesale Pillars & Minimums */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#EAE4D8] p-8 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C4AC8D] flex items-center justify-center text-[#9B7B50]">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-xl font-bold text-[#171717] tracking-[-0.015em]">
              Accessible Low MOQs
            </h3>
            <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed font-normal">
              We empower independent boutique owners with an entry threshold of just <strong>12 pairs</strong> per silhouette run, across standard Indian size assortments (UK 6 – 11).
            </p>
          </div>

          <div className="bg-white border border-[#EAE4D8] p-8 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C4AC8D] flex items-center justify-center text-[#9B7B50]">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-xl font-bold text-[#171717] tracking-[-0.015em]">
              Tiered Retail Margins
            </h3>
            <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed font-normal">
              Structured B2B pricing provides healthy gross margins (35% to 52%) for retail storefronts, supported by strict MAP (Minimum Advertised Price) enforcement.
            </p>
          </div>

          <div className="bg-white border border-[#EAE4D8] p-8 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#C4AC8D] flex items-center justify-center text-[#9B7B50]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-xl font-bold text-[#171717] tracking-[-0.015em]">
              Insured B2B Logistics
            </h3>
            <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed font-normal">
              Door-to-door insured freight across 19,000+ pin codes in India, dispatched directly from our central manufacturing warehouse.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Tiers Grid */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Tiers and B2B Terms (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF8F5] border border-[#EAE4D8] p-6 sm:p-8 space-y-6">
              <h2 className="font-sans text-2xl font-bold text-[#171717] pb-3 border-b border-[#EAE4D8] tracking-[-0.02em]">
                Wholesale Order Tiers
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-white border border-[#EAE4D8] space-y-1">
                  <div className="flex justify-between items-center font-bold text-[#171717]">
                    <span>Tier 1: Boutique Trial</span>
                    <span className="text-[#9B7B50]">12 – 48 Pairs</span>
                  </div>
                  <p className="text-stone-500 font-normal">
                    Ideal for concept stores, bespoke ateliers, and initial catalogue testing.
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#EAE4D8] space-y-1">
                  <div className="flex justify-between items-center font-bold text-[#171717]">
                    <span>Tier 2: Retail Stockist</span>
                    <span className="text-[#9B7B50]">49 – 120 Pairs</span>
                  </div>
                  <p className="text-stone-500 font-normal">
                    Enhanced volume margin, preferential production slotting, and POS display assets.
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#EAE4D8] space-y-1">
                  <div className="flex justify-between items-center font-bold text-[#171717]">
                    <span>Tier 3: Master Regional Distributor</span>
                    <span className="text-[#9B7B50]">120+ Pairs</span>
                  </div>
                  <p className="text-stone-500 font-normal">
                    Exclusive regional distribution rights, custom logo stamping options, and dedicated account management.
                  </p>
                </div>
              </div>

              {/* Direct B2B Contact Info */}
              <div className="pt-4 border-t border-[#EAE4D8] space-y-2 text-xs">
                <p className="font-semibold text-[#171717]">Prefer Direct Voice Call?</p>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center gap-2 text-stone-700 hover:text-[#9B7B50]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#9B7B50]" />
                  <span>Call B2B Desk: {siteConfig.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.contact.wholesaleEmail}`}
                  className="flex items-center gap-2 text-stone-700 hover:text-[#9B7B50]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#9B7B50]" />
                  <span>{siteConfig.contact.wholesaleEmail}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive B2B Wholesale Enquiry Generator (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#EAE4D8] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-[#EAE4D8] pb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
                B2B Portal
              </span>
              <h2 className="font-sans text-2xl font-bold text-[#171717] tracking-[-0.02em]">
                Submit Wholesale / Retailer Enquiry
              </h2>
              <p className="text-stone-600 text-xs sm:text-[13px] font-normal leading-relaxed">
                Fill out your firm details below. Our wholesale dispatch manager will connect with you on WhatsApp with commercial price sheets and line-sheets.
              </p>
            </div>

            <form onSubmit={handleWholesaleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Firm / Store Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="e.g. Regal Footwear Boutiques"
                    className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    placeholder="e.g. Vikram Mehra (Owner)"
                    className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    City & State
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Surat, Gujarat"
                    className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Primary Category of Interest
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  >
                    <option value="Casual Shoes">Casual Shoes (Sneakers / Court)</option>
                    <option value="Formal Shoes">Formal Shoes (Oxfords / Derbies)</option>
                    <option value="Loafers">Loafers (Penny / Tassel / Driving)</option>
                    <option value="Boots">Boots (Chelsea / Brogue Boots)</option>
                    <option value="Ethnic Footwear">Ethnic Footwear (Juttis / Mojaris)</option>
                    <option value="Kids' Shoes">Kids&apos; Footwear</option>
                    <option value="Mixed Assortment">Mixed Catalogue Assortment</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Estimated Quantity Requirement
                </label>
                <select
                  value={form.estimatedPairs}
                  onChange={(e) => setForm({ ...form, estimatedPairs: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                >
                  <option value="12 - 24">12 – 24 Pairs (Trial Batch)</option>
                  <option value="25 - 50">25 – 50 Pairs</option>
                  <option value="51 - 100">51 – 100 Pairs</option>
                  <option value="100+">100+ Pairs (Regional Stockist)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#171717] hover:bg-[#2A2927] text-white py-4 px-6 text-xs uppercase tracking-widest font-bold border border-[#9B7B50] shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Submit Wholesale Enquiry on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
