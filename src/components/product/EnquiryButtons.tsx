"use client";

import React from "react";
import { MessageCircle, Phone, Sparkles, Building2 } from "lucide-react";
import { generateWhatsAppEnquiryUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import Link from "next/link";

interface EnquiryButtonsProps {
  productName: string;
  sku: string;
  selectedSize?: string;
  selectedColour?: string;
  price: number;
}

export default function EnquiryButtons({
  productName,
  sku,
  selectedSize,
  selectedColour,
  price,
}: EnquiryButtonsProps) {
  const whatsappUrl = generateWhatsAppEnquiryUrl({
    productName,
    sku,
    selectedSize: selectedSize || "Size to be consulted",
    selectedColour: selectedColour || "Colour to be consulted",
    price,
  });

  const telUrl = `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`;

  return (
    <div className="space-y-4 pt-4 border-t border-[#EAE4D8]">
      {/* Primary WhatsApp Enquiry CTA */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-3 bg-[#171717] hover:bg-[#2A2927] text-white py-4 px-6 text-xs uppercase tracking-widest font-bold border border-[#9B7B50] shadow-lg transition-all duration-300 group hover:shadow-bronze"
      >
        <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
        <span>Enquire on WhatsApp</span>
      </a>

      {/* Secondary Direct Call Button */}
      <a
        href={siteConfig.contact.phoneHref}
        className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-[#FAF8F5] text-[#171717] py-3.5 px-6 text-xs uppercase tracking-widest font-semibold border border-[#C4AC8D] hover:border-[#171717] transition-all"
      >
        <Phone className="w-4 h-4 text-[#9B7B50]" />
        <span>Call Specialist: {siteConfig.contact.phone}</span>
      </a>

      {/* Wholesale Enquiries CTA link */}
      <div className="flex items-center justify-between pt-2 px-1 text-xs">
        <Link
          href={`/wholesale?sku=${encodeURIComponent(sku)}`}
          className="text-[#9B7B50] hover:text-[#7D623C] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Enquire for Wholesale / Bulk Tiers</span>
        </Link>
        <span className="text-stone-400 text-[11px]">MOQ: 12 Pairs</span>
      </div>

      {/* Catalogue Model Disclaimer Notice */}
      <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded text-[11px] text-stone-500 leading-relaxed flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-[#9B7B50] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-700 font-semibold block">
            Direct Concierge Service
          </strong>
          COZZER does not process automated checkout or online cart payments. Clicking WhatsApp will connect you directly with a dedicated footwear specialist who will confirm your sizing, fit, and courier tracking details.
        </div>
      </div>
    </div>
  );
}
