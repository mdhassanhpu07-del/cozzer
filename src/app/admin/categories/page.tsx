"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { getCategories } from "@/lib/data/products";
import { Category } from "@/types";
import { Layers, ExternalLink, ArrowRight } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Category Classifications"
        description="The six primary footwear classifications defining the COZZER catalogue hierarchy."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white border border-[#EAE4D8] overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-stone-100">
              <Image
                src={
                  cat.image_url ||
                  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
                }
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#171717] text-white text-[10px] uppercase font-mono px-2 py-0.5 font-bold">
                Order: #{cat.display_order || idx + 1}
              </span>
            </div>

            <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg font-semibold text-[#171717]">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Slug: /{cat.slug}
                </p>
                <p className="text-xs text-stone-600 font-light mt-2 line-clamp-2">
                  {cat.description || "Curated luxury footwear line."}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE4D8] flex items-center justify-between text-xs">
                <Link
                  href={`/catalogue?category=${cat.slug}`}
                  target="_blank"
                  className="text-stone-500 hover:text-[#171717] flex items-center gap-1"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/admin/products?category=${cat.slug}`}
                  className="text-[#9B7B50] hover:text-[#7D623C] font-semibold flex items-center gap-1"
                >
                  <span>Filter Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
