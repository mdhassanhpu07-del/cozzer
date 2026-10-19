"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const displayImages =
    images && images.length > 0
      ? [...images].sort((a, b) => a.display_order - b.display_order)
      : [
          {
            id: "fallback-img",
            product_id: "",
            image_url:
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
            alt_text: productName,
            display_order: 1,
            is_primary: true,
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = displayImages[activeIndex] || displayImages[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Large Product Viewer */}
      <div className="relative aspect-[4/5] bg-[#F5F1E8] border border-[#EAE4D8] overflow-hidden group">
        <Image
          src={activeImage.image_url}
          alt={activeImage.alt_text || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Expand / Lightbox Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-[#171717] rounded-full shadow-md backdrop-blur-sm transition-all opacity-80 hover:opacity-100"
          aria-label="Enlarge Image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Carousel Prev/Next Buttons (for multi-image) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-[#171717] rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-[#171717] rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] uppercase font-mono px-2.5 py-1 rounded backdrop-blur-sm">
          {activeIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-24 bg-[#F5F1E8] border-2 overflow-hidden transition-all ${
                activeIndex === idx
                  ? "border-[#9B7B50] shadow-sm scale-95"
                  : "border-[#EAE4D8] opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white bg-white/10 rounded-full"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={activeImage.image_url}
              alt={activeImage.alt_text || productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
