"use client";

import React from "react";
import { ProductVariant } from "@/types";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedSize: string;
  selectedColour: string;
  onSelectSize: (size: string) => void;
  onSelectColour: (colour: string) => void;
}

export default function VariantSelector({
  variants,
  selectedSize,
  selectedColour,
  onSelectSize,
  onSelectColour,
}: VariantSelectorProps) {
  // Extract unique colours
  const coloursMap = new Map<string, string>();
  variants.forEach((v) => {
    if (!coloursMap.has(v.colour)) {
      coloursMap.set(v.colour, v.colour_code || "#171717");
    }
  });
  const colours = Array.from(coloursMap.entries());

  // Filter sizes available for the currently selected colour (or all sizes if none selected)
  const availableVariantsForColour = variants.filter(
    (v) => !selectedColour || v.colour === selectedColour
  );

  // Unique sizes in order
  const distinctSizes = Array.from(
    new Set(availableVariantsForColour.map((v) => v.size))
  );

  // Find currently active variant to show precise stock status
  const currentVariant = variants.find(
    (v) => v.colour === selectedColour && v.size === selectedSize
  );

  return (
    <div className="space-y-6">
      {/* Colour Selection */}
      {colours.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="uppercase tracking-wider font-semibold text-stone-500">
              Select Colour:
            </span>
            <span className="font-medium text-[#171717]">{selectedColour}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colours.map(([colourName, hex]) => {
              const isSelected = selectedColour === colourName;
              return (
                <button
                  key={colourName}
                  type="button"
                  onClick={() => onSelectColour(colourName)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 border text-xs transition-all",
                    isSelected
                      ? "border-[#171717] bg-[#171717] text-white font-semibold shadow-sm"
                      : "border-[#EAE4D8] bg-white text-stone-700 hover:border-[#9B7B50]"
                  )}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{colourName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="uppercase tracking-wider font-semibold text-stone-500">
            Available Sizes (UK / India):
          </span>
          <span className="text-[11px] text-[#9B7B50] font-medium underline cursor-pointer">
            Standard UK/India Fit
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {distinctSizes.map((size) => {
            const v = availableVariantsForColour.find((item) => item.size === size);
            const isAvailable = Boolean(v && v.is_available && v.stock_quantity > 0);
            const isSelected = selectedSize === size;
            const isLowStock = Boolean(v && isAvailable && v.stock_quantity <= 2);

            return (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize(size)}
                className={cn(
                  "relative py-3 px-2 border text-center transition-all flex flex-col items-center justify-center",
                  isSelected
                    ? "border-[#171717] bg-[#171717] text-white font-bold shadow-md"
                    : isAvailable
                    ? "border-[#EAE4D8] bg-white text-[#171717] hover:border-[#9B7B50]"
                    : "border-stone-200 bg-stone-100/60 text-stone-400 line-through"
                )}
              >
                <span className="text-xs">{size}</span>
                {isLowStock && (
                  <span
                    className={cn(
                      "text-[9px] uppercase tracking-tighter mt-0.5",
                      isSelected ? "text-[#C4AC8D]" : "text-amber-700 font-medium"
                    )}
                  >
                    Few Left
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Variant Stock Status Card */}
      {currentVariant ? (
        <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                currentVariant.is_available && currentVariant.stock_quantity > 0
                  ? currentVariant.stock_quantity <= 2
                    ? "bg-amber-500"
                    : "bg-emerald-600"
                  : "bg-rose-500"
              )}
            />
            <span className="font-medium text-[#171717]">
              {currentVariant.size} ({currentVariant.colour}):
            </span>
            <span className="text-stone-600">
              {currentVariant.is_available && currentVariant.stock_quantity > 0
                ? currentVariant.stock_quantity <= 2
                  ? `Low Stock (${currentVariant.stock_quantity} pairs remaining)`
                  : `In Stock Ready for Dispatch (${currentVariant.stock_quantity} pairs)`
                : "Temporarily Reserved / Pre-order Enquiry"}
            </span>
          </div>
          {currentVariant.sku && (
            <span className="font-mono text-[10px] text-stone-400 hidden sm:inline">
              {currentVariant.sku}
            </span>
          )}
        </div>
      ) : (
        <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] text-xs text-stone-500 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-[#9B7B50]" />
          <span>Please select your desired size and colour to verify live availability.</span>
        </div>
      )}
    </div>
  );
}
