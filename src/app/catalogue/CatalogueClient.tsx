"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Category, Product, FilterState } from "@/types";
import { getProducts } from "@/lib/data/products";
import ProductCard from "@/components/catalogue/ProductCard";
import FilterSidebar from "@/components/catalogue/FilterSidebar";
import SortDropdown from "@/components/catalogue/SortDropdown";
import { Search, Filter, X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface CatalogueClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
  initialTotal: number;
  initialTotalPages: number;
}

export default function CatalogueClient({
  initialCategories,
  initialProducts,
  initialTotal,
  initialTotalPages,
}: CatalogueClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Parse filters from URL
  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";
  const sortParam = (searchParams.get("sort") as FilterState["sortBy"]) || "newest";
  const minPriceParam = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const maxPriceParam = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 100000;
  const inStockParam = searchParams.get("inStock") === "true";
  const pageParam = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const [filters, setFilters] = useState<FilterState>({
    categorySlug: categoryParam,
    searchQuery: queryParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sortBy: sortParam,
    inStockOnly: inStockParam,
  });

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setFilters({
      categorySlug: categoryParam,
      searchQuery: queryParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      sortBy: sortParam,
      inStockOnly: inStockParam,
    });
    setCurrentPage(pageParam);
  }, [categoryParam, queryParam, sortParam, minPriceParam, maxPriceParam, inStockParam, pageParam]);

  // Execute fetch when filters or page changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getProducts({
      categorySlug: filters.categorySlug || undefined,
      searchQuery: filters.searchQuery || undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < 100000 ? filters.maxPrice : undefined,
      sortBy: filters.sortBy,
      inStockOnly: filters.inStockOnly,
      page: currentPage,
      limit: 9,
    }).then((res) => {
      if (isMounted) {
        setProducts(res.products);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters, currentPage]);

  const updateUrlParams = (newFilters: FilterState, page = 1) => {
    const params = new URLSearchParams();
    if (newFilters.categorySlug) params.set("category", newFilters.categorySlug);
    if (newFilters.searchQuery) params.set("q", newFilters.searchQuery);
    if (newFilters.sortBy !== "newest") params.set("sort", newFilters.sortBy);
    if (newFilters.minPrice > 0) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice < 100000) params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.inStockOnly) params.set("inStock", "true");
    if (page > 1) params.set("page", page.toString());

    startTransition(() => {
      router.push(`/catalogue?${params.toString()}`);
    });
  };

  const handleFilterChange = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    setFilters(next);
    setCurrentPage(1);
    updateUrlParams(next, 1);
  };

  const handleResetFilters = () => {
    const reset: FilterState = {
      categorySlug: "",
      searchQuery: "",
      minPrice: 0,
      maxPrice: 100000,
      sortBy: "newest",
      inStockOnly: false,
    };
    setFilters(reset);
    setCurrentPage(1);
    updateUrlParams(reset, 1);
  };

  const activeCategory = initialCategories.find((c) => c.slug === filters.categorySlug);

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#EAE4D8] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9B7B50] font-bold">
          The Master Catalogue
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#171717] font-normal">
              {activeCategory ? activeCategory.name : "All Footwear Silhouettes"}
            </h1>
            <p className="text-stone-500 text-xs font-light max-w-xl mt-1">
              {activeCategory?.description ||
                "Browse our complete collection of handcrafted casuals, formal oxfords, loafers, boots, kids' footwear, and ceremonial juttis."}
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing <span className="text-[#171717] font-bold">{total}</span> designs
          </div>
        </div>
      </div>

      {/* Control Bar: Search input, Mobile Filter Toggle, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-[#EAE4D8]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by shoe name or SKU..."
            className="w-full bg-[#FAF8F5] border border-[#C4AC8D] pl-9 pr-4 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#C4AC8D] text-xs font-semibold text-[#171717]"
          >
            <Filter className="w-3.5 h-3.5 text-[#9B7B50]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <SortDropdown
            sortBy={filters.sortBy}
            onChange={(sortBy) => handleFilterChange({ sortBy })}
          />
        </div>
      </div>

      {/* Main Layout: Sidebar & Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            categories={initialCategories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex lg:hidden">
            <div className="relative w-4/5 max-w-xs bg-white h-full overflow-y-auto p-6 space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center pb-3 border-b border-[#EAE4D8]">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#171717]">
                  Filter Catalogue
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-[#171717]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                categories={initialCategories}
                filters={filters}
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                }}
                onResetFilters={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
              />

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#171717] text-white py-3 text-xs uppercase tracking-widest font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white border border-[#EAE4D8] aspect-[3/4] animate-pulse p-4 flex flex-col justify-between"
                >
                  <div className="bg-[#FAF8F5] h-3/4 w-full"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-stone-200 w-3/4"></div>
                    <div className="h-3 bg-stone-100 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8 border-t border-[#EAE4D8]">
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        const nextPage = currentPage - 1;
                        setCurrentPage(nextPage);
                        updateUrlParams(filters, nextPage);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={currentPage <= 1}
                    className="p-2 border border-[#C4AC8D] text-[#171717] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAF8F5]"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 text-xs">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            updateUrlParams(filters, pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-8 h-8 flex items-center justify-center font-semibold border ${
                            isActive
                              ? "bg-[#171717] text-white border-[#171717]"
                              : "bg-white text-stone-700 border-[#EAE4D8] hover:border-[#9B7B50]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        const nextPage = currentPage + 1;
                        setCurrentPage(nextPage);
                        updateUrlParams(filters, nextPage);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={currentPage >= totalPages}
                    className="p-2 border border-[#C4AC8D] text-[#171717] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAF8F5]"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-white border border-[#EAE4D8] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#C4AC8D] flex items-center justify-center mx-auto text-[#9B7B50]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl text-[#171717] font-medium">
                No Footwear Silhouettes Found
              </h3>
              <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
                We couldn&apos;t find any footwear matching your current search or filter combination. Try resetting your filters or contacting our concierge for bespoke sizing.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-[#171717] text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
