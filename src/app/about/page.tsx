import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, Compass, Sparkles, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About The House of COZZER | Atelier & Craftsmanship",
  description:
    "Discover COZZER's philosophy: blending timeless Indian shoemaking heritage with contemporary minimalist luxury. Hand-burnished leathers, architectural lasts, and bespoke attention.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* Header Banner */}
      <section className="relative bg-[#171717] text-white py-20 px-4 md:px-8 text-center border-b border-[#2A2927]">
        <div className="container mx-auto max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#9B7B50] font-bold">
            The Atelier Story
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight">
            The Architecture of Footwear
          </h1>
          <p className="text-stone-300 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
            COZZER was founded on a singular conviction: luxury footwear should balance the quiet confidence of sculptural design with the enduring stamina of master craftsmanship.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
              Our Genesis
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#171717] font-normal leading-snug">
              A Reimagining of Contemporary Indian Luxury
            </h2>
            <div className="space-y-4 text-stone-600 text-sm leading-relaxed font-light">
              <p>
                India has fostered a formidable legacy of leathercraft for generations, yet discerning modern gentlemen often found themselves caught between fast-fashion compromises and inflated imported labels.
              </p>
              <p>
                COZZER emerged to claim the middle ground: footwear crafted with obsessive attention to hand-burnished patinas, balanced anatomical lasts, and structural welting, offered transparently without distributor inflation.
              </p>
              <p>
                Today, our catalogue serves private connoisseurs seeking bespoke everyday shoes, alongside leading multi-brand retailers and boutique stores across the country.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] bg-[#F5F1E8] overflow-hidden shadow-luxury">
            <Image
              src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80"
              alt="COZZER Wholecut Oxford Craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Craftsmanship Pillars */}
      <section id="craftsmanship" className="bg-[#FAF8F5] py-20 border-y border-[#EAE4D8]">
        <div className="container mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
              Core Principles
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#171717] font-normal">
              The Pillars of COZZER Construction
            </h2>
            <p className="text-stone-500 text-xs font-light">
              Every design in our master catalogue must satisfy four rigorous engineering standards before entering production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 border border-[#EAE4D8] space-y-3 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#9B7B50]" />
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171717]">
                Vegetable-Tanned Leathers
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                We utilize full-grain crust and Nappa hides tanned with natural tree barks and oils, ensuring supple breathability that molds to your unique foot anatomy.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#EAE4D8] space-y-3 shadow-sm">
              <Compass className="w-6 h-6 text-[#9B7B50]" />
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171717]">
                Architectural Lasts
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Developed in-house, our proprietary lasts accommodate both standard and broader Indian foot profiles, mitigating pressure points at the metatarsal arches.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#EAE4D8] space-y-3 shadow-sm">
              <Sparkles className="w-6 h-6 text-[#9B7B50]" />
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171717]">
                Artisanal Patina
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Rather than uniform synthetic dyes, each formal shoe and boot is hand-finished with layers of wax and alcohol dyes, producing depth and dimensional lustre.
              </p>
            </div>

            <div className="bg-white p-6 border border-[#EAE4D8] space-y-3 shadow-sm">
              <Award className="w-6 h-6 text-[#9B7B50]" />
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171717]">
                Longevity & Resoling
              </h3>
              <p className="text-stone-500 text-xs leading-relaxed font-light">
                Reinforced Blake stitching and Goodyear welting allow our shoes to be resoled and restored, making them an enduring investment for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-8 text-center max-w-3xl space-y-6">
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#171717] font-normal">
          Experience COZZER In Person or Consult Online
        </h2>
        <p className="text-stone-600 text-sm font-light">
          Browse our catalogue, enquire about bespoke sizings, or schedule a consultation with our footwear specialist.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/catalogue"
            className="bg-[#171717] hover:bg-[#2A2927] text-white px-8 py-3.5 text-xs uppercase tracking-widest font-bold shadow-md transition-all"
          >
            Explore Catalogue
          </Link>
          <Link
            href="/contact"
            className="border border-[#C4AC8D] hover:border-[#171717] text-[#171717] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all"
          >
            Contact Studio
          </Link>
        </div>
      </section>
    </div>
  );
}
