"use client";

import React from "react";
import { Category, FilterState } from "@/types";
import { RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  className?: string;
}

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  className,
}: FilterSidebarProps) {
  const pricePresets = [
    { label: "All Prices", min: 0, max: 100000 },
    { label: "Under ₹3,000", min: 0, max: 3000 },
    { label: "₹3,000 – ₹5,000", min: 3000, max: 5000 },
    { label: "₹5,000 – ₹7,000", min: 5000, max: 7000 },
    { label: "Above ₹7,000", min: 7000, max: 100000 },
  ];

  return (
    <aside className={cn("space-y-8 bg-white p-6 border border-[#EAE4D8]", className)}>
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8]">
        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#171717]">
          Filter Catalogue
        </h2>
        <button
          onClick={onResetFilters}
          className="text-xs text-[#9B7B50] hover:text-[#7D623C] flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
          Categories
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => onFilterChange({ categorySlug: "" })}
            className={cn(
              "w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between",
              filters.categorySlug === ""
                ? "bg-[#171717] text-white font-semibold"
                : "text-stone-600 hover:bg-[#FAF8F5] hover:text-[#171717]"
            )}
          >
            <span>All Categories</span>
            {filters.categorySlug === "" && <Check className="w-3.5 h-3.5 text-[#9B7B50]" />}
          </button>

          {categories.map((cat) => {
            const isSelected = filters.categorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ categorySlug: cat.slug })}
                className={cn(
                  "w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between",
                  isSelected
                    ? "bg-[#171717] text-white font-semibold"
                    : "text-stone-600 hover:bg-[#FAF8F5] hover:text-[#171717]"
                )}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#9B7B50]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-[#EAE4D8]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
          Price Range
        </h3>
        <div className="space-y-1.5">
          {pricePresets.map((preset) => {
            const isSelected =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                onClick={() => onFilterChange({ minPrice: preset.min, maxPrice: preset.max })}
                className={cn(
                  "w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between",
                  isSelected
                    ? "bg-[#171717] text-white font-semibold"
                    : "text-stone-600 hover:bg-[#FAF8F5] hover:text-[#171717]"
                )}
              >
                <span>{preset.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#9B7B50]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3 pt-4 border-t border-[#EAE4D8]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
          Availability
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-[#C4AC8D] text-[#9B7B50] focus:ring-[#9B7B50]"
          />
          <span>In Stock Variants Only</span>
        </label>
      </div>

      {/* Wholesale & Consultation Callout Box */}
      <div className="p-4 bg-[#FAF8F5] border border-[#EAE4D8] rounded text-xs space-y-2">
        <span className="font-semibold text-[#171717] block">
          Bulk / Wholesale Inquiries?
        </span>
        <p className="text-stone-500 text-[11px] leading-relaxed">
          Special tiered pricing and custom size-break allocations available for volume orders.
        </p>
        <a
          href="/wholesale"
          className="text-[#9B7B50] hover:underline font-bold text-[11px] inline-block pt-1"
        >
          View Wholesale Terms &rarr;
        </a>
      </div>
    </aside>
  );
}
