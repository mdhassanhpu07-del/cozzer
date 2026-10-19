import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers as Indian Rupees (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate percentage discount from MRP and Selling Price
 */
export function calculateDiscount(price: number, mrp?: number | null): number | null {
  if (!mrp || mrp <= price) return null;
  const discount = ((mrp - price) / mrp) * 100;
  return Math.round(discount);
}

/**
 * Slugify a title or product name
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates direct WhatsApp enquiry URL with pre-filled product details
 */
export interface ProductEnquiryParams {
  productName: string;
  sku: string;
  selectedSize?: string;
  selectedColour?: string;
  price?: number;
}

export function generateWhatsAppEnquiryUrl(params: ProductEnquiryParams): string {
  const number = siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "");
  
  const lines = [
    `*COZZER Footwear Enquiry*`,
    `--------------------------`,
    `*Product:* ${params.productName}`,
    `*SKU:* ${params.sku}`,
  ];

  if (params.selectedSize) {
    lines.push(`*Selected Size:* ${params.selectedSize}`);
  }

  if (params.selectedColour) {
    lines.push(`*Selected Colour:* ${params.selectedColour}`);
  }

  if (params.price) {
    lines.push(`*Price:* ${formatCurrency(params.price)}`);
  }

  lines.push(
    `--------------------------`,
    `Hello COZZER Team, I am interested in this product from your catalogue. Could you please share availability and ordering details?`
  );

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Generates direct WhatsApp URL for wholesale / B2B bulk orders
 */
export interface WholesaleEnquiryParams {
  businessName?: string;
  contactPerson?: string;
  city?: string;
  categoryOfInterest?: string;
  estimatedPairs?: string | number;
}

export function generateWholesaleWhatsAppUrl(params: WholesaleEnquiryParams): string {
  const number = siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, "");

  const lines = [
    `*COZZER Wholesale & Retailer Enquiry*`,
    `--------------------------------------`,
  ];

  if (params.businessName) lines.push(`*Firm / Business:* ${params.businessName}`);
  if (params.contactPerson) lines.push(`*Contact Person:* ${params.contactPerson}`);
  if (params.city) lines.push(`*City / Region:* ${params.city}`);
  if (params.categoryOfInterest) lines.push(`*Category:* ${params.categoryOfInterest}`);
  if (params.estimatedPairs) lines.push(`*Estimated Quantity:* ${params.estimatedPairs} pairs`);

  lines.push(
    `--------------------------------------`,
    `Hello COZZER Wholesale Desk, we would like to enquire about B2B pricing, Minimum Order Quantities (MOQ), and retailer distribution terms.`
  );

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${message}`;
}
