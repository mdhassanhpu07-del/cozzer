"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    "Hello COZZER Team, I am browsing your website catalogue and would like assistance."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Prompt Bubble */}
      {showTooltip && (
        <div className="relative mb-3 bg-[#171717] text-white text-xs py-2 px-3.5 rounded-lg shadow-xl border border-[#9B7B50]/50 max-w-xs animate-fadeInUp motion-reduce:animate-none flex items-center gap-2">
          <span>Enquire about sizes, prices & wholesale on WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-white"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#171717] hover:bg-[#25D366] text-white rounded-full shadow-2xl border-2 border-[#9B7B50] hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#9B7B50]/30"
        aria-label="Contact COZZER on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-[#25D366] group-hover:text-white transition-colors" />
        <span className="sr-only">WhatsApp Chat</span>
        
        {/* Subtle ping ring */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
        </span>
      </a>
    </div>
  );
}
