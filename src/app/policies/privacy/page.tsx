import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | COZZER Footwear",
  description: "COZZER privacy practices regarding client communications and enquiry data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 max-w-3xl space-y-8">
      <div className="border-b border-[#EAE4D8] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
          Data Governance
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#171717] font-normal">
          Privacy Policy
        </h1>
        <p className="text-stone-500 text-xs">Last Updated: October 2025</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm leading-relaxed space-y-6 text-stone-700">
        <p>
          At <strong>COZZER</strong>, we hold client discretion and privacy in the highest regard. This Privacy Policy outlines how information is gathered and used when you interact with our catalogue website.
        </p>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            1. Information We Do Not Collect
          </h2>
          <p>
            Because this website does not feature online checkouts, accounts, or payment processing, we do not solicit, process, or store credit card numbers, debit card details, CVVs, or online banking credentials on our web servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            2. Enquiry & WhatsApp Communications
          </h2>
          <p>
            When you initiate a WhatsApp enquiry or call our concierge desk, your communication is transmitted directly via the respective telecommunications provider or Meta/WhatsApp application under their standard end-to-end encryption protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            3. Analytics & Cookies
          </h2>
          <p>
            We may use minimal, privacy-conscious technical cookies strictly required to ensure responsive navigation, category filter retention, and aggregated performance diagnostics. We do not sell user data to advertising data brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl text-[#171717] font-medium">
            4. Contact
          </h2>
          <p>
            For any queries regarding privacy practices, please contact our compliance desk at <code>concierge@cozzer.in</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
