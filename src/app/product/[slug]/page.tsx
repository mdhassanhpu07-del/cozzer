import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import ProductDetailClient from "./ProductDetailClient";
import { siteConfig } from "@/config/site";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Footwear Silhouette Not Found",
    };
  }

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${product.name} (SKU: ${product.sku})`,
    description: product.description || `Explore ${product.name} from the COZZER footwear catalogue. Crafted with ${product.material || "genuine leather"}.`,
    openGraph: {
      title: `${product.name} | COZZER Luxury Footwear`,
      description: product.description || undefined,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category_id,
    4
  );

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((i) => i.image_url) || [],
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "COZZER",
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.variants?.some((v) => v.is_available && v.stock_quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/LimitedAvailability",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
