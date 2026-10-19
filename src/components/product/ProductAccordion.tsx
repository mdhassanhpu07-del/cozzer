"use client";

import React, { useState } from "react";
import { ChevronDown, Shield, Ruler, Sparkles, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductAccordionProps {
  description?: string | null;
  material?: string | null;
}

export default function ProductAccordion({ description, material }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string>("details");

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="border-t border-[#EAE4D8] divide-y divide-[#EAE4D8] text-sm">
      {/* Product Details Section */}
      <div className="py-4">
        <button
          onClick={() => toggle("details")}
          className="w-full flex items-center justify-between text-left font-serif-luxury font-medium text-base text-[#171717] hover:text-[#9B7B50]"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9B7B50]" />
            Description & Silhouette
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              openSection === "details" && "rotate-180"
            )}
          />
        </button>
        {openSection === "details" && (
          <div className="pt-3 pb-1 text-stone-600 text-xs leading-relaxed font-light">
            <p>{description || "Crafted with painstaking attention to detail and balance."}</p>
          </div>
        )}
      </div>

      {/* Materials & Craftsmanship */}
      <div className="py-4">
        <button
          onClick={() => toggle("materials")}
          className="w-full flex items-center justify-between text-left font-serif-luxury font-medium text-base text-[#171717] hover:text-[#9B7B50]"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#9B7B50]" />
            Materials & Construction
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              openSection === "materials" && "rotate-180"
            )}
          />
        </button>
        {openSection === "materials" && (
          <div className="pt-3 pb-1 text-stone-600 text-xs leading-relaxed font-light space-y-2">
            <p>
              <strong className="text-stone-800 font-medium">Upper Material:</strong>{" "}
              {material || "Finest Selected Leathers and Durable Textiles"}
            </p>
            <p>
              <strong className="text-stone-800 font-medium">Lining:</strong> Breathable moisture-wicking calfskin lining with cushioned anti-shock insole.
            </p>
            <p>
              <strong className="text-stone-800 font-medium">Finishing:</strong> Hand-burnished by master artisans to create a rich, distinctive surface patina.
            </p>
          </div>
        )}
      </div>

      {/* Sizing & Fit Guide */}
      <div className="py-4">
        <button
          onClick={() => toggle("sizing")}
          className="w-full flex items-center justify-between text-left font-serif-luxury font-medium text-base text-[#171717] hover:text-[#9B7B50]"
        >
          <span className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#9B7B50]" />
            Size Chart & Fit Guide (UK / India)
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              openSection === "sizing" && "rotate-180"
            )}
          />
        </button>
        {openSection === "sizing" && (
          <div className="pt-3 pb-1 text-xs text-stone-600 space-y-3">
            <p className="font-light">
              COZZER footwear adheres to standard UK/Indian footwear measurements. If you are in between sizes, we recommend contacting our WhatsApp concierge for a personalised fit recommendation.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-[#EAE4D8]">
                <thead className="bg-[#FAF8F5] text-stone-700 font-semibold border-b border-[#EAE4D8]">
                  <tr>
                    <th className="p-2 border-r border-[#EAE4D8]">UK / India</th>
                    <th className="p-2 border-r border-[#EAE4D8]">EU</th>
                    <th className="p-2 border-r border-[#EAE4D8]">US</th>
                    <th className="p-2">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D8]">
                  <tr>
                    <td className="p-2 font-medium border-r border-[#EAE4D8]">UK 6</td>
                    <td className="p-2 border-r border-[#EAE4D8]">40</td>
                    <td className="p-2 border-r border-[#EAE4D8]">7.0</td>
                    <td className="p-2">25.0 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-[#EAE4D8]">UK 7</td>
                    <td className="p-2 border-r border-[#EAE4D8]">41</td>
                    <td className="p-2 border-r border-[#EAE4D8]">8.0</td>
                    <td className="p-2">25.8 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-[#EAE4D8]">UK 8</td>
                    <td className="p-2 border-r border-[#EAE4D8]">42</td>
                    <td className="p-2 border-r border-[#EAE4D8]">9.0</td>
                    <td className="p-2">26.7 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-[#EAE4D8]">UK 9</td>
                    <td className="p-2 border-r border-[#EAE4D8]">43</td>
                    <td className="p-2 border-r border-[#EAE4D8]">10.0</td>
                    <td className="p-2">27.5 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-[#EAE4D8]">UK 10</td>
                    <td className="p-2 border-r border-[#EAE4D8]">44</td>
                    <td className="p-2 border-r border-[#EAE4D8]">11.0</td>
                    <td className="p-2">28.3 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium border-r border-[#EAE4D8]">UK 11</td>
                    <td className="p-2 border-r border-[#EAE4D8]">45</td>
                    <td className="p-2 border-r border-[#EAE4D8]">12.0</td>
                    <td className="p-2">29.2 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Fulfillment & Logistics */}
      <div className="py-4">
        <button
          onClick={() => toggle("shipping")}
          className="w-full flex items-center justify-between text-left font-serif-luxury font-medium text-base text-[#171717] hover:text-[#9B7B50]"
        >
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#9B7B50]" />
            Dispatch & Logistics
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              openSection === "shipping" && "rotate-180"
            )}
          />
        </button>
        {openSection === "shipping" && (
          <div className="pt-3 pb-1 text-stone-600 text-xs leading-relaxed font-light space-y-2">
            <p>
              In-stock pairs are prepared and dispatched within 24 to 48 hours via premium express air couriers across India.
            </p>
            <p>
              Real-time consignment tracking links are provided via WhatsApp and SMS immediately following courier pickup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
