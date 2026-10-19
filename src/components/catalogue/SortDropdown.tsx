"use client";

import React from "react";
import { FilterState } from "@/types";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  sortBy: FilterState["sortBy"];
  onChange: (sort: FilterState["sortBy"]) => void;
}

export default function SortDropdown({ sortBy, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-stone-500 uppercase tracking-wider hidden sm:inline flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#9B7B50]" />
        Sort By:
      </span>
      <select
        value={sortBy}
        onChange={(e) => onChange(e.target.value as FilterState["sortBy"])}
        className="bg-white border border-[#C4AC8D] px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717] font-medium"
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A to Z</option>
      </select>
    </div>
  );
}
