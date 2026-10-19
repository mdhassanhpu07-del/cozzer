import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/data/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Create New Footwear Silhouette"
        description="Add a new footwear product into the master catalogue with custom variants and stock."
      />
      <ProductForm categories={categories} />
    </div>
  );
}
