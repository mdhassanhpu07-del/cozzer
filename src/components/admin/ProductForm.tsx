"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, Category, ProductVariant, ProductImage } from "@/types";
import { saveProduct } from "@/lib/data/products";
import { slugify } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Save,
  ArrowLeft,
  Sparkles,
  Layers,
} from "lucide-react";

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: Category[];
}

export default function ProductForm({ initialProduct, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct?.id);

  const [name, setName] = useState(initialProduct?.name || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [categoryId, setCategoryId] = useState(
    initialProduct?.category_id || categories[0]?.id || ""
  );
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [material, setMaterial] = useState(initialProduct?.material || "");
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "");
  const [mrp, setMrp] = useState(initialProduct?.mrp ? String(initialProduct.mrp) : "");
  const [isPublished, setIsPublished] = useState(
    initialProduct?.is_published !== undefined ? initialProduct.is_published : true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialProduct?.is_featured !== undefined ? initialProduct.is_featured : false
  );

  // Images state
  const [images, setImages] = useState<ProductImage[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : [
          {
            id: "img-default",
            product_id: initialProduct?.id || "",
            image_url:
              "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
            alt_text: "Primary Product Photo",
            display_order: 1,
            is_primary: true,
          },
        ]
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants
      : [
          {
            id: `var-${Date.now()}-1`,
            product_id: initialProduct?.id || "",
            size: "UK 7",
            colour: "Obsidian Black",
            colour_code: "#171717",
            sku: "",
            stock_quantity: 10,
            is_available: true,
          },
          {
            id: `var-${Date.now()}-2`,
            product_id: initialProduct?.id || "",
            size: "UK 8",
            colour: "Obsidian Black",
            colour_code: "#171717",
            sku: "",
            stock_quantity: 15,
            is_available: true,
          },
          {
            id: `var-${Date.now()}-3`,
            product_id: initialProduct?.id || "",
            size: "UK 9",
            colour: "Obsidian Black",
            colour_code: "#171717",
            sku: "",
            stock_quantity: 8,
            is_available: true,
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Variant helper: Add single row
  const addVariantRow = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product_id: initialProduct?.id || "",
      size: "UK 8",
      colour: variants[0]?.colour || "Obsidian Black",
      colour_code: variants[0]?.colour_code || "#171717",
      sku: `${sku || "COZ"}-UK8`,
      stock_quantity: 10,
      is_available: true,
    };
    setVariants([...variants, newVariant]);
  };

  // Quick generate full UK 6 - 11 run for a given colour
  const generateSizeRun = () => {
    const baseColour = variants[0]?.colour || "Obsidian Black";
    const baseHex = variants[0]?.colour_code || "#171717";
    const standardSizes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

    const newRows: ProductVariant[] = standardSizes.map((sz, idx) => ({
      id: `var-gen-${Date.now()}-${idx}`,
      product_id: initialProduct?.id || "",
      size: sz,
      colour: baseColour,
      colour_code: baseHex,
      sku: `${sku || "COZ"}-${sz.replace(/\s+/g, "")}`,
      stock_quantity: 10,
      is_available: true,
    }));

    setVariants(newRows);
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // Image helpers
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    const newImg: ProductImage = {
      id: `img-${Date.now()}`,
      product_id: initialProduct?.id || "",
      image_url: newImageUrl.trim(),
      alt_text: name || "Product Image",
      display_order: images.length + 1,
      is_primary: images.length === 0,
    };
    setImages([...images, newImg]);
    setNewImageUrl("");
  };

  const setPrimaryImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: img.id === id,
      }))
    );
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const remaining = prev.filter((img) => img.id !== id);
      if (remaining.length > 0 && !remaining.some((i) => i.is_primary)) {
        remaining[0].is_primary = true;
      }
      return remaining;
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Product Name is required.");
      return;
    }

    if (!sku.trim()) {
      setError("Unique SKU is required.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid positive price.");
      return;
    }

    const mrpNum = mrp ? parseFloat(mrp) : undefined;
    if (mrpNum !== undefined && (isNaN(mrpNum) || mrpNum < priceNum)) {
      setError("MRP must be greater than or equal to the selling price.");
      return;
    }

    if (variants.length === 0) {
      setError("At least one size and colour variant is required.");
      return;
    }

    setSaving(true);

    const payload: Partial<Product> = {
      id: initialProduct?.id,
      name: name.trim(),
      slug: initialProduct?.slug || slugify(name.trim()),
      sku: sku.trim().toUpperCase(),
      category_id: categoryId,
      description: description.trim(),
      material: material.trim(),
      price: priceNum,
      mrp: mrpNum || null,
      is_published: isPublished,
      is_featured: isFeatured,
      images,
      variants,
    };

    const res = await saveProduct(payload);
    setSaving(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } else {
      setError(res.error || "Failed to save product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#EAE4D8]">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#171717]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-[#9B7B50] rounded border-stone-300 focus:ring-[#9B7B50]"
            />
            <span>{isPublished ? "Published (Live in Catalogue)" : "Draft (Hidden from Public)"}</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#9B7B50]" />
            <span>{saving ? "Saving..." : isEditing ? "Update Product" : "Publish Product"}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Product saved successfully! Redirecting...</span>
        </div>
      )}

      {/* Section 1: General Product Details */}
      <div className="bg-white border border-[#EAE4D8] p-6 space-y-6">
        <h3 className="font-serif-luxury text-lg font-semibold text-[#171717] pb-3 border-b border-[#EAE4D8]">
          1. General Product Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. COZZER Sovereign Wholecut Oxford"
              className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Unique SKU (Stock Keeping Unit) *
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="e.g. COZ-FOR-001"
              className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs font-mono uppercase text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Selling Price (₹ INR) *
            </label>
            <input
              type="number"
              step="1"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 4499"
              className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Optional MRP (₹ INR)
            </label>
            <input
              type="number"
              step="1"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="e.g. 5999"
              className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Materials & Construction Details
          </label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g. Full Grain Italian Nappa Leather, Memory Foam Insole, Vulcanized Rubber Outsole"
            className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed craftsmanship notes, silhouette description, and fit guidance..."
            className="w-full bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          />
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-[#9B7B50] rounded border-stone-300 focus:ring-[#9B7B50]"
            />
            <span>Highlight on Homepage as Featured Product</span>
          </label>
        </div>
      </div>

      {/* Section 2: Product Photography & Image Management */}
      <div className="bg-white border border-[#EAE4D8] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#EAE4D8]">
          <h3 className="font-serif-luxury text-lg font-semibold text-[#171717]">
            2. Product Photography
          </h3>
          <span className="text-xs text-stone-500">
            Reorder or assign primary image to show on catalogue cards
          </span>
        </div>

        {/* Existing Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative aspect-[3/4] bg-[#FAF8F5] border-2 overflow-hidden flex flex-col justify-between p-2 ${
                img.is_primary ? "border-[#9B7B50]" : "border-[#EAE4D8]"
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || "Footwear"}
                fill
                sizes="150px"
                className="object-cover"
              />

              {img.is_primary && (
                <span className="relative z-10 bg-[#9B7B50] text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold self-start shadow">
                  Primary
                </span>
              )}

              <div className="relative z-10 mt-auto flex items-center justify-between bg-black/60 backdrop-blur-sm p-1 text-white text-xs">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(img.id)}
                    className="text-[10px] hover:text-[#C4AC8D] underline"
                  >
                    Make Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="text-stone-300 hover:text-rose-400 ml-auto p-1"
                  aria-label="Remove Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Image URL input */}
        <div className="pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1">
            Add Image URL (Unsplash or Supabase Storage URL)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 bg-[#FAF8F5] border border-[#C4AC8D] px-3.5 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="inline-flex items-center gap-1.5 bg-[#171717] text-white px-4 py-2 text-xs uppercase font-semibold tracking-wider hover:bg-[#2A2927]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Size & Colour Variant Matrix & Stock Availability */}
      <div className="bg-white border border-[#EAE4D8] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#EAE4D8]">
          <div>
            <h3 className="font-serif-luxury text-lg font-semibold text-[#171717]">
              3. Size & Colour Variants (Live Workshop Stock)
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Accurately manage size availability. Stock values directly govern public catalogue badges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={generateSizeRun}
              className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#9B7B50] text-[#9B7B50] hover:bg-[#9B7B50] hover:text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Generate Standard Run (UK 6 – 11)</span>
            </button>
            <button
              type="button"
              onClick={addVariantRow}
              className="inline-flex items-center gap-1 bg-[#171717] text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
            >
              <Plus className="w-3 h-3" />
              <span>Add Row</span>
            </button>
          </div>
        </div>

        {/* Variants Table */}
        <div className="overflow-x-auto border border-[#EAE4D8]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#EAE4D8] text-stone-700 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-3">Size</th>
                <th className="p-3">Colour Name</th>
                <th className="p-3">Hex</th>
                <th className="p-3">Variant SKU</th>
                <th className="p-3">Stock Units</th>
                <th className="p-3 text-center">Available?</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8]">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-stone-50/50">
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => updateVariant(v.id, "size", e.target.value)}
                      placeholder="e.g. UK 8"
                      className="w-20 bg-white border border-[#C4AC8D] px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={v.colour}
                      onChange={(e) => updateVariant(v.id, "colour", e.target.value)}
                      placeholder="e.g. Obsidian Black"
                      className="w-36 bg-white border border-[#C4AC8D] px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-2.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={v.colour_code || "#171717"}
                        onChange={(e) => updateVariant(v.id, "colour_code", e.target.value)}
                        className="w-6 h-6 p-0 border border-stone-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={v.colour_code || "#171717"}
                        onChange={(e) => updateVariant(v.id, "colour_code", e.target.value)}
                        className="w-20 bg-white border border-[#C4AC8D] px-1.5 py-1 text-[11px] font-mono"
                      />
                    </div>
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={v.sku || ""}
                      onChange={(e) => updateVariant(v.id, "sku", e.target.value)}
                      placeholder="Auto or Custom"
                      className="w-32 bg-white border border-[#C4AC8D] px-2 py-1 text-xs font-mono"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      min="0"
                      value={v.stock_quantity}
                      onChange={(e) => {
                        const count = parseInt(e.target.value, 10) || 0;
                        updateVariant(v.id, "stock_quantity", count);
                        if (count === 0) updateVariant(v.id, "is_available", false);
                        else if (!v.is_available) updateVariant(v.id, "is_available", true);
                      }}
                      className="w-20 bg-white border border-[#C4AC8D] px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="p-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={v.is_available && v.stock_quantity > 0}
                      onChange={(e) => updateVariant(v.id, "is_available", e.target.checked)}
                      className="w-4 h-4 text-[#9B7B50] rounded border-stone-300 focus:ring-[#9B7B50]"
                    />
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(v.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      aria-label="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
}
