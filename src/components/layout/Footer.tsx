import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-[#F5F1E8] border-t border-[#2A2927]">
      {/* Upper Footer: Brand Statement & Quick Concierge Banner */}
      <div className="border-b border-[#2A2927] py-12 px-4 md:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
              Direct Brand Consultation
            </span>
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-[-0.02em] leading-tight">
              Connect with the COZZER Concierge Desk
            </h3>
            <p className="text-stone-400 text-sm max-w-xl font-normal leading-relaxed">
              Whether you are acquiring a single bespoke pair, curating an executive wardrobe, or placing wholesale tier orders for multi-brand retail outlets, our footwear specialists are at your disposal.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-start md:justify-end">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello COZZER Concierge, I would like to consult regarding your footwear catalogue."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#9B7B50] hover:bg-[#82653E] text-white px-6 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              WhatsApp Concierge
            </a>
            <a
              href={siteConfig.contact.phoneHref}
              className="inline-flex items-center justify-center gap-2 border border-[#C4AC8D]/40 hover:border-[#9B7B50] text-[#F5F1E8] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all"
            >
              <Phone className="w-4 h-4 text-[#9B7B50]" />
              Call Specialist: {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-16 px-4 md:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="font-sans font-extrabold text-3xl tracking-[0.2em] text-white uppercase">
                COZZER
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed font-normal pr-6">
              Rooted in refined Indian craftsmanship and contemporary architectural design, COZZER represents footwear made without compromise for retail connoisseurs, boutiques, and institutional distributors.
            </p>

            <div className="space-y-3 text-xs text-stone-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9B7B50] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="break-words leading-relaxed text-stone-300">{siteConfig.contact.address}</span>
                  <a
                    href={siteConfig.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#9B7B50] hover:text-[#B8996F] font-semibold transition-colors w-fit pt-0.5"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9B7B50] flex-shrink-0" />
                <a href={siteConfig.contact.phoneHref} className="hover:text-white transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9B7B50] flex-shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-stone-400">
                <Clock className="w-4 h-4 text-[#9B7B50] flex-shrink-0" />
                <span>{siteConfig.contact.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Catalogue Col */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold mb-5">
              Footwear Catalogue
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-normal">
              {siteConfig.footerNav.catalogue.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wholesale & Brand Col */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold mb-5">
              Brand & Wholesale
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-normal">
              {siteConfig.footerNav.business.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance & Policies Col */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold mb-5">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-normal">
              {siteConfig.footerNav.legal.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-3.5 bg-[#1F1E1D] border border-[#2A2927] rounded text-[11px] text-stone-400 leading-normal">
              <span className="text-[#9B7B50] font-bold block mb-1">
                Strict Catalogue Model
              </span>
              No automated online checkout or payment gateway exists on this website. All orders are processed via human concierge.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="border-t border-[#2A2927] py-6 px-4 md:px-8 text-xs text-stone-500">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} COZZER Footwear. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/policies/disclaimer" className="hover:text-stone-300 transition-colors">
              Catalogue Disclaimer
            </Link>
            <Link href="/policies/privacy" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/policies/terms" className="hover:text-stone-300 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
