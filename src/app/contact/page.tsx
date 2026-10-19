import React from "react";
import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Concierge & Experience Studio",
  description:
    "Connect with the COZZER footwear concierge. Inquire about shoe sizing, custom bespoke pairs, studio appointments, and wholesale distribution.",
};

export default function ContactPage() {
  return <ContactClient />;
}
