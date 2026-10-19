"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import EnquiryButtons from "@/components/product/EnquiryButtons";
import ProductAccordion from "@/components/product/ProductAccordion";
import ProductCard from "@/components/catalogue/ProductCard";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { ChevronRight, ShieldCheck, Truck, RefreshCw, Sparkles } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  // Determine default selected colour & size
  const firstVariant = product.variants?.[0];
  const [selectedColour, setSelectedColour] = useState<string>(
    firstVariant?.colour || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    firstVariant?.size || ""
  );

  const discount = calculateDiscount(product.price, product.mrp);

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-stone-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-[#171717] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link href="/catalogue" className="hover:text-[#171717] transition-colors">
          Catalogue
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link
              href={`/catalogue?category=${product.category.slug}`}
              className="hover:text-[#171717] transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-[#171717] font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Gallery (7 cols on desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
          />
        </div>

        {/* Right Column: Information & Enquiries (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Info */}
          <div className="space-y-3 pb-6 border-b border-[#EAE4D8]">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
                {product.category?.name || "Luxury Footwear"}
              </span>
              <span className="font-mono text-xs text-stone-500 bg-[#FAF8F5] border border-[#EAE4D8] px-2 py-0.5">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#171717] font-normal leading-tight">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-semibold text-2xl md:text-3xl text-[#171717]">
                {formatCurrency(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-base text-stone-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
              {discount && (
                <span className="bg-[#9B7B50] text-white text-[10px] uppercase font-bold tracking-widest px-2 py-0.5">
                  Save {discount}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 tracking-wide">
              Catalogue list price. Inclusive of all Indian GST & luxury cess.
            </p>
          </div>

          {/* Variant Selection (Colour & Size Matrix) */}
          <VariantSelector
            variants={product.variants || []}
            selectedSize={selectedSize}
            selectedColour={selectedColour}
            onSelectSize={setSelectedSize}
            onSelectColour={setSelectedColour}
          />

          {/* Enquiry Actions: WhatsApp and Click-to-Call */}
          <EnquiryButtons
            productName={product.name}
            sku={product.sku}
            selectedSize={selectedSize}
            selectedColour={selectedColour}
            price={product.price}
          />

          {/* Atelier Trust Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] text-stone-600">
            <div className="flex flex-col items-center text-center p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded">
              <ShieldCheck className="w-4 h-4 text-[#9B7B50] mb-1" />
              <span className="font-semibold text-[#171717]">Authentic Leather</span>
              <span className="text-[10px] text-stone-500">100% Genuine Hides</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded">
              <Truck className="w-4 h-4 text-[#9B7B50] mb-1" />
              <span className="font-semibold text-[#171717]">Express Air Cargo</span>
              <span className="text-[10px] text-stone-500">Pan-India Dispatch</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded">
              <RefreshCw className="w-4 h-4 text-[#9B7B50] mb-1" />
              <span className="font-semibold text-[#171717]">Size Exchange</span>
              <span className="text-[10px] text-stone-500">Concierge Assistance</span>
            </div>
          </div>

          {/* Accordion: Specs, Material, Size Chart, Logistics */}
          <ProductAccordion
            description={product.description}
            material={product.material}
          />
        </div>
      </div>

      {/* Related Footwear Designs */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-[#EAE4D8]">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
                From the Same Collection
              </span>
              <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#171717] font-normal">
                Complementary Silhouettes
              </h2>
            </div>
            <Link
              href="/catalogue"
              className="text-xs uppercase tracking-widest text-[#9B7B50] hover:text-[#7D623C] font-semibold"
            >
              View All Catalogue &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
