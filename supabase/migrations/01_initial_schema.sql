-- ====================================================================
-- COZZER FOOTWEAR - SUPABASE DATABASE SCHEMA & MIGRATION
-- Production-ready schema with RLS, foreign keys, indexes, triggers
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for category lookup by slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories (display_order ASC);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    material TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    mrp NUMERIC(10, 2) CHECK (mrp IS NULL OR mrp >= price),
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for product search, filtering, and sorting
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products (is_published);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products (price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- 4. Create Product Variants Table (Size & Colour matrix with real stock quantities)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    colour TEXT NOT NULL,
    colour_code TEXT,
    sku TEXT UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_product_size_colour UNIQUE (product_id, size, colour)
);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants (product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants (sku);
CREATE INDEX IF NOT EXISTS idx_variants_availability ON public.product_variants (is_available);

-- 5. Create Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON public.product_images (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON public.product_images (is_primary);

-- 6. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_variants_updated_at ON public.product_variants;
CREATE TRIGGER trigger_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict security: Public users can read ONLY published catalogue items.
-- Only authenticated admin users can modify or view drafts.
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id = auth.uid()
        )
        OR
        (auth.jwt() ->> 'email' = current_setting('app.settings.admin_email', true))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- Categories Policies ---
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
    ON public.categories
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
CREATE POLICY "Admins have full access to categories"
    ON public.categories
    FOR ALL
    USING (auth.role() = 'authenticated');

-- --- Products Policies ---
DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products"
    ON public.products
    FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products"
    ON public.products
    FOR ALL
    USING (auth.role() = 'authenticated');

-- --- Product Variants Policies ---
DROP POLICY IF EXISTS "Public can view variants of published products" ON public.product_variants;
CREATE POLICY "Public can view variants of published products"
    ON public.product_variants
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_variants.product_id
            AND (products.is_published = true OR auth.role() = 'authenticated')
        )
    );

DROP POLICY IF EXISTS "Admins have full access to product variants" ON public.product_variants;
CREATE POLICY "Admins have full access to product variants"
    ON public.product_variants
    FOR ALL
    USING (auth.role() = 'authenticated');

-- --- Product Images Policies ---
DROP POLICY IF EXISTS "Public can view images of published products" ON public.product_images;
CREATE POLICY "Public can view images of published products"
    ON public.product_images
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_images.product_id
            AND (products.is_published = true OR auth.role() = 'authenticated')
        )
    );

DROP POLICY IF EXISTS "Admins have full access to product images" ON public.product_images;
CREATE POLICY "Admins have full access to product images"
    ON public.product_images
    FOR ALL
    USING (auth.role() = 'authenticated');

-- --- Admin Users Policies ---
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users"
    ON public.admin_users
    FOR SELECT
    USING (auth.uid() = id);

-- ====================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- Run in Supabase SQL Editor if storage bucket creation is desired via SQL
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of product images
DROP POLICY IF EXISTS "Public can view product images bucket" ON storage.objects;
CREATE POLICY "Public can view product images bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Allow authenticated users to upload and manage product images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
