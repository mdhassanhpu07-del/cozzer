import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, MessageCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalogue & Sales Model Disclaimer",
  description:
    "Explanation of COZZER's direct product catalogue showcase model and concierge consultation process.",
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-3xl space-y-8">
      <div className="border-b border-[#EAE4D8] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
          Operational Transparency
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#171717] font-normal">
          Catalogue & Sales Model Disclaimer
        </h1>
        <p className="text-stone-500 text-xs">Effective Date: October 2025</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm leading-relaxed space-y-6 text-stone-700">
        <div className="p-4 bg-[#FAF8F5] border-l-4 border-[#9B7B50] space-y-2">
          <strong className="text-[#171717] font-semibold block text-sm">
            Strict Non-Transactional Showcase Website
          </strong>
          <p className="text-xs text-stone-600 font-light">
            COZZER (cozzer.in) operates exclusively as a luxury product catalogue, design portfolio, and brand showroom. This website does not incorporate a digital shopping cart, automated electronic checkout, credit card payment gateways, or automated online order processing.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            1. Why We Operate on an Enquiry Model
          </h2>
          <p>
            Luxury footwear requires tailored attention to fit, foot width, and leather selection. To ensure our patrons and wholesale partners receive the exact sizing matching their expectations, all transactions are handled through human consultation via our verified WhatsApp concierge desk and direct phone lines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            2. Product Availability & Pricing
          </h2>
          <p>
            Prices displayed on the website represent the Maximum Retail Price (MRP) or current catalogue listing price inclusive of Indian Goods & Services Tax (GST). Size-wise availability reflects live workshop stock status. However, sending a WhatsApp enquiry does not automatically reserve stock or constitute a binding sale agreement until confirmed by our specialist.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            3. Wholesale & Retail Orders
          </h2>
          <p>
            Wholesale inquiries are governed by formal commercial purchase orders, GST invoices, and agreed dispatch schedules. Minimum order quantities (MOQs) apply for commercial tiers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            4. Verification & Authentic Communication
          </h2>
          <p>
            COZZER client communications originate solely from our verified WhatsApp number and official domain email addresses. We never request payments via unauthorized personal payment links.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-[#EAE4D8] flex gap-4">
        <Link
          href="/catalogue"
          className="bg-[#171717] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold"
        >
          Return to Catalogue
        </Link>
        <Link
          href="/contact"
          className="border border-[#C4AC8D] text-[#171717] px-6 py-3 text-xs uppercase tracking-widest font-semibold"
        >
          Contact Concierge
        </Link>
      </div>
    </div>
  );
}
