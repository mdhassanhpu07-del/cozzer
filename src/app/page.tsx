import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/data/products";
import ProductCard from "@/components/catalogue/ProductCard";
import { siteConfig } from "@/config/site";
import {
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Compass,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default async function HomePage() {
  const categories = await getCategories();
  const { products: featuredProducts } = await getProducts({
    limit: 6,
    sortBy: "newest",
  });

  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#171717] text-white overflow-hidden px-4 md:px-8">
        {/* Editorial Background Image with Scrim */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=2000&q=85"
            alt="COZZER Handcrafted Luxury Leather Shoes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/60 to-transparent z-0"></div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto max-w-4xl text-center space-y-6 pt-12 pb-16">
          <div className="inline-flex items-center gap-2 border border-[#9B7B50]/60 bg-black/40 backdrop-blur-md px-4 py-1.5 text-xs tracking-[0.2em] uppercase font-semibold text-[#F5F1E8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9B7B50]"></span>
            <span>Master Catalogue 2025 – 2026</span>
          </div>

          <h1 className="font-sans text-[clamp(2.35rem,5.5vw+0.5rem,4.5rem)] font-extrabold tracking-[-0.035em] text-white uppercase leading-[1.06]">
            Architect of Contemporary Footwear
          </h1>

          <p className="text-[#F5F1E8]/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Distinguished footwear meticulously sculpted for gentlemen of discerning taste, retailers, and wholesale distributors across India.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#9B7B50] hover:bg-[#82653E] text-white px-8 py-4 text-xs uppercase tracking-widest font-bold shadow-lg transition-all duration-300"
            >
              <span>Explore Master Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello COZZER, I am interested in viewing your complete footwear collection."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-[#F5F1E8] border border-white/20 backdrop-blur-md px-7 py-4 text-xs uppercase tracking-widest font-semibold transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>

          <div className="pt-6 text-[11px] uppercase tracking-widest text-[#C4AC8D] font-medium flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            <span>• Verified Wholesale Tiers</span>
            <span>• Pan-India Dispatch</span>
            <span>• Direct Client Concierge</span>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION & PILLARS */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
                The House of COZZER
              </span>
              <h2 className="font-sans text-[clamp(1.75rem,3.2vw+0.5rem,2.5rem)] text-[#171717] font-bold leading-[1.15] tracking-[-0.025em]">
                Where Indian Shoemaking Heritage Meets Modern Minimalist Luxury
              </h2>
            </div>

            <p className="text-stone-600 text-sm md:text-[15px] leading-relaxed font-normal">
              COZZER was established to bridge the gap between uncompromising bespoke aesthetics and practical daily wear. Every silhouette is conceived through architectural restraint—stripping away gratuitous ornamentation to let premium grain leathers, balanced lasts, and precision welting take center stage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="border-l-2 border-[#9B7B50] pl-4 space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#171717]">
                  Crust & Nappa Leathers
                </h4>
                <p className="text-stone-500 text-xs font-normal">
                  Hand-selected hides with organic patinas that age with character.
                </p>
              </div>

              <div className="border-l-2 border-[#9B7B50] pl-4 space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#171717]">
                  Orthopedic Footbed
                </h4>
                <p className="text-stone-500 text-xs font-normal">
                  Dual-density memory cushioning engineered for day-long endurance.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#171717] hover:text-[#9B7B50] font-bold border-b border-[#171717] pb-1 transition-colors"
              >
                <span>Read Our Atelier Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Editorial Double Imagery */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] bg-[#F5F1E8] overflow-hidden shadow-luxury">
              <Image
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
                alt="COZZER Craftsmanship"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] bg-[#F5F1E8] overflow-hidden shadow-luxury mt-8">
              <Image
                src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
                alt="COZZER Loafers"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SHOWCASE */}
      <section className="container mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#EAE4D8] pb-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
              Curated Classifications
            </span>
            <h2 className="font-sans text-[clamp(1.75rem,3vw+0.5rem,2.35rem)] text-[#171717] font-bold leading-[1.18] tracking-[-0.025em]">
              Explore by Footwear Category
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="text-xs uppercase tracking-widest text-[#9B7B50] hover:text-[#7D623C] font-semibold flex items-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogue?category=${cat.slug}`}
              className="group relative aspect-[4/3] bg-[#171717] overflow-hidden border border-[#EAE4D8] block shadow-sm hover:shadow-luxury transition-all"
            >
              <Image
                src={
                  cat.image_url ||
                  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
                }
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4AC8D] font-semibold">
                  Collection
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.015em] group-hover:text-[#F5F1E8] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 font-normal line-clamp-1 mt-1 opacity-85 group-hover:opacity-100">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-[#C4AC8D] font-semibold">
                  <span>Browse Designs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS & FEATURED PRODUCTS */}
      <section className="container mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#EAE4D8] pb-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
              New In Catalogue
            </span>
            <h2 className="font-sans text-[clamp(1.75rem,3vw+0.5rem,2.35rem)] text-[#171717] font-bold leading-[1.18] tracking-[-0.025em]">
              Featured Silhouettes
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="text-xs uppercase tracking-widest text-[#9B7B50] hover:text-[#7D623C] font-semibold flex items-center gap-1.5"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. EDITORIAL CAMPAIGN BANNER */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="relative bg-[#171717] text-[#F5F1E8] p-8 md:p-16 border border-[#2A2927] overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
              The Heritage Loafer Edit
            </span>
            <h2 className="font-sans text-[clamp(2rem,4vw+0.5rem,3.25rem)] uppercase font-extrabold text-white leading-[1.08] tracking-[-0.03em]">
              Unstructured Sophistication
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed font-normal">
              Tailored for tropical climates and evening ease. Crafted with unlined suede uppers, flexible Blake stitching, and muted bronze hardware for effortless refinement.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/catalogue?category=loafers"
                className="bg-[#9B7B50] hover:bg-[#82653E] text-white px-7 py-3 text-xs uppercase tracking-widest font-bold transition-all shadow-md"
              >
                Discover Loafers
              </Link>
              <Link
                href="/catalogue?category=formal-shoes"
                className="border border-[#C4AC8D]/40 hover:border-[#9B7B50] text-white px-7 py-3 text-xs uppercase tracking-widest font-semibold transition-all"
              >
                Explore Formal Shoes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHOLESALE & RETAILER ALLIANCE SECTION */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="bg-[#FAF8F5] border border-[#EAE4D8] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7B50]">
              <Building2 className="w-4 h-4 text-[#9B7B50]" />
              <span>Institutional & Retail Distribution</span>
            </div>
            <h3 className="font-sans text-[clamp(1.65rem,2.8vw+0.5rem,2.25rem)] text-[#171717] font-bold leading-[1.18] tracking-[-0.025em]">
              Supply Your Retail Boutique or Multi-Brand Store
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed font-normal max-w-xl">
              COZZER collaborates with established fashion retailers, footwear boutiques, and corporate distributors across all major Indian cities. We provide flexible MOQ tiers, customized size assortments, and rapid order dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-stone-700">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#9B7B50]" />
                <span>Tiered Wholesale Discounts</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#9B7B50]" />
                <span>Custom Size-Break Runs</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#9B7B50]" />
                <span>Pan-India B2B Logistics</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <Link
              href="/wholesale"
              className="w-full text-center bg-[#171717] hover:bg-[#2A2927] text-white py-4 px-6 text-xs uppercase tracking-widest font-bold border border-[#9B7B50]"
            >
              Wholesale Terms & Enquiry
            </Link>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello COZZER B2B Desk, we represent a retail store and want to discuss wholesale stock."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-white hover:bg-[#FAF8F5] text-[#171717] py-3.5 px-6 text-xs uppercase tracking-widest font-semibold border border-[#C4AC8D] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              B2B WhatsApp Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
