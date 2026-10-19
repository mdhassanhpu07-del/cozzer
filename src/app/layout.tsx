import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/layout/WhatsAppFloatingButton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: "COZZER — Luxury Men's Footwear Catalogue | Retail & Wholesale India",
    template: "%s | COZZER Luxury Footwear",
  },
  description: siteConfig.description,
  keywords: [
    "COZZER",
    "Luxury Footwear India",
    "Handcrafted Leather Shoes",
    "Wholecut Oxfords",
    "Mens Casual Sneakers",
    "Leather Loafers",
    "Mens Boots India",
    "Ethnic Footwear",
    "Footwear Wholesale India",
    "Premium Footwear Catalogue",
  ],
  authors: [{ name: "COZZER Footwear Atelier" }],
  creator: "COZZER",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: "COZZER — Luxury Footwear Catalogue",
    description: siteConfig.description,
    siteName: "COZZER Footwear",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "COZZER Luxury Footwear Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "COZZER — Luxury Footwear Catalogue",
    description: siteConfig.description,
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171717] antialiased selection:bg-[#9B7B50] selection:text-white">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
