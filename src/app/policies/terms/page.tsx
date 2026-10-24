import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | COZZER Footwear",
  description: "Terms and conditions governing the use of COZZER's catalogue website.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-3xl space-y-8">
      <div className="border-b border-[#EAE4D8] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold">
          Legal Agreement
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl text-[#171717] font-bold tracking-[-0.02em]">
          Terms of Use
        </h1>
        <p className="text-stone-500 text-xs font-normal">Last Updated: October 2025</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm leading-relaxed space-y-6 text-stone-700 font-normal">
        <section className="space-y-3">
          <h2 className="font-sans text-xl text-[#171717] font-bold tracking-[-0.015em]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or browsing the <strong>COZZER</strong> catalogue website (cozzer.in), you acknowledge and agree to abide by these Terms of Use and our Catalogue Sales Model Disclaimer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl text-[#171717] font-bold tracking-[-0.015em]">
            2. Intellectual Property Rights
          </h2>
          <p>
            The COZZER wordmark, typography, shoe silhouettes, photography, and text content featured on this site are the exclusive intellectual property of COZZER and protected under applicable trademark and copyright laws. Unauthorized reproduction or commercial re-distribution without explicit written permission is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl text-[#171717] font-bold tracking-[-0.015em]">
            3. Accuracy of Catalogue Information
          </h2>
          <p>
            While we endeavor to maintain precise specifications, leather descriptions, and pricing, natural leather characteristics such as grain variation and hand-burnished nuances may vary slightly from piece to piece. Specifications and prices are subject to periodic review.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl text-[#171717] font-bold tracking-[-0.015em]">
            4. Jurisdiction
          </h2>
          <p>
            Any disputes arising from the use of this catalogue website or subsequent concierge sales agreements shall be governed by the laws of India and subject to the exclusive jurisdiction of the competent courts in Uttar Pradesh.
          </p>
        </section>
      </div>
    </div>
  );
}
