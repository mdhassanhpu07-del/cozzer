<<<<<<< HEAD
# COZZER — Luxury Footwear Catalogue & Brand Showcase

> **Official Website:** [cozzer.in](https://cozzer.in)  
> **Aesthetic Direction:** Haute Indian Shoemaking • Modern Minimalist Luxury • Architectural Precision  
> **Brand Palette:** Obsidian Black (`#171717`), Warm Ivory (`#F5F1E8`), Muted Bronze (`#9B7B50`)

---

## 1. Core Business Architecture

**COZZER is an exclusive product catalogue and brand showcase website, NOT an e-commerce checkout platform.**

Patrons and wholesale partners can browse master shoe silhouettes, inspect materials, examine size-wise stock availability, and initiate personal consultations directly with our client concierge via **WhatsApp** or **Telephone**.

### Strict Architectural Safeguards
- ❌ **No Shopping Cart**
- ❌ **No Electronic Checkout or Payment Gateways** (no Razorpay, Stripe, or PayPal)
- ❌ **No Automated Online Order Creation**
- ❌ **No Customer Order History Accounts**
- ✅ **Prefilled WhatsApp Enquiry Routing** (captures Product Name, SKU, selected Size, selected Colour, and Price)
- ✅ **Click-to-Call Telephony** for instant voice consultation with footwear specialists
- ✅ **B2B Wholesale / Institutional Desk** for multi-brand boutiques and regional stockists

---

## 2. Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) 14.2 (App Router with TypeScript)
- **Styling & Design System:** Tailwind CSS with custom brand tokens:
  - Obsidian Black: `#171717`
  - Warm Ivory: `#F5F1E8`
  - Muted Bronze: `#9B7B50`
  - Warm Sand / Cream accents
- **Typography:** Cinzel (Display), Cormorant Garamond (Editorial Serif), Plus Jakarta Sans (Modern Clean UI)
- **Database:** Supabase PostgreSQL with strict Row Level Security (RLS)
- **Authentication:** Supabase Auth for Admin management + Zero-friction preview authentication
- **Storage:** Supabase Storage bucket (`product-images`) for high-resolution imagery
- **Parsing & Tools:** PapaParse (CSV batch validation), Lucide React (Icons), clsx & tailwind-merge

---

## 3. Sitemap & Page Directory

### Public Pages
1. **Homepage (`/`)**
   - Editorial hero section with master catalogue preview
   - The House of COZZER brand introduction & craftsmanship pillars
   - 6 Curated Category cards with direct links
   - New arrivals & featured silhouettes grid
   - The Heritage Loafer campaign editorial
   - B2B retailer & wholesale alliance banner
   - Concierge contact card and policy disclaimer

2. **Master Catalogue (`/catalogue`)**
   - The 6 Official Footwear Categories:
     - **Casual Shoes** (Minimalist sneakers & court styles)
     - **Formal Shoes** (Wholecut Oxfords, Derbies, Monkstraps)
     - **Loafers** (Woven horsebit, suede driving loafers)
     - **Boots** (Oiled Chelsea boots, Scotch grain wingtip boots)
     - **Kids' Shoes** (Structured ergonomic junior footwear)
     - **Ethnic Footwear** (Zardozi embroidered juttis & hand-tanned mojaris)
   - Real-time search by product title and SKU
   - Multi-category filtering
   - Price range filter presets (Under ₹3,000 to Above ₹7,000)
   - Live availability filter (In-stock variants only)
   - Sorting: Newest Arrivals, Price Low-High, Price High-Low, Name A-Z
   - Responsive grid with loading skeletons and empty states

3. **Product Detail Page (`/product/[slug]`)**
   - Breadcrumb navigation
   - High-resolution gallery with thumbnail switcher and fullscreen lightbox
   - Product name, SKU badge, catalogue pricing & optional MRP with calculated discount
   - Colour options with visual color circles
   - Size selector with live stock indicators (`In Stock`, `Low Stock`, `Out of Stock`)
   - **Primary Action: "Enquire on WhatsApp"** — pre-populates chat with:
     ```text
     *COZZER Footwear Enquiry*
     --------------------------
     *Product:* COZZER Monolith Minimalist Sneaker
     *SKU:* COZ-CAS-001
     *Selected Size:* UK 9
     *Selected Colour:* Obsidian Black
     *Price:* ₹4,499
     --------------------------
     Hello COZZER Team, I am interested in this product from your catalogue...
     ```
   - **Secondary Action: "Call Specialist"**
   - Specifications accordion: Material details, UK/India size chart table, and express dispatch logistics
   - Related silhouettes from the same collection
   - `schema.org/Product` JSON-LD structured data for search engine indexing

4. **Wholesale & B2B Distribution (`/wholesale`)**
   - Minimum Order Quantities (MOQ: 12 pairs per run)
   - Tiered gross margin structures (35% to 52%)
   - Insured B2B logistics across 19,000+ Indian pin codes
   - Dedicated B2B WhatsApp Enquiry Composer

5. **About The House of COZZER (`/about`)**
   - Brand genesis, philosophy of architectural design, and vegetable-tanned leathers

6. **Contact & Experience Studio (`/contact`)**
   - Direct phone, WhatsApp, email, studio address, and operating hours
   - Interactive consultation message composer with direct WhatsApp transmission

7. **Legal & Compliance Policies**
   - `/policies/disclaimer`: Catalogue sales model disclaimer
   - `/policies/privacy`: Privacy policy (strictly no payment data collected)
   - `/policies/terms`: Terms of use & trademark notice

---

### Admin Workspace (`/admin`)

- **Secure Login (`/admin/login`)**:
  - Supabase Auth integration
  - Preview demo quick-fill helper (`admin@cozzer.in` / `cozzer_luxury_admin`)
- **Dashboard Overview (`/admin`)**:
  - Live counts of Total Products, Published items, Drafts, Categories, Out of Stock variants, and Featured products
  - Quick draft/published toggle on recent items
- **Product Management (`/admin/products`)**:
  - Search by Name/SKU, category filtering, and status filtering
  - Live stock indicators per product
  - Destructive delete with confirmation modal (`DeleteConfirmModal`)
- **Product Editor (`/admin/products/new` & `/admin/products/[id]/edit`)**:
  - Name, slug, unique SKU, category, price, MRP, material, description
  - Published/Draft toggle & Featured flag
  - Multi-image manager with primary image designation and deletion
  - Size & colour variant matrix with accurate stock quantities
  - "Generate Standard Run (UK 6 – 11)" 1-click helper
- **Category Manager (`/admin/categories`)**:
  - Display order, image banners, and product filtering
- **CSV Bulk Importer (`/admin/import`)**:
  - Drag-and-drop CSV upload powered by PapaParse
  - Downloadable official CSV template (`/templates/cozzer_product_import_template.csv`)
  - Pre-flight validation preview table (SKU uniqueness, valid numbers, required fields)
  - Detailed error reporting table with Row numbers, Column names, and Error reasons
- **Store Settings (`/admin/settings`)**:
  - Live database connection status indicator
  - Contact endpoint review
  - Production go-live checklist for brand owner

---

## 4. Database Setup & Supabase Migrations

All SQL migrations and seed data are stored in `/supabase`:

### Step 1: Run Initial Schema Migration
In the **Supabase Dashboard -> SQL Editor**, execute:
`supabase/migrations/01_initial_schema.sql`

This creates:
- `categories` table with display orders
- `products` table with unique SKU, price, MRP, and status
- `product_variants` table with unique `(product_id, size, colour)` and stock quantities
- `product_images` table with primary flags and display orders
- `admin_users` table
- Automatic `updated_at` triggers
- **Row Level Security (RLS)** policies:
  - Public can SELECT only `is_published = true` items
  - Authenticated admin users have full SELECT, INSERT, UPDATE, DELETE permissions
- Supabase Storage bucket `product-images` with public read access and authenticated admin upload permissions

### Step 2: Seed Initial Luxury Footwear Data
In the **SQL Editor**, execute:
`supabase/seed.sql`

This populates all 6 categories, 12 master shoe silhouettes, variants across UK 7 to UK 11, and high-resolution Unsplash footwear photography.

---

## 5. Environment Variables & Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the configuration keys:

```env
# Public Site URL
NEXT_PUBLIC_SITE_URL=https://cozzer.in

# Supabase Credentials (from Supabase Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Configurable Business Contact Information (Displayed across site & WhatsApp)
NEXT_PUBLIC_COMPANY_NAME="COZZER"
NEXT_PUBLIC_COMPANY_TAGLINE="Architect of Contemporary Luxury Footwear"
NEXT_PUBLIC_WHATSAPP_NUMBER="919997373342"
NEXT_PUBLIC_SUPPORT_PHONE="9997373342"
NEXT_PUBLIC_SUPPORT_EMAIL="concierge@cozzer.in"
NEXT_PUBLIC_WHOLESALE_EMAIL="wholesale@cozzer.in"
NEXT_PUBLIC_SHOWROOM_ADDRESS="PQGP+56Q, Sakar Kui masjid, Nabi Karim, Hapur, Uttar Pradesh 245101"
NEXT_PUBLIC_BUSINESS_HOURS="Monday – Saturday: 10:00 AM – 8:00 PM IST"
```

*Note: If Supabase keys are not provided, the application runs seamlessly in zero-latency preview mode with built-in demo inventory and browser local storage updates.*

---

## 6. Development & Production Build Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# -> Opens http://localhost:3000

# Run acceptance test suite
npm run test:acceptance
# (or npx tsx scripts/test-acceptance.ts)

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 7. Connecting Custom Domain (`cozzer.in`)

To connect the existing custom domain via Vercel or your hosting provider:

1. **Vercel Project Settings -> Domains**
   - Add `cozzer.in` and `www.cozzer.in`
2. **DNS Configuration (at your domain registrar: GoDaddy, Namecheap, Cloudflare, etc.)**:
   - **Type A:** `@` -> `76.76.21.21` (or your host's IP)
   - **Type CNAME:** `www` -> `cname.vercel-dns.com`
3. **SSL Certificate**:
   - Vercel automatically provisions and renews a free Let's Encrypt SSL certificate once DNS propagates.
4. **Environment Variables on Production**:
   - In Vercel Project Settings -> Environment Variables, copy the values from `.env.local`.

---

## 8. Acceptance Test Results

An automated acceptance test suite (`scripts/test-acceptance.ts`) was executed against the codebase:

```text
====================================================
 COZZER FOOTWEAR - ACCEPTANCE TEST SUITE
====================================================
✓ Non-Transactional Compliance: 8/8 PASSED (No checkout, no cart, no payment gateways)
✓ WhatsApp & Enquiry Logic: 8/8 PASSED (wa.me formatting, SKU, size, colour, wholesale encoding)
✓ Pricing & Discount Calculations: 4/4 PASSED
✓ Catalogue Hierarchy & Stock Integrity: 9/9 PASSED (6 categories, >=12 models, accurate stock)
✓ CSV Template & Header Structure: 14/14 PASSED
✓ Database Schema & RLS Security: 5/5 PASSED (RLS on products & variants, admin policies)
✓ Environment Documentation: 5/5 PASSED (.env.example verified)
====================================================
 RESULTS: 53 PASSED, 0 FAILED
====================================================
```

---

## 9. Pre-Launch Checklist for the Brand Owner

Before public launch:
- [ ] Connect custom domain `cozzer.in` in your host DNS.
- [ ] Verify business contact details (Phone: 9997373342, Address: PQGP+56Q, Sakar Kui masjid, Nabi Karim, Hapur, Uttar Pradesh 245101).
- [ ] Run `supabase/migrations/01_initial_schema.sql` in your Supabase project.
- [ ] Create initial administrator user in Supabase Auth -> Users.
- [ ] Upload final commercial product photos and import your catalogue via `/admin/import`.
=======
# cozzer
>>>>>>> origin/main
