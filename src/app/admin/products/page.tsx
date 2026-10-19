"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { getProducts, getCategories, deleteProduct, toggleProductPublishStatus } from "@/lib/data/products";
import { Product, Category } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const cats = await getCategories();
    setCategories(cats);

    const res = await getProducts({
      categorySlug: categorySlug || undefined,
      searchQuery: search || undefined,
      includeDrafts: true,
      page: currentPage,
      limit: 10,
    });

    let items = res.products;
    if (statusFilter === "published") {
      items = items.filter((p) => p.is_published);
    } else if (statusFilter === "draft") {
      items = items.filter((p) => !p.is_published);
    }

    setProducts(items);
    setTotal(res.total);
    setTotalPages(res.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [search, categorySlug, statusFilter, currentPage]);

  const handleToggleStatus = async (id: string, current: boolean) => {
    await toggleProductPublishStatus(id, !current);
    await loadData();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    await deleteProduct(productToDelete.id);
    setDeleting(false);
    setDeleteModalOpen(false);
    setProductToDelete(null);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Products Catalogue Management"
        description="Search, filter, update stock availability, edit variants, or add new footwear designs."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-[#171717] hover:bg-[#2A2927] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#9B7B50]" />
            <span>Add New Product</span>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAE4D8] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name or SKU..."
            className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-4 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category & Status Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={categorySlug}
            onChange={(e) => {
              setCategorySlug(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-[#C4AC8D] px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-white border border-[#C4AC8D] px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          {(search || categorySlug || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setCategorySlug("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="text-xs text-[#9B7B50] hover:text-[#7D623C] flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#EAE4D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#EAE4D8] text-stone-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-3">Photo</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">MRP</th>
                <th className="p-3">Variants & Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-400">
                    Loading catalogue products...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => {
                  const primaryImg =
                    p.images?.find((i) => i.is_primary)?.image_url ||
                    p.images?.[0]?.image_url ||
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&q=80";

                  const totalStock = p.variants?.reduce(
                    (acc, v) => acc + (v.stock_quantity || 0),
                    0
                  ) || 0;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3">
                        <div className="relative w-12 h-14 bg-stone-100 border border-[#EAE4D8] overflow-hidden">
                          <Image
                            src={primaryImg}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#171717] whitespace-nowrap">
                        {p.sku}
                      </td>
                      <td className="p-3 font-medium text-[#171717] max-w-xs">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="hover:text-[#9B7B50] transition-colors"
                        >
                          {p.name}
                        </Link>
                        {p.is_featured && (
                          <span className="ml-2 inline-block bg-[#171717] text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-stone-600 whitespace-nowrap">
                        {p.category?.name || "Footwear"}
                      </td>
                      <td className="p-3 font-semibold text-[#171717] whitespace-nowrap">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="p-3 text-stone-400 whitespace-nowrap">
                        {p.mrp ? formatCurrency(p.mrp) : "—"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              totalStock > 0 ? "bg-emerald-600" : "bg-rose-500"
                            }`}
                          />
                          <span className="font-medium text-stone-700">
                            {p.variants?.length || 0} sizes
                          </span>
                          <span className="text-stone-400">({totalStock} pairs)</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
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
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
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
                            title="View Live Catalogue"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(p)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-400">
                    No products matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#EAE4D8] flex items-center justify-between text-xs text-stone-500">
            <div>
              Showing page <span className="font-bold text-[#171717]">{currentPage}</span> of{" "}
              <span className="font-bold text-[#171717]">{totalPages}</span> ({total} items)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 border border-[#C4AC8D] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 border border-[#C4AC8D] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Footwear Design"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}" (SKU: ${productToDelete?.sku})? This will also remove all associated sizes, colour variants, and image references.`}
        confirmLabel="Confirm Delete"
        isDeleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}
