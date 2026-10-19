export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  colour: string;
  colour_code?: string | null;
  sku?: string | null;
  stock_quantity: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id?: string | null;
  category?: Category | null;
  description?: string | null;
  material?: string | null;
  price: number;
  mrp?: number | null;
  is_published: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface FilterState {
  searchQuery: string;
  categorySlug: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  inStockOnly: boolean;
}

export interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalCategories: number;
  outOfStockVariants: number;
  featuredProducts: number;
}

export interface CsvProductRow {
  sku: string;
  name: string;
  category: string;
  description: string;
  material: string;
  price: number | string;
  mrp?: number | string;
  sizes: string;
  colours: string;
  stock_per_variant?: number | string;
  image_urls?: string;
  is_published?: string | boolean;
  is_featured?: string | boolean;
}

export interface CsvValidationError {
  row: number;
  sku?: string;
  column: string;
  message: string;
}

export interface CsvImportResult {
  success: boolean;
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  errors: CsvValidationError[];
}
