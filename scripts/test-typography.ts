import { readFileSync } from 'fs';

console.log('====================================================');
console.log(' COZZER FOOTWEAR - TYPOGRAPHY VERIFICATION SUITE');
console.log('====================================================\n');

let pass = 0;
let fail = 0;

function check(cond: boolean, desc: string, details = '') {
  if (cond) {
    console.log(`PASS: ${desc}`);
    pass++;
  } else {
    console.error(`FAIL: ${desc} ${details ? `(${details})` : ''}`);
    fail++;
  }
}

// 1. Check layout.tsx for Plus Jakarta Sans font link with all required weights: 400, 500, 600, 700, 800
const layout = readFileSync('./src/app/layout.tsx', 'utf-8');
check(
  layout.includes('family=Plus+Jakarta+Sans:wght@400;500;600;700;800'),
  'Plus Jakarta Sans loaded with all weights 400, 500, 600, 700, 800 (prevents synthetic bolding)'
);

// 2. Check tailwind.config.ts for sans font family & letter spacing
const tailwind = readFileSync('./tailwind.config.ts', 'utf-8');
check(
  tailwind.includes("'Plus Jakarta Sans'"),
  'Tailwind sans font family set to Plus Jakarta Sans'
);
check(
  tailwind.includes("tightest: \"-0.04em\"") && tailwind.includes("eyebrow: \"0.2em\""),
  'Tailwind defines controlled negative tracking and positive eyebrow tracking'
);

// 3. Check globals.css for primary body typography and utility classes
const globals = readFileSync('./src/app/globals.css', 'utf-8');
check(
  globals.includes("font-family: 'Plus Jakarta Sans'") && globals.includes('brand-wordmark') && globals.includes('hero-heading'),
  'globals.css defines Plus Jakarta Sans body, brand-wordmark, and hero-heading classes'
);

// 4. Check Brand Wordmark in Header, Footer, AdminSidebar, and AdminLogin
const header = readFileSync('./src/components/layout/Header.tsx', 'utf-8');
check(
  header.includes('font-sans font-extrabold text-2xl md:text-3xl tracking-[0.2em]') && header.includes('uppercase'),
  'Header brand wordmark: 800 weight (font-extrabold), uppercase, 0.2em letter spacing'
);

const footer = readFileSync('./src/components/layout/Footer.tsx', 'utf-8');
check(
  footer.includes('font-sans font-extrabold text-3xl tracking-[0.2em] text-white uppercase'),
  'Footer brand wordmark: 800 weight, uppercase, 0.2em letter spacing'
);

const adminSidebar = readFileSync('./src/components/admin/AdminSidebar.tsx', 'utf-8');
check(
  adminSidebar.includes('font-sans font-extrabold text-lg tracking-[0.2em] text-white block leading-none uppercase'),
  'Admin sidebar wordmark: 800 weight, uppercase, 0.2em letter spacing'
);

const adminLogin = readFileSync('./src/app/admin/login/page.tsx', 'utf-8');
check(
  adminLogin.includes('font-sans font-extrabold text-3xl tracking-[0.2em] text-white uppercase'),
  'Admin login wordmark: 800 weight, uppercase, 0.2em letter spacing'
);

// 5. Main hero heading: 800 weight, approximately 48–72px on desktop and responsive sizing on mobile, tight letter spacing
const homePage = readFileSync('./src/app/page.tsx', 'utf-8');
check(
  homePage.includes('font-sans text-[clamp(2.35rem,5.5vw+0.5rem,4.5rem)] font-extrabold tracking-[-0.035em] text-white uppercase leading-[1.06]'),
  'Hero heading: 800 weight (font-extrabold), clamp responsive (up to 72px / 4.5rem desktop), tight tracking (-0.035em), uppercase'
);

// 6. Section headings: 700-800 weight, clamp responsive, tight tracking
check(
  homePage.includes('font-sans text-[clamp(1.75rem,3.2vw+0.5rem,2.5rem)] text-[#171717] font-bold leading-[1.15] tracking-[-0.025em]'),
  'Homepage Section 2 heading: 700 weight (font-bold), clamp, tight tracking (-0.025em)'
);
check(
  homePage.includes('font-sans text-[clamp(2rem,4vw+0.5rem,3.25rem)] uppercase font-extrabold text-white leading-[1.08] tracking-[-0.03em]'),
  'Homepage Section 5 banner heading: 800 weight (font-extrabold), clamp, tight tracking (-0.03em)'
);

// 7. Product names: 600-700 weight
const productCard = readFileSync('./src/components/catalogue/ProductCard.tsx', 'utf-8');
check(
  productCard.includes('font-sans font-bold text-base sm:text-lg text-[#171717] group-hover:text-[#9B7B50] transition-colors leading-snug line-clamp-1 mb-2 tracking-[-0.015em]'),
  'ProductCard product name: 700 weight (font-bold), tight tracking (-0.015em)'
);

const productDetail = readFileSync('./src/app/product/[slug]/ProductDetailClient.tsx', 'utf-8');
check(
  productDetail.includes('font-sans text-[clamp(1.85rem,3.2vw+0.5rem,2.5rem)] text-[#171717] font-bold leading-[1.15] tracking-[-0.025em]'),
  'ProductDetail product name: 700 weight (font-bold), clamp, tight tracking (-0.025em)'
);

// 8. Product prices: 700 weight for emphasis
check(
  productCard.includes('font-sans font-bold text-base sm:text-lg text-[#171717] tracking-[-0.02em]'),
  'ProductCard price: 700 weight (font-bold) for emphasis'
);
check(
  productDetail.includes('font-sans font-bold text-2xl md:text-3xl text-[#171717] tracking-[-0.02em]'),
  'ProductDetail price: 700 weight (font-bold) for emphasis'
);

// 9. Navigation links: 600 weight
check(
  header.includes('nav className="hidden md:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-[#171717]"'),
  'Desktop navigation links: 600 weight (font-semibold)'
);
check(
  header.includes('min-h-[44px] flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors rounded'),
  'Mobile drawer navigation links: 600 weight (font-semibold)'
);

// 10. Buttons and primary CTAs: 600-700 weight
check(
  homePage.includes('bg-[#9B7B50] hover:bg-[#82653E] text-white px-8 py-4 text-xs uppercase tracking-widest font-bold shadow-lg transition-all duration-300'),
  'Hero Primary CTA: 700 weight (font-bold)'
);
check(
  homePage.includes('px-7 py-4 text-xs uppercase tracking-widest font-semibold transition-all duration-300'),
  'Hero Secondary CTA: 600 weight (font-semibold)'
);
check(
  productCard.includes('font-semibold uppercase tracking-wider transition-all duration-200'),
  'ProductCard Enquire CTA: 600 weight (font-semibold)'
);

// 11. Body text: 400-500 weight for readability
check(
  homePage.includes('text-[#F5F1E8]/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed'),
  'Hero body text: 400 weight (font-normal) for comfortable readability'
);
check(
  homePage.includes('text-stone-600 text-sm md:text-[15px] leading-relaxed font-normal'),
  'Brand story body text: 400 weight (font-normal)'
);

// 12. Eyebrow labels: 600 weight, uppercase, subtle positive letter spacing
check(
  homePage.includes('text-xs tracking-[0.2em] uppercase font-semibold text-[#F5F1E8]'),
  'Hero badge eyebrow: 600 weight (font-semibold), uppercase, 0.2em positive tracking'
);
check(
  homePage.includes('text-xs uppercase tracking-[0.2em] text-[#9B7B50] font-semibold'),
  'Section eyebrow labels: 600 weight (font-semibold), uppercase, 0.2em positive tracking'
);

// 13. Check that no legacy serif classes remain in src
const checkLegacy = (filePath: string) => {
  const content = readFileSync(filePath, 'utf-8');
  return !content.includes('font-serif-luxury') && !content.includes('font-display');
};

check(checkLegacy('./src/app/page.tsx'), 'No legacy serif/display classes in page.tsx');
check(checkLegacy('./src/app/about/page.tsx'), 'No legacy serif/display classes in about/page.tsx');
check(checkLegacy('./src/app/wholesale/WholesaleClient.tsx'), 'No legacy serif/display classes in WholesaleClient.tsx');
check(checkLegacy('./src/app/contact/ContactClient.tsx'), 'No legacy serif/display classes in ContactClient.tsx');
check(checkLegacy('./src/app/catalogue/CatalogueClient.tsx'), 'No legacy serif/display classes in CatalogueClient.tsx');
check(checkLegacy('./src/app/product/[slug]/ProductDetailClient.tsx'), 'No legacy serif/display classes in ProductDetailClient.tsx');

console.log(`\n====================================================`);
console.log(` RESULTS: ${pass} PASSED, ${fail} FAILED`);
console.log(`====================================================`);
process.exit(fail === 0 ? 0 : 1);
