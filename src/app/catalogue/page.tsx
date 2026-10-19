import React, { Suspense } from "react";
import { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data/products";
import CatalogueClient from "./CatalogueClient";

export const metadata: Metadata = {
  title: "Complete Footwear Catalogue",
  description:
    "Explore COZZER's comprehensive catalogue of luxury footwear: Casual Sneakers, Wholecut Oxfords, Handcrafted Loafers, Chelsea Boots, Kids' Shoes, and Heritage Ethnic Footwear.",
};

export default async function CataloguePage() {
  const categories = await getCategories();
  const { products, total, totalPages } = await getProducts({
    limit: 9,
    sortBy: "newest",
  });

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#9B7B50] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-stone-500 mt-4">
            Loading Master Catalogue...
          </p>
        </div>
      }
    >
      <CatalogueClient
        initialCategories={categories}
        initialProducts={products}
        initialTotal={total}
        initialTotalPages={totalPages}
      />
    </Suspense>
  );
}
