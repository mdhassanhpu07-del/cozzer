"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Menu,
  X,
  Search,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const isCurrentActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isCatalogueActive = pathname.startsWith("/catalogue") || pathname.startsWith("/product");

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#171717] text-[#F5F1E8] px-4 py-1.5 text-xs tracking-wider uppercase flex justify-between items-center border-b border-[#2A2927]">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9B7B50] animate-pulse"></span>
            <span className="text-[11px] font-medium tracking-wide">
              Official COZZER Catalogue • Handcrafted Luxury Footwear
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-[11px]">
            <span className="text-[#C4AC8D]">Direct Wholesale & Retail Enquiries</span>
            <span className="text-stone-500">•</span>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
              className="hover:text-[#9B7B50] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#9B7B50]" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={cn(
          "container mx-auto px-4 md:px-8 transition-all duration-300 border-b border-[#EAE4D8]",
          isScrolled ? "py-3" : "py-4 md:py-5"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#171717] hover:text-[#9B7B50] focus:outline-none focus:ring-1 focus:ring-[#9B7B50]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Wordmark (Strictly text-only uppercase luxury wordmark) */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <Link
              href="/"
              className="inline-block focus:outline-none focus:ring-1 focus:ring-[#9B7B50] px-1"
            >
              <span className="font-display font-extrabold text-2xl md:text-3xl tracking-[0.25em] text-[#171717] hover:opacity-90 transition-opacity">
                COZZER
              </span>
              <span className="hidden lg:block text-[9px] uppercase tracking-[0.35em] text-[#9B7B50] -mt-1 font-semibold">
                Haute Footwear Atelier
              </span>
            </Link>
          </div>

          {/* Desktop Categories & Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-[#171717]">
            <Link
              href="/catalogue"
              className={cn(
                "hover:text-[#9B7B50] transition-colors py-1 relative",
                isCatalogueActive && "text-[#9B7B50] font-bold"
              )}
            >
              Catalogue
              {isCatalogueActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9B7B50]" />
              )}
            </Link>
            <Link
              href="/catalogue?category=casual-shoes"
              className="hover:text-[#9B7B50] transition-colors py-1"
            >
              Casual
            </Link>
            <Link
              href="/catalogue?category=formal-shoes"
              className="hover:text-[#9B7B50] transition-colors py-1"
            >
              Formal
            </Link>
            <Link
              href="/catalogue?category=loafers"
              className="hover:text-[#9B7B50] transition-colors py-1"
            >
              Loafers
            </Link>
            <Link
              href="/catalogue?category=boots"
              className="hover:text-[#9B7B50] transition-colors py-1"
            >
              Boots
            </Link>
            <Link
              href="/catalogue?category=ethnic-footwear"
              className="hover:text-[#9B7B50] transition-colors py-1"
            >
              Ethnic
            </Link>
            <Link
              href="/wholesale"
              className={cn(
                "text-[#9B7B50] hover:text-[#7D623C] font-bold transition-colors py-1",
                pathname === "/wholesale" && "underline decoration-[#9B7B50] underline-offset-4"
              )}
            >
              Wholesale
            </Link>
            <Link
              href="/about"
              className={cn(
                "hover:text-[#9B7B50] transition-colors py-1",
                pathname === "/about" && "text-[#9B7B50] font-bold"
              )}
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons: Search & WhatsApp Direct Concierge */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#171717] hover:text-[#9B7B50] transition-colors focus:outline-none focus:ring-1 focus:ring-[#9B7B50]"
              aria-label="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Concierge CTA */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello COZZER Concierge, I would like to enquire about your footwear catalogue."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-[#F5F1E8] border border-[#9B7B50]/40 px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm hover:border-[#9B7B50]"
              aria-label="Enquire via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Enquiry</span>
            </a>
          </div>
        </div>

        {/* Search Drawer / Dropdown */}
        {searchOpen && (
          <div className="pt-3 pb-2 border-t border-[#EAE4D8] mt-3 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by shoe name, SKU, or category (e.g. Oxford, COZ-CAS-001)..."
                className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-4 py-2.5 text-sm text-[#171717] placeholder-stone-400 focus:outline-none focus:border-[#171717] pr-10"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 text-[#171717] hover:text-[#9B7B50]"
                aria-label="Execute Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[90px] bottom-0 bg-white z-50 flex flex-col justify-between border-t border-[#EAE4D8] overflow-y-auto px-6 py-8">
          <div className="space-y-6">
            <div className="border-b border-[#EAE4D8] pb-4">
              <p className="text-[11px] uppercase tracking-widest text-[#9B7B50] font-bold mb-3">
                Catalogue Categories
              </p>
              <ul className="space-y-3.5 text-base font-medium">
                <li>
                  <Link
                    href="/catalogue"
                    className="block text-[#171717] hover:text-[#9B7B50]"
                  >
                    All Footwear Collection
                  </Link>
                </li>
                {siteConfig.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/catalogue?category=${cat.slug}`}
                      className="block text-stone-600 hover:text-[#171717]"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-b border-[#EAE4D8] pb-4 space-y-3 text-base">
              <Link
                href="/wholesale"
                className="block text-[#9B7B50] font-bold hover:underline"
              >
                Wholesale & B2B Distribution
              </Link>
              <Link href="/about" className="block text-[#171717] hover:text-[#9B7B50]">
                About The House of COZZER
              </Link>
              <Link href="/contact" className="block text-[#171717] hover:text-[#9B7B50]">
                Contact & Experience Studio
              </Link>
            </div>
          </div>

          {/* Mobile Bottom Actions */}
          <div className="pt-6 border-t border-[#EAE4D8] space-y-3">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello COZZER Team, I would like to enquire about your footwear catalogue."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#171717] text-[#F5F1E8] py-3 text-xs uppercase tracking-widest font-semibold border border-[#9B7B50]"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Enquire on WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
              className="w-full flex items-center justify-center gap-2 bg-[#FAF8F5] text-[#171717] py-3 text-xs uppercase tracking-widest font-semibold border border-[#C4AC8D]"
            >
              <Phone className="w-4 h-4 text-[#9B7B50]" />
              Call {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
