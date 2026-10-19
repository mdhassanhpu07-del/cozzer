import { Product, Category, FilterState, AdminStats, CsvProductRow, CsvImportResult, CsvValidationError } from "@/types";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "./demo-data";
import { isSupabaseConfigured, supabase } from "../supabase/client";
import { slugify } from "../utils";

// Local storage key for interactive preview modifications when Supabase is not connected
const LOCAL_STORAGE_PRODUCTS_KEY = "cozzer_local_products_v1";
const LOCAL_STORAGE_CATEGORIES_KEY = "cozzer_local_categories_v1";

// In-memory fallback cache
let memoryProducts: Product[] = [...DEMO_PRODUCTS];
let memoryCategories: Category[] = [...DEMO_CATEGORIES];

function getStoredProducts(): Product[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback to in-memory
    }
  }
  return memoryProducts;
}

function setStoredProducts(products: Product[]) {
  memoryProducts = [...products];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }
}

function getStoredCategories(): Category[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback to in-memory
    }
  }
  return memoryCategories;
}

function setStoredCategories(categories: Category[]) {
  memoryCategories = [...categories];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local categories", e);
    }
  }
  return getStoredCategories();
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export interface GetProductsOptions {
  categorySlug?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: FilterState["sortBy"];
  inStockOnly?: boolean;
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Filter and paginate products
 */
export async function getProducts(options: GetProductsOptions = {}): Promise<GetProductsResponse> {
  const {
    categorySlug,
    searchQuery,
    minPrice,
    maxPrice,
    sortBy = "newest",
    inStockOnly = false,
    page = 1,
    limit = 12,
    includeDrafts = false,
  } = options;

  let allProducts = getStoredProducts();

  // If Supabase is configured and reachable
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*),
          images:product_images(*)
        `, { count: "exact" });

      if (!includeDrafts) {
        query = query.eq("is_published", true);
      }

      if (categorySlug) {
        // Find category id first
        const category = await getCategoryBySlug(categorySlug);
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`);
      }

      if (minPrice !== undefined) {
        query = query.gte("price", minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte("price", maxPrice);
      }

      // Sorting
      if (sortBy === "price_asc") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price_desc") {
        query = query.order("price", { ascending: false });
      } else if (sortBy === "name_asc") {
        query = query.order("name", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, count, error } = await query.range(from, to);

      if (!error && data) {
        let items = data as Product[];
        if (inStockOnly) {
          items = items.filter((p) =>
            p.variants?.some((v) => v.is_available && v.stock_quantity > 0)
          );
        }
        return {
          products: items,
          total: count ?? items.length,
          page,
          totalPages: Math.ceil((count ?? items.length) / limit),
        };
      }
    } catch (e) {
      console.warn("Supabase products fetch failed, falling back to local dataset", e);
    }
  }

  // Local filtering logic
  let filtered = allProducts.filter((product) => {
    if (!includeDrafts && !product.is_published) {
      return false;
    }

    if (categorySlug && product.category?.slug !== categorySlug) {
      // Also check category_id if categories are loaded
      const matchedCat = getStoredCategories().find((c) => c.slug === categorySlug);
      if (!matchedCat || product.category_id !== matchedCat.id) {
        return false;
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = product.name.toLowerCase().includes(q);
      const skuMatch = product.sku.toLowerCase().includes(q);
      const descMatch = product.description?.toLowerCase().includes(q) || false;
      if (!nameMatch && !skuMatch && !descMatch) {
        return false;
      }
    }

    if (minPrice !== undefined && product.price < minPrice) {
      return false;
    }

    if (maxPrice !== undefined && product.price > maxPrice) {
      return false;
    }

    if (inStockOnly) {
      const hasStock = product.variants?.some((v) => v.is_available && v.stock_quantity > 0);
      if (!hasStock) return false;
    }

    return true;
  });

  // Local sorting
  filtered.sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    // Newest
    return (b.created_at || "").localeCompare(a.created_at || "");
  });

  const total = filtered.length;
  const from = (page - 1) * limit;
  const paginated = filtered.slice(from, from + limit);

  return {
    products: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*),
          images:product_images(*)
        `)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch {
      // fallback
    }
  }

  const products = getStoredProducts();
  return products.find((p) => p.slug === slug) || null;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*),
          images:product_images(*)
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch {
      // fallback
    }
  }

  const products = getStoredProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * Fetch related products
 */
export async function getRelatedProducts(
  productId: string,
  categoryId?: string | null,
  limit = 4
): Promise<Product[]> {
  const products = getStoredProducts().filter(
    (p) => p.id !== productId && p.is_published
  );

  if (categoryId) {
    const sameCategory = products.filter((p) => p.category_id === categoryId);
    if (sameCategory.length >= limit) {
      return sameCategory.slice(0, limit);
    }
  }

  return products.slice(0, limit);
}

/**
 * Get dashboard statistics
 */
export async function getAdminStats(): Promise<AdminStats> {
  const products = getStoredProducts();
  const categories = getStoredCategories();

  let outOfStockCount = 0;
  for (const prod of products) {
    if (prod.variants) {
      for (const v of prod.variants) {
        if (!v.is_available || v.stock_quantity <= 0) {
          outOfStockCount++;
        }
      }
    }
  }

  return {
    totalProducts: products.length,
    publishedProducts: products.filter((p) => p.is_published).length,
    draftProducts: products.filter((p) => !p.is_published).length,
    totalCategories: categories.length,
    outOfStockVariants: outOfStockCount,
    featuredProducts: products.filter((p) => p.is_featured).length,
  };
}

/**
 * Save product (Create or Update)
 */
export async function saveProduct(productData: Partial<Product>): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const products = getStoredProducts();
    const categories = getStoredCategories();
    const isNew = !productData.id || productData.id.startsWith("new-") || !products.some((p) => p.id === productData.id);

    const generatedId = isNew ? `prod-${Date.now()}` : productData.id!;
    const slug = productData.slug || slugify(productData.name || "cozzer-shoe");
    
    // Associate category object
    const categoryObj = categories.find((c) => c.id === productData.category_id) || null;

    const fullProduct: Product = {
      id: generatedId,
      name: productData.name || "Untitled Shoe",
      slug,
      sku: productData.sku || `COZ-${Date.now().toString().slice(-4)}`,
      category_id: productData.category_id || null,
      category: categoryObj,
      description: productData.description || "",
      material: productData.material || "",
      price: Number(productData.price) || 0,
      mrp: productData.mrp ? Number(productData.mrp) : null,
      is_published: productData.is_published ?? true,
      is_featured: productData.is_featured ?? false,
      created_at: productData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants: productData.variants || [],
      images: productData.images || [],
    };

    if (isNew) {
      products.unshift(fullProduct);
    } else {
      const idx = products.findIndex((p) => p.id === productData.id);
      if (idx !== -1) {
        products[idx] = fullProduct;
      } else {
        products.unshift(fullProduct);
      }
    }

    setStoredProducts(products);

    // If Supabase is connected, sync to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").upsert({
          id: fullProduct.id,
          name: fullProduct.name,
          slug: fullProduct.slug,
          sku: fullProduct.sku,
          category_id: fullProduct.category_id,
          description: fullProduct.description,
          material: fullProduct.material,
          price: fullProduct.price,
          mrp: fullProduct.mrp,
          is_published: fullProduct.is_published,
          is_featured: fullProduct.is_featured,
        });
      } catch (err) {
        console.warn("Supabase upsert failed:", err);
      }
    }

    return { success: true, product: fullProduct };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save product";
    return { success: false, error: message };
  }
}

/**
 * Delete product
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const products = getStoredProducts().filter((p) => p.id !== id);
    setStoredProducts(products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete failed:", err);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return { success: false, error: message };
  }
}

/**
 * Toggle publish status
 */
export async function toggleProductPublishStatus(id: string, isPublished: boolean): Promise<boolean> {
  const products = getStoredProducts();
  const prod = products.find((p) => p.id === id);
  if (prod) {
    prod.is_published = isPublished;
    prod.updated_at = new Date().toISOString();
    setStoredProducts(products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").update({ is_published: isPublished }).eq("id", id);
      } catch {
        // ignore
      }
    }
    return true;
  }
  return false;
}

/**
 * CSV Bulk Import validation and execution
 */
export async function importProductsFromCsv(rows: CsvProductRow[]): Promise<CsvImportResult> {
  const errors: CsvValidationError[] = [];
  const validProducts: Product[] = [];
  const existingProducts = getStoredProducts();
  const existingSkus = new Set(existingProducts.map((p) => p.sku.toUpperCase()));
  const categories = getStoredCategories();

  rows.forEach((row, index) => {
    const rowNum = index + 2; // account for header line + 1-based index

    // Check SKU
    if (!row.sku || !row.sku.trim()) {
      errors.push({ row: rowNum, column: "sku", message: "SKU is required." });
      return;
    }
    const cleanSku = row.sku.trim().toUpperCase();
    if (existingSkus.has(cleanSku)) {
      errors.push({ row: rowNum, sku: cleanSku, column: "sku", message: `Duplicate SKU '${cleanSku}' already exists.` });
      return;
    }

    // Check Name
    if (!row.name || !row.name.trim()) {
      errors.push({ row: rowNum, sku: cleanSku, column: "name", message: "Product name is required." });
      return;
    }

    // Check Price
    const priceNum = Number(row.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.push({ row: rowNum, sku: cleanSku, column: "price", message: "Price must be a positive number." });
      return;
    }

    // Check Category
    const categoryName = (row.category || "").trim().toLowerCase();
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === categoryName || c.slug === slugify(categoryName)
    ) || categories[0]; // fallback to default category if unmatched

    // Parse MRP
    const mrpNum = row.mrp ? Number(row.mrp) : undefined;
    if (mrpNum !== undefined && (isNaN(mrpNum) || mrpNum < priceNum)) {
      errors.push({ row: rowNum, sku: cleanSku, column: "mrp", message: "MRP must be greater than or equal to selling price." });
      return;
    }

    // Parse Sizes and Colours for Variants
    const sizes = (row.sizes || "UK 7,UK 8,UK 9,UK 10")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const colourEntries = (row.colours || "Classic Black:#171717")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const stockPerVariant = Math.max(0, parseInt(String(row.stock_per_variant || 10), 10) || 10);
    const productId = `prod-csv-${Date.now()}-${index}`;

    const variants = [];
    for (const clr of colourEntries) {
      const parts = clr.split(":");
      const colourName = parts[0]?.trim() || "Classic";
      const colourHex = parts[1]?.trim() || "#171717";

      for (const size of sizes) {
        variants.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          product_id: productId,
          size,
          colour: colourName,
          colour_code: colourHex,
          sku: `${cleanSku}-${size.replace(/\s+/g, "")}-${colourName.substring(0, 3).toUpperCase()}`,
          stock_quantity: stockPerVariant,
          is_available: stockPerVariant > 0,
        });
      }
    }

    // Parse Images
    const imageUrls = (row.image_urls || "https://images.unsplash.com/photo-1549298916-b41d501d3772")
      .split(/[,|]/)
      .map((url) => url.trim())
      .filter(Boolean);

    const images = imageUrls.map((url, imgIdx) => ({
      id: `img-${Date.now()}-${imgIdx}`,
      product_id: productId,
      image_url: url,
      alt_text: `${row.name} - View ${imgIdx + 1}`,
      display_order: imgIdx + 1,
      is_primary: imgIdx === 0,
    }));

    const isPublished =
      row.is_published === undefined ||
      String(row.is_published).toLowerCase() === "true" ||
      String(row.is_published).toLowerCase() === "1";

    const isFeatured =
      String(row.is_featured).toLowerCase() === "true" ||
      String(row.is_featured).toLowerCase() === "1";

    const newProduct: Product = {
      id: productId,
      name: row.name.trim(),
      slug: slugify(row.name.trim()) + "-" + cleanSku.toLowerCase(),
      sku: cleanSku,
      category_id: matchedCategory.id,
      category: matchedCategory,
      description: row.description || "Crafted with precision for distinction.",
      material: row.material || "Full Grain Leather",
      price: priceNum,
      mrp: mrpNum || null,
      is_published: isPublished,
      is_featured: isFeatured,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants,
      images,
    };

    existingSkus.add(cleanSku);
    validProducts.push(newProduct);
  });

  if (validProducts.length > 0) {
    const updatedList = [...validProducts, ...existingProducts];
    setStoredProducts(updatedList);
  }

  return {
    success: errors.length === 0,
    totalRows: rows.length,
    importedCount: validProducts.length,
    skippedCount: errors.length,
    errors,
  };
}
