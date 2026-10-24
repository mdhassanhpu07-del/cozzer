"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency, calculateDiscount, generateWhatsAppEnquiryUrl, cn } from "@/lib/utils";
import { MessageCircle, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80";

  const secondaryImage =
    product.images?.[1]?.image_url || primaryImage;

  const hasSecondary = secondaryImage !== primaryImage;
  const discount = calculateDiscount(product.price, product.mrp);

  // Collect distinct colours from variants
  const distinctColours = Array.from(
    new Map(
      product.variants?.map((v) => [v.colour, v.colour_code || "#171717"]) || []
    ).entries()
  );

  // Live stock evaluation
  const hasAvailableStock = product.variants?.some(
    (v) => v.is_available && v.stock_quantity > 0
  );

  const handleWhatsAppQuickEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateWhatsAppEnquiryUrl({
      productName: product.name,
      sku: product.sku,
      price: product.price,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="group flex flex-col bg-white border border-[#EAE4D8] hover:border-[#9B7B50]/60 transition-all duration-300 shadow-sm hover:shadow-luxury">
      {/* Image Container with pure CSS hover cross-fade (zero React state re-renders) */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#F5F1E8]">
        {/* Primary Product Image */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover object-center transition-all duration-700 ease-out group-hover:scale-105",
            hasSecondary && "group-hover:opacity-0"
          )}
        />

        {/* Secondary Angle Image (Preloaded & cross-faded via CSS on hover) */}
        {hasSecondary && (
          <Image
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_featured && (
            <span className="bg-[#171717] text-white text-[10px] uppercase font-semibold tracking-[0.18em] px-2.5 py-1 shadow-sm">
              Featured
            </span>
          )}
          {discount && (
            <span className="bg-[#9B7B50] text-white text-[10px] uppercase font-semibold tracking-[0.18em] px-2 py-1 shadow-sm">
              {discount}% Off
            </span>
          )}
        </div>

        {/* Live Availability Badge */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          {hasAvailableStock ? (
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#171717] text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 border border-[#EAE4D8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Enquire Availability
            </span>
          )}
        </div>

        {/* Quick View Icon Hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#171717] shadow-md hover:bg-[#171717] hover:text-white transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 md:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-[0.18em] font-medium mb-1.5">
            <span>{product.category?.name || "Footwear"}</span>
            <span className="font-mono text-[10px] text-stone-400">SKU: {product.sku}</span>
          </div>

          {/* Product Name (600-700 weight, crisp tracking) */}
          <h3 className="font-sans font-bold text-base sm:text-lg text-[#171717] group-hover:text-[#9B7B50] transition-colors leading-snug line-clamp-1 mb-2 tracking-[-0.015em]">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Material Snippet (400-500 readable weight) */}
          {product.material && (
            <p className="text-xs text-stone-500 font-normal line-clamp-1 mb-3">
              {product.material}
            </p>
          )}

          {/* Colour Swatches (if available) */}
          {distinctColours.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">Colours:</span>
              <div className="flex items-center gap-1">
                {distinctColours.slice(0, 4).map(([colourName, hex]) => (
                  <span
                    key={colourName}
                    title={colourName}
                    className="w-3 h-3 rounded-full border border-stone-300 shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                ))}
                {distinctColours.length > 4 && (
                  <span className="text-[10px] text-stone-500 font-medium">+{distinctColours.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing and Direct WhatsApp Enquiry CTA */}
        <div className="pt-3 border-t border-[#F5F1E8] flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-sans font-bold text-base sm:text-lg text-[#171717] tracking-[-0.02em]">
                {formatCurrency(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-stone-400 font-normal line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 block tracking-wide font-normal">
              Catalogue Price (Incl. Taxes)
            </span>
          </div>

          {/* Quick Enquire Button */}
          <button
            onClick={handleWhatsAppQuickEnquiry}
            className="inline-flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#171717] text-[#171717] hover:text-[#F5F1E8] border border-[#C4AC8D] hover:border-[#171717] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200"
            title="Enquire on WhatsApp"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
