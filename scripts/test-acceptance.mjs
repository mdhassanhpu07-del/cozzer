// Acceptance & Verification Test Suite for COZZER Footwear
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('====================================================');
console.log(' COZZER FOOTWEAR - ACCEPTANCE TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
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
const srcDir = './src';

function scanForbiddenTerms(filePath) {
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
      // Check if it's explicitly a disclaimer stating we DON'T have this
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
import { generateWhatsAppEnquiryUrl, generateWholesaleWhatsAppUrl, formatCurrency, calculateDiscount } from '../src/lib/utils.js';

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
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../src/lib/data/demo-data.js';

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
  for (const v of p.variants) {
    if (typeof v.stock_quantity !== 'number' || typeof v.is_available !== 'boolean') {
      hasAccurateStock = false;
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

console.log('\n====================================================');
console.log(` RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
