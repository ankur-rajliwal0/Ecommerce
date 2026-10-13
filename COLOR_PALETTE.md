# Brand Color Palette & Design System

This document outlines the official 6-color brand palette for Veltrix E-commerce. Always use these colors across all storefront pages, administrative dashboards, marketing banners, and UI components.

---

## 🎨 Color Palette Overview

| Role | Color Name | Hex Code | Primary Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Forest Green | `#344B38` | Buttons, important CTAs, brand badges, active links, Razorpay theme |
| **Background** | Warm Cream | `#F8F6F1` | Main page background (`html`/`body`), hero sections, container backdrops |
| **Secondary** | Sage Green | `#829078` | Feature icons, metadata subheadings, decorative tags, subtle highlights |
| **Accent** | Warm Beige | `#DCC6A8` | Card borders, gift cards, product background badges, divider lines |
| **Text** | Soft Charcoal | `#292923` | Headings (`h1`-`h6`), body text, navigation links, readable text |
| **Surface** | Pale Sage | `#E9E9E0` | Category cards, promotional sections, dropdown menus, table headers |

---

## 💻 CSS Variables & Tailwind Tokens

The tokens are configured in `src/index.css`:

```css
@theme {
  /* Brand Palette Tokens */
  --color-primary-forest: #344B38;
  --color-primary-hover: #263829;
  --color-background-cream: #F8F6F1;
  --color-secondary-sage: #829078;
  --color-accent-beige: #DCC6A8;
  --color-text-charcoal: #292923;
  --color-surface-sage: #E9E9E0;

  /* Aliased tokens for full application consistency */
  --color-primary-teal: #344B38;
  --color-secondary-teal: #829078;
  --color-accent-orange: #DCC6A8;
  --color-surface: #E9E9E0;
  --color-bg-white: #FFFFFF;
  --color-bg-light-gray: #F8F6F1;
  --color-border-gray: #DCC6A8;

  --font-sans: 'Google Sans', sans-serif;
  --font-heading: 'Montserrat', sans-serif;
}

:root {
  --primary-forest: #344B38;
  --background-cream: #F8F6F1;
  --secondary-sage: #829078;
  --accent-beige: #DCC6A8;
  --text-charcoal: #292923;
  --surface-sage: #E9E9E0;
}
```

---

## 📐 Usage Guidelines & Tailwind Class References

### 1. Primary Buttons & Call to Actions
- **Background**: `bg-[#344B38]` or `bg-primary-forest`
- **Hover**: `hover:bg-[#829078]` or `hover:bg-primary-hover`
- **Text**: `text-white` (never use dark text on Deep Forest Green to maintain high accessibility contrast)
- **Shadow**: `shadow-md hover:shadow-lg transition-all`

```jsx
<button className="bg-[#344B38] hover:bg-[#829078] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all">
  Add to Cart
</button>
```

### 2. Page & Section Backgrounds
- **Main page container**: `bg-[#F8F6F1]` (Warm Cream)
- **Cards / Modals**: `bg-white` with border `border-[#DCC6A8]` (Warm Beige)
- **Alternative Surfaces**: `bg-[#E9E9E0]` (Pale Sage)

```jsx
<div className="bg-[#F8F6F1] min-h-screen py-12">
  <div className="bg-white rounded-2xl border border-[#DCC6A8] p-8 shadow-sm">
    {/* Card Content */}
  </div>
</div>
```

### 3. Typography
- **Headings (`h1`-`h6`)**: `text-[#292923]` with `font-bold` / `font-extrabold`
- **Body Text**: `text-[#292923]` or `text-[#292923]/80`
- **Subtitles & Hints**: `text-[#829078]` (Sage Green)

### 4. Borders & Dividers
- **Standard Border**: `border-[#DCC6A8]` (Warm Beige) or `border-[#E9E9E0]` (Pale Sage)
- **Dividers**: `divide-[#E9E9E0]`

### 5. Badges & Chips
- **Featured Badges**: `bg-[#E9E9E0] text-[#344B38] border border-[#DCC6A8]`
- **Sale / Highlight**: `bg-[#DCC6A8] text-[#292923]`

---

## 🔒 Third-Party Configurations
- **Razorpay Theme Color**: Always set `options.theme.color = "#344B38"`.
- **Toaster Alerts**: Styled in `src/App.jsx` with background `#292923`, text `#F8F6F1`, border `#DCC6A8`, and success icon `#344B38`.
