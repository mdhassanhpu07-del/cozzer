"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAdminStats, getProducts, toggleProductPublishStatus } from "@/lib/data/products";
import { AdminStats, Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Layers,
  AlertTriangle,
  PlusCircle,
  FileSpreadsheet,
  ExternalLink,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, prods] = await Promise.all([
        getAdminStats(),
        getProducts({
          limit: 6,
          sortBy: "newest",
          includeDrafts: true,
        }),
      ]);
      setStats(s);
      setRecentProducts(prods.products);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleProductPublishStatus(id, !currentStatus);
    await loadData();
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Dashboard Overview"
        description="Live operational telemetry for the COZZER footwear catalogue & inventory."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 bg-[#171717] hover:bg-[#2A2927] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#9B7B50]" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/import"
              className="inline-flex items-center gap-1.5 bg-white border border-[#C4AC8D] hover:bg-[#FAF8F5] text-[#171717] px-4 py-2 text-xs uppercase tracking-wider font-semibold shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#9B7B50]" />
              <span>Import CSV</span>
            </Link>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white border border-[#EAE4D8] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Total Products
            </span>
            <Package className="w-4 h-4 text-[#9B7B50]" />
          </div>
          <div className="text-3xl font-sans font-bold text-[#171717] tracking-[-0.02em]">
            {loading ? "—" : stats?.totalProducts || 0}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-normal">
            <span className="text-emerald-700 font-semibold">{stats?.publishedProducts || 0} Published</span>
            <span>•</span>
            <span className="text-stone-400">{stats?.draftProducts || 0} Drafts</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border border-[#EAE4D8] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Active Categories
            </span>
            <Layers className="w-4 h-4 text-[#9B7B50]" />
          </div>
          <div className="text-3xl font-sans font-bold text-[#171717] tracking-[-0.02em]">
            {loading ? "—" : stats?.totalCategories || 6}
          </div>
          <p className="text-[11px] text-stone-500 font-normal">
            Casual, Formal, Loafers, Boots, Kids, Ethnic
          </p>
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-white border border-[#EAE4D8] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Out of Stock Variants
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-sans font-bold text-[#171717] tracking-[-0.02em]">
            {loading ? "—" : stats?.outOfStockVariants || 0}
          </div>
          <p className="text-[11px] text-stone-500 font-normal">
            Sizes requiring replenishment
          </p>
        </div>

        {/* Featured Products */}
        <div className="bg-white border border-[#EAE4D8] p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Homepage Featured
            </span>
            <Package className="w-4 h-4 text-[#9B7B50]" />
          </div>
          <div className="text-3xl font-sans font-bold text-[#171717] tracking-[-0.02em]">
            {loading ? "—" : stats?.featuredProducts || 0}
          </div>
          <p className="text-[11px] text-stone-500 font-normal">
            Showcased on main campaign hero
          </p>
        </div>
      </div>

      {/* Quick Access Actions Bar */}
      <div className="bg-[#FAF8F5] border border-[#EAE4D8] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-bold text-[#171717]">
            Quick Operations:
          </span>
          <Link
            href="/admin/products"
            className="text-xs text-[#9B7B50] hover:text-[#7D623C] font-semibold underline"
          >
            Manage All Inventory
          </Link>
          <span className="text-stone-300">•</span>
          <a
            href="/templates/cozzer_product_import_template.csv"
            download
            className="text-xs text-[#9B7B50] hover:text-[#7D623C] font-semibold underline"
          >
            Download CSV Template
          </a>
        </div>

        <Link
          href="/catalogue"
          target="_blank"
          className="text-xs text-stone-600 hover:text-[#171717] flex items-center gap-1 font-medium"
        >
          <span>Preview Public Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white border border-[#EAE4D8] shadow-sm space-y-4 p-6">
        <div className="flex justify-between items-center pb-3 border-b border-[#EAE4D8]">
          <h2 className="font-sans text-xl font-bold text-[#171717] tracking-[-0.015em]">
            Recently Updated Footwear
          </h2>
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider text-[#9B7B50] hover:text-[#7D623C] font-bold"
          >
            View All ({stats?.totalProducts || 0}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#EAE4D8] text-stone-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Variants</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8]">
              {recentProducts.map((p) => {
                const totalStock = p.variants?.reduce(
                  (acc, v) => acc + (v.stock_quantity || 0),
                  0
                ) || 0;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#171717]">{p.sku}</td>
                    <td className="p-3 font-semibold text-[#171717]">{p.name}</td>
                    <td className="p-3 text-stone-600 font-normal">{p.category?.name || "Footwear"}</td>
                    <td className="p-3 font-bold text-[#171717]">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="p-3 text-stone-500">
                      {p.variants?.length || 0} sizes ({totalStock} units)
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.is_published)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.is_published
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {p.is_published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-stone-500" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-stone-600 hover:text-[#171717] hover:bg-stone-100 rounded"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-[#9B7B50] hover:bg-stone-100 rounded"
                          title="View on Public Site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
