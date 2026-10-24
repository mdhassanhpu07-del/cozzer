"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  MapPin,
  ChevronRight,
  Home,
  Compass,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track hydration mounting for safe portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection for compact header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Prevent background scrolling and rubber-banding when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [mobileMenuOpen]);

  // Keyboard accessibility: Close on Escape key & close on breakpoint resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const isCatalogueActive = pathname.startsWith("/catalogue") || pathname.startsWith("/product");

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-300">
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
              href={siteConfig.contact.phoneHref}
              className="hover:text-[#9B7B50] transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-[#9B7B50]" />
              <span>{siteConfig.contact.phone}</span>
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
          {/* Mobile Menu Accessible Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-[#171717] hover:text-[#9B7B50] focus:outline-none focus:ring-2 focus:ring-[#9B7B50] rounded transition-colors"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Wordmark (Strictly text-only uppercase luxury wordmark) */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <Link
              href="/"
              className="inline-block focus:outline-none focus:ring-1 focus:ring-[#9B7B50] px-1"
            >
              <span className="font-sans font-extrabold text-2xl md:text-3xl tracking-[0.2em] text-[#171717] hover:opacity-90 transition-opacity uppercase">
                COZZER
              </span>
              <span className="hidden lg:block text-[9px] uppercase tracking-[0.25em] text-[#9B7B50] -mt-0.5 font-semibold">
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
            <Link
              href="/contact"
              className={cn(
                "hover:text-[#9B7B50] transition-colors py-1",
                pathname === "/contact" && "text-[#9B7B50] font-bold"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons: Search & WhatsApp Direct Concierge */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#171717] hover:text-[#9B7B50] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9B7B50] rounded"
              aria-label="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Concierge CTA */}
            <a
              href={`${siteConfig.contact.whatsappUrl}?text=${encodeURIComponent(
                "Hello COZZER Concierge, I would like to enquire about your footwear catalogue."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-[#F5F1E8] border border-[#9B7B50]/40 px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm hover:border-[#9B7B50] active:scale-[0.98]"
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

      {/* Mobile Navigation Drawer System (Portaled to document.body for reliable positioning and stacking) */}
      {mobileMenuOpen && mounted && typeof document !== "undefined"
        ? createPortal(
            <div className="md:hidden">
              {/* Backdrop Overlay - Covers entire screen, clicking outside closes menu */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] transition-opacity animate-fadeIn"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Drawer Slide-In Panel */}
              <div
                id="mobile-navigation-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="fixed inset-y-0 left-0 w-[88vw] max-w-[380px] h-full h-[100dvh] max-h-[100dvh] bg-white z-[100] shadow-2xl flex flex-col border-r border-[#EAE4D8] animate-slideDrawerIn overflow-hidden"
                style={{ touchAction: "pan-y" }}
              >
                {/* Drawer Header (Fixed at top) */}
                <div className="flex-shrink-0 p-4 sm:p-5 flex items-center justify-between border-b border-[#EAE4D8] bg-[#FAF8F5]">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col group focus:outline-none"
                  >
                    <span className="font-sans font-extrabold text-xl tracking-[0.2em] text-[#171717] group-hover:text-[#9B7B50] transition-colors uppercase">
                      COZZER
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
                      Haute Footwear Atelier
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-stone-600 hover:text-[#171717] hover:bg-stone-200/50 focus:outline-none focus:ring-2 focus:ring-[#9B7B50] rounded-full transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Navigation Body (flex-1 min-h-0 allows smooth vertical scrolling) */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
                  {/* Quick In-Drawer Search */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchTerm.trim()) {
                        router.push(`/catalogue?q=${encodeURIComponent(searchTerm.trim())}`);
                        setMobileMenuOpen(false);
                        setSearchTerm("");
                      }
                    }}
                    className="relative flex items-center"
                  >
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search shoe name, SKU, or category..."
                      className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2 text-xs text-[#171717] placeholder-stone-400 focus:outline-none focus:border-[#171717] pr-9"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 p-2 text-stone-500 hover:text-[#171717]"
                      aria-label="Submit Search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Primary Navigation Section */}
                  <div className="space-y-1 border-b border-[#FAF8F5] pb-3">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "min-h-[44px] flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors rounded",
                        pathname === "/"
                          ? "bg-[#FAF8F5] text-[#9B7B50] font-bold"
                          : "text-[#171717] hover:text-[#9B7B50] hover:bg-[#FAF8F5]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Home className="w-4 h-4 text-[#9B7B50]" />
                        <span>Home</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </Link>

                    <Link
                      href="/catalogue"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "min-h-[44px] flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors rounded",
                        pathname === "/catalogue" && !pathname.includes("category=")
                          ? "bg-[#FAF8F5] text-[#9B7B50] font-bold"
                          : "text-[#171717] hover:text-[#9B7B50] hover:bg-[#FAF8F5]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Compass className="w-4 h-4 text-[#9B7B50]" />
                        <span>All Footwear Collection</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#171717] text-white px-2 py-0.5">
                        Catalogue
                      </span>
                    </Link>
                  </div>

                  {/* Footwear Categories (All 6 Official Collections) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
                        Footwear Categories
                      </p>
                      <span className="text-[10px] text-stone-400">6 Collections</span>
                    </div>
                    <ul className="space-y-1">
                      {siteConfig.categories.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            href={`/catalogue?category=${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs text-stone-700 hover:text-[#171717] hover:bg-[#FAF8F5] rounded transition-colors group"
                          >
                            <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                              {cat.name}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#9B7B50] transition-colors" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* The House of COZZER & Wholesale Section */}
                  <div className="pt-4 border-t border-[#EAE4D8] space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
                      The House of COZZER
                    </p>
                    <div className="space-y-1">
                      <Link
                        href="/wholesale"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-colors rounded",
                          pathname === "/wholesale"
                            ? "bg-[#FAF8F5] text-[#9B7B50]"
                            : "text-[#9B7B50] hover:bg-[#FAF8F5]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-[#9B7B50]" />
                          <span>Wholesale & B2B Distribution</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider bg-[#9B7B50]/15 text-[#9B7B50] px-1.5 py-0.5 font-bold">
                          B2B Desk
                        </span>
                      </Link>

                      <Link
                        href="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs text-stone-700 hover:text-[#171717] hover:bg-[#FAF8F5] rounded transition-colors"
                      >
                        <span>About The House of COZZER</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                      </Link>

                      <Link
                        href="/about#craftsmanship"
                        onClick={() => setMobileMenuOpen(false)}
                        className="min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs text-stone-700 hover:text-[#171717] hover:bg-[#FAF8F5] rounded transition-colors"
                      >
                        <span>Material & Craftsmanship</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                      </Link>

                      <Link
                        href="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs text-stone-700 hover:text-[#171717] hover:bg-[#FAF8F5] rounded transition-colors"
                      >
                        <span>Contact & Experience Studio</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs text-stone-500 hover:text-[#171717] hover:bg-[#FAF8F5] rounded transition-colors"
                      >
                        <span>Admin Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                      </Link>
                    </div>
                  </div>

                  {/* Studio Address Card */}
                  <div className="pt-4 border-t border-[#EAE4D8] space-y-2 bg-[#FAF8F5] p-3.5 border border-[#EAE4D8]">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9B7B50] font-semibold block">
                      Experience Studio & Atelier
                    </span>
                    <div className="flex items-start gap-2 text-xs text-stone-700 font-normal">
                      <MapPin className="w-4 h-4 text-[#9B7B50] flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1.5">
                        <span className="break-words leading-relaxed text-[11px]">
                          {siteConfig.contact.address}
                        </span>
                        <a
                          href={siteConfig.contact.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#9B7B50] font-bold hover:underline w-fit"
                        >
                          <span>Get Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Legal & Policies */}
                  <div className="pt-3 border-t border-[#EAE4D8] space-y-1 pb-6">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1">
                      Policies & Information
                    </p>
                    <div className="grid grid-cols-1 gap-1 text-[11px]">
                      <Link
                        href="/policies/disclaimer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 text-stone-500 hover:text-[#171717]"
                      >
                        • Catalogue Sales Disclaimer
                      </Link>
                      <Link
                        href="/policies/privacy"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 text-stone-500 hover:text-[#171717]"
                      >
                        • Privacy Policy
                      </Link>
                      <Link
                        href="/policies/terms"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-1 text-stone-500 hover:text-[#171717]"
                      >
                        • Terms of Service
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions (Fixed at bottom) */}
                <div className="flex-shrink-0 p-4 border-t border-[#EAE4D8] bg-[#FAF8F5] space-y-2">
                  <a
                    href={`${siteConfig.contact.whatsappUrl}?text=${encodeURIComponent(
                      "Hello COZZER Team, I would like to enquire about your footwear catalogue."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-white py-3 px-4 text-xs uppercase tracking-widest font-bold border border-[#9B7B50] shadow-sm transition-all active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                  <a
                    href={siteConfig.contact.phoneHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-[#171717] py-2.5 px-4 text-xs uppercase tracking-widest font-semibold border border-[#C4AC8D] transition-all active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 text-[#9B7B50]" />
                    <span>Call {siteConfig.contact.phone}</span>
                  </a>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  );
}
