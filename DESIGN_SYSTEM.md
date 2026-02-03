# NEPKART Design System & Accessibility Guide

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Accessibility Standards](#accessibility-standards)
7. [Responsive Design](#responsive-design)

---

## Design Principles

### 1. Consistency
- Use standardized components from the UI library
- Maintain consistent spacing, colors, and typography
- Follow established patterns across all pages

### 2. Clarity
- Clear visual hierarchy
- Readable typography
- Intuitive navigation

### 3. Accessibility First
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

### 4. Performance
- Optimized images
- Efficient rendering
- Fast load times

---

## Color System

### Primary Colors
```css
/* Orange - Primary Actions */
--orange-600: #EA580C;  /* Primary buttons, CTAs */
--orange-700: #C2410C;  /* Hover states */
--orange-100: #FFEDD5;  /* Light backgrounds */
--orange-50: #FFF7ED;   /* Very light backgrounds */
```

### Status Colors
```css
/* Success */
--green-600: #10B981;
--green-100: #D1FAE5;
--green-800: #065F46;

/* Error/Destructive */
--red-600: #DC2626;
--red-100: #FEE2E2;
--red-500: #EF4444;

/* Warning */
--yellow-600: #D97706;
--yellow-100: #FEF3C7;

/* Info */
--blue-600: #3B82F6;
--blue-100: #DBEAFE;
```

### Neutral Colors
```css
/* Text Colors */
--gray-900: #111827;  /* Primary text */
--gray-700: #374151;  /* Secondary text */
--gray-600: #4B5563;  /* Tertiary text */
--gray-500: #6B7280;  /* Placeholder text */

/* Borders & Dividers */
--gray-300: #D1D5DB;
--gray-200: #E5E7EB;

/* Backgrounds */
--gray-100: #F3F4F6;
--gray-50: #F9FAFB;
--white: #FFFFFF;
```

### Color Usage Guidelines
- **Primary Actions**: Use `orange-600` for main CTAs
- **Destructive Actions**: Use `red-600` for delete/danger actions
- **Success States**: Use `green-600` for success messages
- **Text**: Use `gray-900` for primary, `gray-700` for secondary
- **Borders**: Use `gray-200` for subtle borders, `gray-300` for visible borders

### Contrast Requirements
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clear visual feedback on hover/focus

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes
```css
/* Display */
--text-5xl: 3rem;      /* 48px - Hero headings */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Section headings */
--text-2xl: 1.5rem;    /* 24px - Subsection headings */
--text-xl: 1.25rem;    /* 20px - Large body */
--text-lg: 1.125rem;   /* 18px - Emphasized text */
--text-base: 1rem;     /* 16px - Body text */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-xs: 0.75rem;    /* 12px - Captions */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;    /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

### Typography Scale
| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| H1 | 3xl (30px) | Bold (700) | Tight (1.25) | Page titles |
| H2 | 2xl (24px) | Bold (700) | Tight (1.25) | Section headings |
| H3 | xl (20px) | Semibold (600) | Normal (1.5) | Subsection headings |
| H4 | lg (18px) | Semibold (600) | Normal (1.5) | Card titles |
| Body | base (16px) | Normal (400) | Normal (1.5) | Default text |
| Small | sm (14px) | Normal (400) | Normal (1.5) | Secondary text |
| Caption | xs (12px) | Normal (400) | Normal (1.5) | Labels, metadata |

---

## Spacing & Layout

### Spacing Scale (4px base unit)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-full: 9999px;  /* Pills, badges */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## Components

### Buttons

#### Primary Button
```tsx
<button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg 
                   hover:bg-orange-700 focus:outline-none focus:ring-2 
                   focus:ring-orange-500 focus:ring-offset-2 transition">
  Button Text
</button>
```

**Accessibility Requirements:**
- Must have `aria-label` if icon-only
- Must be keyboard accessible (tab, enter, space)
- Must have visible focus indicator
- Disabled state must be clearly indicated

#### Secondary Button
```tsx
<button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg 
                   border border-gray-300 hover:border-orange-600 hover:text-orange-600 
                   focus:outline-none focus:ring-2 focus:ring-orange-500 transition">
  Button Text
</button>
```

#### Destructive Button
```tsx
<button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg 
                   hover:bg-red-700 focus:outline-none focus:ring-2 
                   focus:ring-red-500 transition">
  Delete
</button>
```

### Form Inputs

#### Text Input
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-orange-500 focus:border-transparent 
            disabled:opacity-50 disabled:cursor-not-allowed"
  aria-label="Input label"
  aria-describedby="input-description"
/>
```

**Accessibility Requirements:**
- Must have associated `<label>` or `aria-label`
- Must have `aria-describedby` for help text/errors
- Must have `aria-invalid` when validation fails
- Must be keyboard accessible
- Error messages must be announced to screen readers

#### Select Dropdown
```tsx
<select
  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  aria-label="Select option"
>
  <option value="">Choose...</option>
</select>
```

### Cards

#### Product Card
```tsx
<article className="bg-white rounded-lg border border-gray-200 overflow-hidden 
                   hover:shadow-lg transition">
  <img src="..." alt="Product name" />
  <div className="p-4">
    <h3>Product Name</h3>
    <p>Description</p>
  </div>
</article>
```

**Accessibility Requirements:**
- Use semantic HTML (`<article>`, `<section>`)
- Images must have descriptive `alt` text
- Interactive elements must be keyboard accessible
- Focus order must be logical

### Badges

#### Status Badge
```tsx
<span className="px-3 py-1 rounded-full text-sm font-semibold 
                 bg-green-100 text-green-700" 
      role="status" 
      aria-label="In Stock">
  In Stock
</span>
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### 1. Perceivable
- **Text Alternatives**: All images have descriptive alt text
- **Captions**: Video/audio content has captions
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Text Resize**: Content remains usable up to 200% zoom

#### 2. Operable
- **Keyboard Access**: All functionality available via keyboard
- **No Keyboard Traps**: Users can navigate away from all components
- **Focus Indicators**: Clear visible focus indicators (2px ring)
- **Timing**: No time limits on user actions
- **Navigation**: Consistent navigation structure

#### 3. Understandable
- **Readable**: Language declared in HTML (`lang="en"`)
- **Predictable**: Consistent navigation and functionality
- **Input Assistance**: Clear error messages and validation

#### 4. Robust
- **Valid HTML**: Semantic, valid markup
- **ARIA Labels**: Proper use of ARIA attributes
- **Screen Reader Support**: Tested with screen readers

### Keyboard Navigation

#### Tab Order
1. Navigation links
2. Main content
3. Form inputs (in logical order)
4. Action buttons
5. Footer links

#### Keyboard Shortcuts
- **Tab**: Move forward through interactive elements
- **Shift + Tab**: Move backward
- **Enter/Space**: Activate buttons/links
- **Escape**: Close modals/dialogs
- **Arrow Keys**: Navigate within components (menus, carousels)

### Focus Management

#### Focus Indicators
```css
/* Standard focus ring */
focus:outline-none
focus:ring-2
focus:ring-orange-500
focus:ring-offset-2

/* For dark backgrounds */
focus:ring-offset-white
```

#### Focus Trap
- Modals and dialogs must trap focus
- Focus returns to trigger element on close
- Skip links for main content

### Screen Reader Support

#### ARIA Labels
```tsx
// Icon-only buttons
<button aria-label="Add to cart">
  <ShoppingCart />
</button>

// Form inputs
<input aria-label="Email address" aria-required="true" />

// Status messages
<div role="status" aria-live="polite">
  Item added to cart
</div>

// Error messages
<div role="alert" aria-live="assertive">
  Error: Invalid email
</div>
```

#### Semantic HTML
- Use `<header>`, `<nav>`, `<main>`, `<footer>`
- Use `<article>` for product cards
- Use `<section>` for content sections
- Use proper heading hierarchy (h1 → h2 → h3)

### Color & Contrast

#### Minimum Contrast Ratios
- **Normal Text**: 4.5:1 (WCAG AA)
- **Large Text** (18px+): 3:1 (WCAG AA)
- **UI Components**: 3:1 (WCAG AA)
- **Graphics**: 3:1 (WCAG AA)

#### Don't Rely on Color Alone
- Use icons + color for status indicators
- Use text labels + color for form validation
- Use patterns/textures in addition to color

### Form Accessibility

#### Required Fields
```tsx
<label htmlFor="email">
  Email <span aria-label="required">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert" className="text-red-600">
  Please enter a valid email
</span>
```

#### Error Handling
- Errors must be announced to screen readers (`role="alert"`)
- Errors must be associated with inputs (`aria-describedby`)
- Inputs must have `aria-invalid="true"` when invalid
- Error messages must be clear and actionable

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices (tablets) */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Guidelines
- **Touch Targets**: Minimum 44x44px
- **Spacing**: Adequate spacing between interactive elements
- **Text Size**: Minimum 16px to prevent zoom on iOS
- **Navigation**: Collapsible menu for mobile
- **Forms**: Full-width inputs on mobile

### Tablet Guidelines
- **Grid**: 2-column layouts
- **Navigation**: Horizontal navigation bar
- **Cards**: 2-3 columns for product grids

### Desktop Guidelines
- **Max Width**: Content containers max-width 1280px
- **Grid**: 3-4 columns for product grids
- **Navigation**: Full horizontal navigation
- **Hover States**: All interactive elements have hover states

---

## Component Patterns

### Loading States
```tsx
<div role="status" aria-live="polite" aria-label="Loading">
  <div className="animate-spin">Loading...</div>
</div>
```

### Empty States
```tsx
<section aria-labelledby="empty-heading">
  <h2 id="empty-heading">Your cart is empty</h2>
  <p>Start shopping to add items to your cart</p>
  <button>Continue Shopping</button>
</section>
```

### Error States
```tsx
<div role="alert" aria-live="assertive">
  <h3>Error</h3>
  <p>Failed to load products. Please try again.</p>
  <button>Retry</button>
</div>
```

### Success Messages
```tsx
<div role="status" aria-live="polite" className="bg-green-50 border-green-200">
  <p>Order placed successfully!</p>
</div>
```

---

## Implementation Checklist

### For Each Component
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation supported
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Responsive design implemented
- [ ] Error states handled
- [ ] Loading states provided
- [ ] Screen reader tested

### For Each Page
- [ ] Proper heading hierarchy
- [ ] Skip links for main content
- [ ] Language declared (`lang="en"`)
- [ ] Page title descriptive
- [ ] Meta description present
- [ ] Mobile responsive
- [ ] Touch targets adequate size

---

## Testing Checklist

### Accessibility Testing
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content correctly
- [ ] Focus indicators visible
- [ ] Color contrast meets standards
- [ ] Forms are accessible
- [ ] Images have alt text
- [ ] ARIA labels are correct

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
