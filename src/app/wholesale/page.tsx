import React from "react";
import { Metadata } from "next";
import WholesaleClient from "./WholesaleClient";

export const metadata: Metadata = {
  title: "Wholesale & B2B Retailer Enquiries",
  description:
    "Partner with COZZER for wholesale supply of handcrafted luxury footwear. Low MOQs starting at 12 pairs, high gross margins, and pan-India insured logistics.",
};

export default function WholesalePage() {
  return <WholesaleClient />;
}
