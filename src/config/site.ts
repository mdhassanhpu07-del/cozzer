export const siteConfig = {
  name: "COZZER",
  tagline: "Architect of Contemporary Luxury Footwear",
  description: "COZZER crafts modern minimalist luxury footwear for discerning gentlemen, retailers, and wholesalers across India. Explore our curated catalogue of handcrafted casuals, formal oxfords, loafers, and artisanal boots.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cozzer.in",
  
  // Configurable Contact Information
  contact: {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919997373342", // Without + for wa.me API
    whatsappUrl: "https://wa.me/919997373342",
    phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "9997373342",
    phoneHref: "tel:+919997373342",
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "concierge@cozzer.in",
    wholesaleEmail: process.env.NEXT_PUBLIC_WHOLESALE_EMAIL || "wholesale@cozzer.in",
    address: process.env.NEXT_PUBLIC_SHOWROOM_ADDRESS || "PQGP+56Q, Sakar Kui masjid, Nabi Karim, Hapur, Uttar Pradesh 245101",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=PQGP%2B56Q%2C+Sakar+Kui+masjid%2C+Nabi+Karim%2C+Hapur%2C+Uttar+Pradesh+245101",
    businessHours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || "Monday – Saturday: 10:00 AM – 8:00 PM IST",
  },

  // Catalogue Category List (Official 6 Categories)
  categories: [
    { name: "Casual Shoes", slug: "casual-shoes" },
    { name: "Formal Shoes", slug: "formal-shoes" },
    { name: "Loafers", slug: "loafers" },
    { name: "Boots", slug: "boots" },
    { name: "Kids' Shoes", slug: "kids-shoes" },
    { name: "Ethnic Footwear", slug: "ethnic-footwear" },
  ],

  // Main Navigation
  navItems: [
    { title: "Home", href: "/" },
    { title: "All Catalogue", href: "/catalogue" },
    { title: "Casual", href: "/catalogue?category=casual-shoes" },
    { title: "Formal", href: "/catalogue?category=formal-shoes" },
    { title: "Loafers", href: "/catalogue?category=loafers" },
    { title: "Boots", href: "/catalogue?category=boots" },
    { title: "Ethnic", href: "/catalogue?category=ethnic-footwear" },
    { title: "Wholesale", href: "/wholesale" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],

  // Footer Links
  footerNav: {
    catalogue: [
      { title: "All Footwear", href: "/catalogue" },
      { title: "Casual Sneakers", href: "/catalogue?category=casual-shoes" },
      { title: "Formal Oxfords & Derbies", href: "/catalogue?category=formal-shoes" },
      { title: "Handcrafted Loafers", href: "/catalogue?category=loafers" },
      { title: "Artisanal Boots", href: "/catalogue?category=boots" },
      { title: "Kids' Footwear", href: "/catalogue?category=kids-shoes" },
      { title: "Royal Ethnic Footwear", href: "/catalogue?category=ethnic-footwear" },
    ],
    business: [
      { title: "About The House of COZZER", href: "/about" },
      { title: "Wholesale & B2B Distribution", href: "/wholesale" },
      { title: "Experience Studio & Store", href: "/contact" },
      { title: "Material & Craftsmanship", href: "/about#craftsmanship" },
      { title: "Admin Portal", href: "/admin" },
    ],
    legal: [
      { title: "Catalogue & Sales Disclaimer", href: "/policies/disclaimer" },
      { title: "Privacy Policy", href: "/policies/privacy" },
      { title: "Terms of Service", href: "/policies/terms" },
    ],
  },
};
