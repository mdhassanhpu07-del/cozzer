import { readFileSync, existsSync } from 'fs';
import { generateWhatsAppEnquiryUrl, generateWholesaleWhatsAppUrl, formatCurrency, calculateDiscount } from '../src/lib/utils';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../src/lib/data/demo-data';
import { siteConfig } from '../src/config/site';

console.log('====================================================');
console.log(' COZZER FOOTWEAR - ACCEPTANCE TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details = '') {
  if (condition) {
    console.log(`PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`FAIL: ${testName} - ${details}`);
    failCount++;
  }
}

// 1. Check for Strict Non-Transactional Model (No cart, no checkout, no payment gateway)
console.log('--- Test Suite 1: Non-Transactional Compliance ---');

function scanForbiddenTerms(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  const forbiddenPatterns = [
    /stripe/i,
    /razorpay/i,
    /paypal/i,
    /addToCart/i,
    /shoppingCart/i,
    /checkoutSession/i,
    /createOrder/i,
    /paymentGateway/i,
    /placeOrder/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      const lines = content.split('\n');
      for (const line of lines) {
        if (pattern.test(line) && !line.includes('Strictly do not') && !line.includes('no automated') && !line.includes('does not') && !line.includes('without') && !line.includes('No payment') && !line.includes('No automated')) {
          return { found: true, pattern: pattern.toString(), line };
        }
      }
    }
  }
  return { found: false };
}

const checkFiles = [
  './src/components/layout/Header.tsx',
  './src/components/layout/Footer.tsx',
  './src/components/catalogue/ProductCard.tsx',
  './src/components/product/EnquiryButtons.tsx',
  './src/components/product/VariantSelector.tsx',
  './src/app/page.tsx',
  './src/app/catalogue/CatalogueClient.tsx',
  './src/app/product/[slug]/ProductDetailClient.tsx',
];

for (const f of checkFiles) {
  const res = scanForbiddenTerms(f);
  assert(!res.found, `No transactional checkout code in ${f}`, res.found ? `Found ${res.pattern} at "${res.line}"` : '');
}

// 2. Test WhatsApp Link Generation Logic
console.log('\n--- Test Suite 2: WhatsApp & Enquiry Logic ---');

const testEnquiry = generateWhatsAppEnquiryUrl({
  productName: 'COZZER Monolith Sneaker',
  sku: 'COZ-CAS-001',
  selectedSize: 'UK 9',
  selectedColour: 'Obsidian Black',
  price: 4499,
});

assert(testEnquiry.startsWith('https://wa.me/'), 'WhatsApp URL uses standard wa.me format');
assert(testEnquiry.includes(encodeURIComponent('COZZER Monolith Sneaker')), 'WhatsApp URL encodes product name');
assert(testEnquiry.includes(encodeURIComponent('COZ-CAS-001')), 'WhatsApp URL encodes SKU');
assert(testEnquiry.includes(encodeURIComponent('UK 9')), 'WhatsApp URL encodes selected size');
assert(testEnquiry.includes(encodeURIComponent('Obsidian Black')), 'WhatsApp URL encodes selected colour');

const testWholesale = generateWholesaleWhatsAppUrl({
  businessName: 'Apex Footwear Store',
  contactPerson: 'Sunil Rao',
  city: 'Mumbai',
  categoryOfInterest: 'Formal Shoes',
  estimatedPairs: 50,
});

assert(testWholesale.includes(encodeURIComponent('Apex Footwear Store')), 'Wholesale WhatsApp encodes business name');
assert(testWholesale.includes(encodeURIComponent('Sunil Rao')), 'Wholesale WhatsApp encodes contact person');
assert(testWholesale.includes(encodeURIComponent('50 pairs')), 'Wholesale WhatsApp encodes estimated pairs');

// 3. Test Pricing & Discount Calculation
console.log('\n--- Test Suite 3: Pricing & Currency Formatting ---');
assert(formatCurrency(4499).includes('4,499'), 'Formats 4499 as Indian Rupees with commas');
assert(calculateDiscount(4499, 5999) === 25, 'Calculates 25% discount between 4499 and 5999 MRP');
assert(calculateDiscount(4499, 4499) === null, 'Returns null discount when price equals MRP');
assert(calculateDiscount(4499, undefined) === null, 'Returns null discount when MRP is missing');

// 4. Test Demo Dataset & Category Classifications
console.log('\n--- Test Suite 4: Catalogue Hierarchy & Inventory Integrity ---');

const requiredCategories = [
  'casual-shoes',
  'formal-shoes',
  'loafers',
  'boots',
  'kids-shoes',
  'ethnic-footwear',
];

const foundCategories = DEMO_CATEGORIES.map((c) => c.slug);
for (const reqCat of requiredCategories) {
  assert(foundCategories.includes(reqCat), `Required category '${reqCat}' is present in catalogue categories`);
}

assert(DEMO_PRODUCTS.length >= 12, `Demo catalogue contains ${DEMO_PRODUCTS.length} distinct shoe models (>= 12)`);

let allVariantsValid = true;
let hasAccurateStock = true;
for (const p of DEMO_PRODUCTS) {
  if (!p.sku || !p.name || !p.price || !p.variants || p.variants.length === 0) {
    allVariantsValid = false;
  }
  // Verify size-wise stock exists
  if (p.variants) {
    for (const v of p.variants) {
      if (typeof v.stock_quantity !== 'number' || typeof v.is_available !== 'boolean') {
        hasAccurateStock = false;
      }
    }
  }
}
assert(allVariantsValid, 'Every product contains valid name, SKU, price, and non-empty variants');
assert(hasAccurateStock, 'Every variant contains explicit size-wise stock quantity and availability boolean');

// 5. Test CSV Template Existence & Integrity
console.log('\n--- Test Suite 5: CSV Template & Import Validation ---');
const templatePath = './public/templates/cozzer_product_import_template.csv';
assert(existsSync(templatePath), 'CSV template file exists at public/templates/cozzer_product_import_template.csv');

const templateContent = readFileSync(templatePath, 'utf-8');
const expectedHeaders = ['sku', 'name', 'category', 'description', 'material', 'price', 'mrp', 'sizes', 'colours', 'stock_per_variant', 'image_urls', 'is_published', 'is_featured'];
const firstLine = templateContent.split('\n')[0].trim();
for (const h of expectedHeaders) {
  assert(firstLine.includes(h), `CSV template header contains required column '${h}'`);
}

// 6. Test Database Schema & RLS Policies Script
console.log('\n--- Test Suite 6: Database & RLS Security Script ---');
const schemaPath = './supabase/migrations/01_initial_schema.sql';
assert(existsSync(schemaPath), 'Supabase schema file exists at supabase/migrations/01_initial_schema.sql');
const schemaContent = readFileSync(schemaPath, 'utf-8');
assert(schemaContent.includes('ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on products table');
assert(schemaContent.includes('ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on product_variants table');
assert(schemaContent.includes('CREATE POLICY "Public can view published products"'), 'Public read policy restricted to published products');
assert(schemaContent.includes('CREATE POLICY "Admins have full access to products"'), 'Admin full write policy defined');

// 7. Test Environment Configuration Template
console.log('\n--- Test Suite 7: Environment Documentation ---');
assert(existsSync('./.env.example'), '.env.example file exists');
const envExample = readFileSync('./.env.example', 'utf-8');
assert(envExample.includes('NEXT_PUBLIC_SUPABASE_URL'), '.env.example documents NEXT_PUBLIC_SUPABASE_URL');
assert(envExample.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), '.env.example documents NEXT_PUBLIC_SUPABASE_ANON_KEY');
assert(envExample.includes('SUPABASE_SERVICE_ROLE_KEY'), '.env.example documents SUPABASE_SERVICE_ROLE_KEY');
assert(envExample.includes('NEXT_PUBLIC_WHATSAPP_NUMBER'), '.env.example documents NEXT_PUBLIC_WHATSAPP_NUMBER');

// 8. Test Official Contact Details & Location Experience
console.log('\n--- Test Suite 8: Official Contact Details & Location Experience ---');
assert(siteConfig.contact.phone === '9997373342', `Official phone is 9997373342 (got: ${siteConfig.contact.phone})`);
assert(siteConfig.contact.phoneHref === 'tel:+919997373342', `Phone link is tel:+919997373342 (got: ${siteConfig.contact.phoneHref})`);
assert(siteConfig.contact.whatsappUrl === 'https://wa.me/919997373342', `WhatsApp link is https://wa.me/919997373342 (got: ${siteConfig.contact.whatsappUrl})`);
assert(siteConfig.contact.address === 'PQGP+56Q, Sakar Kui masjid, Nabi Karim, Hapur, Uttar Pradesh 245101', `Official address matches exactly (got: ${siteConfig.contact.address})`);
assert(siteConfig.contact.mapsUrl.includes('google.com/maps/search/'), 'Google Maps search directions link is properly formed');

const footerContent = readFileSync('./src/components/layout/Footer.tsx', 'utf-8');
assert(footerContent.includes('siteConfig.contact.phoneHref'), 'Footer links directly to phoneHref');
assert(footerContent.includes('siteConfig.contact.mapsUrl'), 'Footer includes Get Directions map link');

const contactPageContent = readFileSync('./src/app/contact/ContactClient.tsx', 'utf-8');
assert(contactPageContent.includes('siteConfig.contact.phoneHref'), 'Contact page links directly to phoneHref');
assert(contactPageContent.includes('siteConfig.contact.mapsUrl'), 'Contact page includes Get Directions link');

// 9. Test Mobile Hamburger Navigation & Animation Standards
console.log('\n--- Test Suite 9: Mobile Navigation & Animation Standards ---');
const headerContent = readFileSync('./src/components/layout/Header.tsx', 'utf-8');
assert(headerContent.includes('aria-expanded={mobileMenuOpen}'), 'Hamburger menu has dynamic aria-expanded attribute');
assert(headerContent.includes('aria-controls="mobile-navigation-drawer"'), 'Hamburger menu controls mobile-navigation-drawer ID');
assert(headerContent.includes('overflow = "hidden"'), 'Body scrolling is locked when mobile menu is open');
assert(headerContent.includes('Escape'), 'Mobile menu responds to keyboard Escape key');
assert(headerContent.includes('siteConfig.contact.phoneHref'), 'Mobile drawer includes direct phone link');
assert(headerContent.includes('siteConfig.contact.whatsappUrl'), 'Mobile drawer includes direct WhatsApp link');
assert(headerContent.includes('createPortal('), 'Mobile drawer is portaled to document.body to avoid stacking/clipping');
assert(headerContent.includes('min-h-0 overflow-y-auto'), 'Drawer body has min-h-0 overflow-y-auto for independent scrolling');
assert(headerContent.includes('100dvh'), 'Drawer uses 100dvh for dynamic mobile viewport height');
assert(headerContent.includes('href="/"') && headerContent.includes('<span>Home</span>'), 'Drawer includes explicit Home navigation link');
assert(headerContent.includes('href="/wholesale"'), 'Drawer includes Wholesale link');
assert(headerContent.includes('href="/about"'), 'Drawer includes About link');
assert(headerContent.includes('href="/about#craftsmanship"'), 'Drawer includes Craftsmanship link');
assert(headerContent.includes('href="/contact"'), 'Drawer includes Contact link');
assert(headerContent.includes('href="/admin"'), 'Drawer includes Admin link');
assert(headerContent.includes('touchAction = "none"'), 'Body scroll lock disables touchAction to prevent iOS rubber-banding');

const cssContent = readFileSync('./src/app/globals.css', 'utf-8');
assert(cssContent.includes('prefers-reduced-motion'), 'CSS respects prefers-reduced-motion');
assert(cssContent.includes('keyframes fadeInUp'), 'CSS defines fadeInUp keyframe animation');
assert(cssContent.includes('keyframes slideDrawerIn'), 'CSS defines slideDrawerIn mobile drawer animation');

// 10. Check Premium Luxury Typography Standards
console.log('\n--- Test Suite 10: Luxury Typography Upgrade Standards ---');
const layoutContent = readFileSync('./src/app/layout.tsx', 'utf-8');
assert(
  layoutContent.includes('family=Plus+Jakarta+Sans:wght@400;500;600;700;800'),
  'Plus Jakarta Sans loaded with all weights 400, 500, 600, 700, 800 without synthetic bold'
);

const tailwindConfig = readFileSync('./tailwind.config.ts', 'utf-8');
assert(
  tailwindConfig.includes("'Plus Jakarta Sans'"),
  'Tailwind sans font configured to Plus Jakarta Sans'
);

assert(
  headerContent.includes('font-sans font-extrabold text-2xl md:text-3xl tracking-[0.2em]') && headerContent.includes('uppercase'),
  'Brand wordmark: 800 weight, uppercase, refined 0.2em letter spacing'
);

const homeContent = readFileSync('./src/app/page.tsx', 'utf-8');
assert(
  homeContent.includes('font-sans text-[clamp(2.35rem,5.5vw+0.5rem,4.5rem)] font-extrabold tracking-[-0.035em] text-white uppercase leading-[1.06]'),
  'Main hero heading: 800 weight, 48–72px desktop clamp, responsive mobile sizing, -0.035em tight tracking'
);
assert(
  homeContent.includes('font-sans text-[clamp(1.75rem,3.2vw+0.5rem,2.5rem)] text-[#171717] font-bold leading-[1.15] tracking-[-0.025em]'),
  'Section headings: 700–800 weight, clamp responsive sizing, tight letter spacing'
);

const productCardContent = readFileSync('./src/components/catalogue/ProductCard.tsx', 'utf-8');
assert(
  productCardContent.includes('font-sans font-bold text-base sm:text-lg text-[#171717]') && productCardContent.includes('tracking-[-0.015em]'),
  'Product names: 600–700 weight with crisp controlled letter spacing'
);
assert(
  productCardContent.includes('font-sans font-bold text-base sm:text-lg text-[#171717] tracking-[-0.02em]'),
  'Product prices: 700 weight for emphasis'
);

assert(
  headerContent.includes('nav className="hidden md:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-[#171717]"'),
  'Navigation links: 600 weight'
);

assert(
  homeContent.includes('bg-[#9B7B50] hover:bg-[#82653E] text-white px-8 py-4 text-xs uppercase tracking-widest font-bold shadow-lg transition-all duration-300'),
  'Primary CTA buttons: 700 weight'
);

assert(
  homeContent.includes('text-[#F5F1E8]/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed'),
  'Body text and descriptions: 400–500 weight for comfortable readability'
);

assert(
  homeContent.includes('text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold'),
  'Eyebrow labels: 600 weight, uppercase, subtle positive letter spacing'
);

console.log('\n====================================================');
console.log(` RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
