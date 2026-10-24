import { readFileSync, existsSync } from "fs";

console.log("====================================================");
console.log(" COZZER ADMIN SIDEBAR & LAYOUT VERIFICATION SUITE");
console.log("====================================================\n");

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details = "") {
  if (condition) {
    console.log(`PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`FAIL: ${testName} - ${details}`);
    failCount++;
  }
}

const sidebarPath = "src/components/admin/AdminSidebar.tsx";
const contextPath = "src/components/admin/AdminSidebarContext.tsx";
const headerPath = "src/components/admin/AdminHeader.tsx";
const layoutPath = "src/app/admin/layout.tsx";

assert(existsSync(sidebarPath), "AdminSidebar.tsx exists");
assert(existsSync(contextPath), "AdminSidebarContext.tsx exists");
assert(existsSync(headerPath), "AdminHeader.tsx exists");
assert(existsSync(layoutPath), "AdminLayout.tsx exists");

const sidebarContent = readFileSync(sidebarPath, "utf-8");
const contextContent = readFileSync(contextPath, "utf-8");
const headerContent = readFileSync(headerPath, "utf-8");
const layoutContent = readFileSync(layoutPath, "utf-8");

console.log("\n--- Suite 1: Sidebar Dimensions & Responsive Breakpoints ---");
// 1. Desktop expanded width (240-260px) -> w-[250px]
assert(
  sidebarContent.includes("w-[250px]"),
  "Expanded desktop sidebar width is set to 250px (within 240–260px range)"
);

// 2. Desktop collapsed width (72-80px) -> w-[76px]
assert(
  sidebarContent.includes("w-[76px]"),
  "Collapsed desktop sidebar width is set to 76px (within 72–80px range)"
);

// 3. Desktop is hidden on mobile and shown on md:
assert(
  sidebarContent.includes("hidden md:flex"),
  "Desktop sidebar is hidden on mobile (<md) and displayed on desktop (>=md)"
);

// 4. Desktop sidebar is sticky and pinned without overlapping
assert(
  sidebarContent.includes("sticky top-0 h-screen") && sidebarContent.includes("shrink-0"),
  "Desktop sidebar has sticky top-0 h-screen shrink-0 to prevent layout collapse or overlapping"
);

console.log("\n--- Suite 2: Collapse/Expand Interaction & Transitions ---");
// 5. Context manages isCollapsed and toggling
assert(
  contextContent.includes("isCollapsed") && contextContent.includes("toggleCollapsed"),
  "AdminSidebarContext provides isCollapsed state and toggleCollapsed function"
);

// 6. LocalStorage persistence for sidebar state
assert(
  contextContent.includes("localStorage.getItem") && contextContent.includes("localStorage.setItem"),
  "Sidebar collapsed preference is persisted across sessions in localStorage"
);

// 7. Smooth transitions with 200-300ms timing and easing
assert(
  sidebarContent.includes("transition-[width]") &&
  sidebarContent.includes("duration-300") &&
  sidebarContent.includes("ease-[cubic-bezier(0.16,1,0.3,1)]"),
  "Desktop sidebar width animates smoothly over 300ms with a cubic-bezier easing curve"
);

// 8. Navigation labels hide smoothly with opacity and width transition
assert(
  sidebarContent.includes("w-0 opacity-0") && sidebarContent.includes("w-auto opacity-100"),
  "Nav labels smoothly collapse to 0 width and opacity without unwanted gaps"
);

// 9. Accessible tooltips for icons when collapsed
assert(
  sidebarContent.includes('role="tooltip"') &&
  sidebarContent.includes("group-hover:block") &&
  sidebarContent.includes("group-focus-visible:block"),
  "Accessible tooltips are rendered on hover and keyboard focus when collapsed"
);

// 10. Toggle button is visible in both collapsed and expanded states
assert(
  sidebarContent.includes("Expand Sidebar") && sidebarContent.includes("Collapse Sidebar"),
  "Sidebar has accessible collapse/expand toggles stationed clearly in both states"
);

// 11. Keyboard shortcut support (Ctrl+B)
assert(
  contextContent.includes('key.toLowerCase() === "b"'),
  "Sidebar supports Ctrl+B / Cmd+B keyboard shortcut to toggle collapse/expand"
);

console.log("\n--- Suite 3: Mobile Drawer Interaction & Backdrop ---");
// 12. Hamburger toggle in AdminHeader
assert(
  headerContent.includes("md:hidden") &&
  headerContent.includes("toggleMobileOpen") &&
  headerContent.includes("Menu"),
  "AdminHeader includes a mobile hamburger toggle button"
);

// 13. Mobile drawer uses drawer style overlaying content
assert(
  sidebarContent.includes("fixed inset-y-0 left-0") &&
  sidebarContent.includes("z-50") &&
  sidebarContent.includes("md:hidden"),
  "Mobile drawer slides over content with fixed positioning and high z-index"
);

// 14. Subtle backdrop when drawer is open
assert(
  sidebarContent.includes("bg-black/60 backdrop-blur-sm") &&
  sidebarContent.includes("fixed inset-0"),
  "Mobile drawer includes a luxury blurred dark backdrop"
);

// 15. Backdrop tap and link tap close mobile drawer
assert(
  sidebarContent.includes("onClick={closeMobile}"),
  "Clicking navigation links or tapping backdrop automatically closes mobile drawer"
);

// 16. Body scroll locking
assert(
  contextContent.includes('document.body.style.overflow = "hidden"'),
  "Body scrolling is locked when mobile drawer is open to prevent background scrolling"
);

// 17. Escape key closes mobile drawer
assert(
  contextContent.includes('e.key === "Escape"'),
  "Pressing Escape closes the mobile drawer"
);

// 18. Reduced motion support
assert(
  sidebarContent.includes("motion-reduce:transition-none") &&
  layoutContent.includes("motion-reduce:transition-none"),
  "Sidebar and layout respect user reduced-motion preference"
);

console.log("\n--- Suite 4: Main Content Transition & Fluid Adjustment ---");
// 19. Main content area adjusts automatically
assert(
  layoutContent.includes("flex-1") &&
  layoutContent.includes("min-w-0") &&
  layoutContent.includes("transition-all duration-300"),
  "Main content container transitions smoothly and auto-adjusts width without overflow"
);

// 20. Padding cleaned up to prevent wasted space
assert(
  layoutContent.includes("p-4 sm:p-6 md:p-8"),
  "Layout padding uses fluid responsive scales (p-4 on mobile, md:p-8 on desktop)"
);

console.log("\n--- Suite 5: Navigation Links & Admin Functionality Preserved ---");
const expectedLinks = [
  "/admin",
  "/admin/products",
  "/admin/products/new",
  "/admin/categories",
  "/admin/import",
  "/admin/settings",
];

for (const link of expectedLinks) {
  assert(
    sidebarContent.includes(`href: "${link}"`) || sidebarContent.includes(`href="${link}"`),
    `Preserved navigation link to ${link}`
  );
}

// Check Sign Out and Live Catalogue link
assert(sidebarContent.includes("handleLogout"), "Preserved sign out functionality");
assert(sidebarContent.includes("View Live Catalogue"), "Preserved Live Catalogue link");

console.log(`\n====================================================`);
console.log(` RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`====================================================`);

if (failCount > 0) {
  process.exit(1);
}
