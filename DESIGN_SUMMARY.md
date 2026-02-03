# NEPKART Design & Accessibility Summary

## Brand Colors & Usage

### Primary Brand Color: Orange
- **Orange-600** (`#EA580C` / `bg-orange-600`): Primary brand color
  - Used in: Primary buttons, CTAs, cart button, category filter active state, links, feature icons
  - Components: Header cart button, ProductCard "Add to Cart", Checkout submit, Login button, Admin navigation active state
  
- **Orange-700** (`#C2410C` / `bg-orange-700`): Hover state
  - Used in: Button hover states, link hover states
  
- **Orange-100** (`#FFEDD5` / `bg-orange-100`): Light backgrounds
  - Used in: Feature section icons, low stock badges, admin status indicators
  
- **Orange-50** (`#FFF7ED` / `text-orange-50`): Very light text
  - Used in: Hero section subtitle text

### Secondary Brand Color: Red
- **Red-600** (`#DC2626` / `bg-red-600`): Destructive actions
  - Used in: Delete buttons, error messages, "Out of Stock" badges, cart badge
  
- **Red-500** (`#EF4444` / `bg-red-500`): Accent
  - Used in: Cart item count badge
  
- **Red-100** (`#FEE2E2` / `bg-red-100`): Error backgrounds
  - Used in: Error states, out of stock badges

### Supporting Colors
- **Gray-900** (`#111827`): Primary text
- **Gray-700** (`#374151`): Secondary text, labels
- **Gray-600** (`#4B5563`): Tertiary text
- **Gray-300** (`#D1D5DB`): Borders
- **Gray-200** (`#E5E7EB`): Light borders, card borders
- **Gray-100** (`#F3F4F6`): Backgrounds
- **White** (`#FFFFFF`): Cards, backgrounds

### Status Colors
- **Green-600** (`#10B981`): Success states, in-stock badges
- **Green-100** (`#D1FAE5`): Success backgrounds
- **Blue-600** (`#3B82F6`): Info states (order status: Received)
- **Blue-100** (`#DBEAFE`): Info backgrounds

---

## Component Standards

### Buttons
**Primary Button:**
- Background: `bg-orange-600`
- Hover: `bg-orange-700`
- Text: White, `font-bold` or `font-semibold`
- Padding: `px-6 py-3` or `px-4 py-2`
- Border Radius: `rounded-lg` (8px)
- Focus: `focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`
- Used in: CTAs, Add to Cart, Submit forms, Navigation

**Destructive Button:**
- Background: `bg-red-600`
- Hover: `bg-red-700`
- Used in: Delete actions, Remove from cart

**Secondary Button:**
- Background: White with border
- Border: `border border-gray-300`
- Hover: `hover:border-orange-600 hover:text-orange-600`
- Used in: Category filters (inactive state)

### Cards
- Background: White (`bg-white`)
- Border: `border border-gray-200`
- Border Radius: `rounded-lg` (8px)
- Padding: `p-4` or `p-6`
- Hover: `hover:shadow-lg`
- Used in: Product cards, Order cards, Form containers

### Form Inputs
- Border: `border border-gray-300`
- Border Radius: `rounded-lg` (8px)
- Padding: `px-4 py-2`
- Focus: `focus:ring-2 focus:ring-orange-500 focus:border-transparent`
- Font: `text-base` (16px), `font-normal` (400)
- Used in: All form fields (checkout, admin, login)

### Badges/Status Indicators
- Border Radius: `rounded-full` (pills)
- Padding: `px-3 py-1` or `px-2 py-1`
- Font: `text-sm` or `text-xs`, `font-semibold`
- Colors:
  - In Stock: `bg-green-100 text-green-700`
  - Low Stock: `bg-orange-100 text-orange-700`
  - Out of Stock: `bg-red-100 text-red-700`
  - Order Status: Blue (Received), Orange (In Progress), Green (Shipped)

### Spacing Standards
- Container: `container mx-auto px-4`
- Section Padding: `py-16` or `py-8`
- Card Padding: `p-4` or `p-6`
- Gap between elements: `gap-3`, `gap-4`, `gap-6`, `gap-8`

---

## Typography System

### Font Family
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Base font size: `16px` (`--font-size: 16px`)

### Heading Hierarchy
- **H1** (`text-3xl` / 30px): Page titles (Checkout, Cart, Admin)
  - Weight: `font-bold` (700)
  - Line height: 1.5
  
- **H2** (`text-2xl` / 24px): Section headings
  - Weight: `font-bold` (700)
  - Used in: "Our Products", "Shipping Information", "Order Summary"
  
- **H3** (`text-xl` / 20px): Subsection headings
  - Weight: `font-bold` (700)
  - Used in: Feature section titles, form section titles
  
- **H4** (`text-lg` / 18px): Card titles
  - Weight: `font-bold` (700)
  - Used in: Product card names

### Body Text
- **Large** (`text-xl` / 20px): Hero subtitle, important text
- **Base** (`text-base` / 16px): Default body text, form inputs
  - Weight: `font-normal` (400)
- **Small** (`text-sm` / 14px): Secondary text, labels, descriptions
  - Weight: `font-semibold` (600) for labels, `font-normal` (400) for text
- **Extra Small** (`text-xs` / 12px): Captions, metadata, category badges
  - Weight: `font-semibold` (600)

### Font Weights Used
- **Bold (700)**: Headings, prices, important text
- **Semibold (600)**: Labels, buttons, badges
- **Medium (500)**: Default for headings in theme
- **Normal (400)**: Body text, inputs

### Line Heights
- Default: 1.5 (normal)
- Used consistently across all text elements

---

## Accessibility Standards (WCAG 2.1 AA) Implemented

### 1. Semantic HTML
- ✅ `<header>` with `role="banner"`
- ✅ `<nav>` with `aria-label="Main navigation"`
- ✅ `<main>` with `id="main-content"` for skip links
- ✅ `<article>` for product cards
- ✅ `<section>` for content sections
- ✅ Proper heading hierarchy (h1 → h2 → h3)

### 2. ARIA Attributes
- ✅ `aria-label` on icon-only buttons (cart, delete, quantity controls)
- ✅ `aria-labelledby` for product cards
- ✅ `aria-describedby` for form inputs
- ✅ `aria-required="true"` on required form fields
- ✅ `aria-invalid` on form validation (in UI components)
- ✅ `aria-pressed` on category filter buttons
- ✅ `aria-disabled` on disabled buttons
- ✅ `aria-live` regions: `role="status"` (polite) and `role="alert"` (assertive)
- ✅ `aria-hidden="true"` on decorative icons

### 3. Keyboard Navigation
- ✅ All interactive elements keyboard accessible
- ✅ Focus indicators: `focus:ring-2 focus:ring-orange-500` (2px ring)
- ✅ Skip link to main content
- ✅ Logical tab order
- ✅ Enter/Space key support for buttons

### 4. Color Contrast
- ✅ Orange-600 on white: Meets WCAG AA (4.5:1+)
- ✅ Gray-900 on white: Meets WCAG AA
- ✅ Red-600 on white: Meets WCAG AA
- ✅ White text on orange-600: Meets WCAG AA

### 5. Images
- ✅ All images have descriptive `alt` text
- ✅ Decorative images use `aria-hidden="true"`
- ✅ Product images include product name and description in alt text

### 6. Forms
- ✅ Labels associated with inputs using `htmlFor` and `id`
- ✅ Required fields marked with `aria-label="required"`
- ✅ Error messages associated with inputs
- ✅ Form validation feedback

### 7. Status Messages
- ✅ Loading states: `role="status" aria-live="polite"`
- ✅ Error states: `role="alert" aria-live="assertive"`
- ✅ Success messages: `role="status"`

### 8. Screen Reader Support
- ✅ `.sr-only` class for screen reader only content
- ✅ Price announcements: `<span className="sr-only">Price: </span>`
- ✅ Contextual labels for buttons and links

---

## Do You Need DESIGN_SYSTEM.md and ACCESSIBILITY_GUIDE.md?

### Recommendation: **Keep Both**

**DESIGN_SYSTEM.md:**
- ✅ **Useful for**: Team reference, onboarding new developers, maintaining consistency
- ✅ **Contains**: Complete color palette, typography scale, component patterns, spacing system
- ✅ **Value**: Ensures all developers follow the same design standards

**ACCESSIBILITY_GUIDE.md:**
- ✅ **Useful for**: Implementation patterns, code examples, testing checklist
- ✅ **Contains**: Specific ARIA patterns, keyboard navigation, form accessibility examples
- ✅ **Value**: Helps maintain accessibility standards as codebase grows

### Alternative: Consolidate
If you prefer a single document, you could:
- Keep `DESIGN_SYSTEM.md` (more comprehensive)
- Remove `ACCESSIBILITY_GUIDE.md` (if team is familiar with accessibility)
- Or merge accessibility section into DESIGN_SYSTEM.md

**My recommendation**: Keep both for now - they serve different purposes and help ensure consistency and accessibility as your team grows.
