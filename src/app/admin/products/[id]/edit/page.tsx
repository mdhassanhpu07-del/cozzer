import React from "react";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById, getCategories } from "@/lib/data/products";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit: ${product.name}`}
        description={`Modify SKU: ${product.sku}, update pricing, manage images, or adjust size inventory.`}
      />
      <ProductForm initialProduct={product} categories={categories} />
    </div>
  );
}
