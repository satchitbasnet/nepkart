# Accessibility Implementation Guide

This guide provides specific implementation patterns for accessibility in the NEPKART application.

## Quick Reference

### Required ARIA Attributes

```tsx
// Buttons
<button aria-label="Add to cart">  // Icon-only buttons
<button aria-describedby="help-text">  // Buttons with help text

// Forms
<input aria-label="Email" aria-required="true" aria-invalid="true" />
<label htmlFor="email">Email</label>

// Status Messages
<div role="status" aria-live="polite">Success message</div>
<div role="alert" aria-live="assertive">Error message</div>

// Navigation
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>
```

## Component-Specific Guidelines

### Buttons

#### Icon-Only Buttons
```tsx
// ❌ Bad
<button onClick={handleDelete}>
  <Trash2 />
</button>

// ✅ Good
<button 
  onClick={handleDelete}
  aria-label="Delete item"
  className="focus:ring-2 focus:ring-orange-500"
>
  <Trash2 aria-hidden="true" />
</button>
```

#### Buttons with Loading States
```tsx
<button 
  disabled={isLoading}
  aria-busy={isLoading}
  aria-label={isLoading ? "Processing..." : "Submit order"}
>
  {isLoading ? "Processing..." : "Submit Order"}
</button>
```

### Forms

#### Input Fields
```tsx
// ✅ Good
<div>
  <label htmlFor="email" className="block mb-2">
    Email Address <span aria-label="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : "email-help"}
    className="focus:ring-2 focus:ring-orange-500"
  />
  {hasError && (
    <p id="email-error" role="alert" className="text-red-600">
      Please enter a valid email address
    </p>
  )}
  {!hasError && (
    <p id="email-help" className="text-gray-500">
      We'll never share your email
    </p>
  )}
</div>
```

#### Select Dropdowns
```tsx
<label htmlFor="category">Category</label>
<select
  id="category"
  aria-label="Select product category"
  className="focus:ring-2 focus:ring-orange-500"
>
  <option value="">Choose a category</option>
  <option value="food">Food</option>
</select>
```

### Navigation

#### Header Navigation
```tsx
<header>
  <nav aria-label="Main navigation">
    <ul role="list" className="flex gap-4">
      <li>
        <Link to="/" aria-current={location.pathname === "/" ? "page" : undefined}>
          Home
        </Link>
      </li>
    </ul>
  </nav>
</header>
```

#### Breadcrumbs
```tsx
<nav aria-label="Breadcrumb">
  <ol role="list" className="flex">
    <li><Link to="/">Home</Link></li>
    <li aria-hidden="true">/</li>
    <li><Link to="/products">Products</Link></li>
  </ol>
</nav>
```

### Product Cards

```tsx
<article 
  className="product-card"
  aria-labelledby={`product-${product.id}-name`}
>
  <img 
    src={product.image} 
    alt={`${product.name} - ${product.description}`}
    loading="lazy"
  />
  <div>
    <h3 id={`product-${product.id}-name`}>{product.name}</h3>
    <p className="sr-only">Price: ${product.price}</p>
    <span aria-hidden="true">${product.price}</span>
    <button 
      aria-label={`Add ${product.name} to cart`}
      disabled={!product.inStock}
      aria-disabled={!product.inStock}
    >
      Add to Cart
    </button>
  </div>
</article>
```

### Modals & Dialogs

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-description">
    Are you sure you want to delete this item? This action cannot be undone.
  </p>
  <button onClick={handleClose}>Cancel</button>
  <button onClick={handleConfirm}>Delete</button>
</div>
```

### Status Messages

#### Toast Notifications
```tsx
// Success
<div 
  role="status" 
  aria-live="polite"
  className="bg-green-50 border-green-200"
>
  <span className="sr-only">Success:</span>
  Item added to cart
</div>

// Error
<div 
  role="alert" 
  aria-live="assertive"
  className="bg-red-50 border-red-200"
>
  <span className="sr-only">Error:</span>
  Failed to add item. Please try again.
</div>
```

### Loading States

```tsx
<div 
  role="status" 
  aria-live="polite"
  aria-label="Loading products"
>
  <div className="animate-spin" aria-hidden="true"></div>
  <span className="sr-only">Loading products...</span>
  <span aria-hidden="true">Loading...</span>
</div>
```

## Keyboard Navigation

### Tab Order
Ensure logical tab order:
1. Skip to main content link (if present)
2. Header navigation
3. Main content (forms, buttons)
4. Footer links

### Keyboard Shortcuts
```tsx
// Handle keyboard events
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose();
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick();
  }
};
```

### Focus Management
```tsx
// Focus trap for modals
useEffect(() => {
  const firstFocusable = modalRef.current?.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable?.focus();
}, []);
```

## Screen Reader Only Content

```css
/* Add to your CSS */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Usage:
```tsx
<button>
  <ShoppingCart aria-hidden="true" />
  <span className="sr-only">Shopping cart</span>
  <span aria-hidden="true">Cart</span>
</button>
```

## Testing Checklist

### Manual Testing
- [ ] Navigate entire site using only keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify all images have descriptive alt text
- [ ] Check color contrast ratios (use WebAIM Contrast Checker)
- [ ] Test form validation and error messages
- [ ] Verify focus indicators are visible
- [ ] Test on mobile devices (touch targets)

### Automated Testing
- [ ] Run axe DevTools or Lighthouse accessibility audit
- [ ] Check HTML validation
- [ ] Test with keyboard navigation
- [ ] Verify ARIA attributes are correct

## Common Issues & Fixes

### Issue: Missing Alt Text
```tsx
// ❌ Bad
<img src="/logo.png" />

// ✅ Good
<img src="/logo.png" alt="NEPKART logo" />
```

### Issue: Missing Labels
```tsx
// ❌ Bad
<input type="email" />

// ✅ Good
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Issue: No Focus Indicators
```tsx
// ❌ Bad
<button className="bg-orange-600">Click</button>

// ✅ Good
<button className="bg-orange-600 focus:ring-2 focus:ring-orange-500">
  Click
</button>
```

### Issue: Color-Only Status Indicators
```tsx
// ❌ Bad
<span className="text-green-600">Success</span>

// ✅ Good
<span className="text-green-600">
  <CheckCircle aria-hidden="true" />
  <span className="sr-only">Success:</span>
  Order placed
</span>
```

## Resources

- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
