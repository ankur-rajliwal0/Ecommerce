# E-commerce Website Design Specification

## 1. Design Reference

This document describes the UI/UX design shown in the provided reference
image.

The design is a **modern multi-category e-commerce storefront** with a
clean white base, dark teal promotional sections, rounded cards, large
product imagery, promotional banners, and a dense desktop shopping
layout.

The overall visual direction should feel:

-   Modern
-   Premium but accessible
-   Product-focused
-   Clean and organized
-   Promotional without looking cluttered
-   Responsive across desktop, tablet, and mobile

------------------------------------------------------------------------

# 2. Overall Page Structure

The homepage follows this approximate order:

1.  Top/Header navigation
2.  Main navigation/category bar
3.  Hero promotional section
4.  Product/category promotional grid
5.  Weekly Best Deals section
6.  Promotional banner cards
7.  Shop Deals by Category section
8.  Product/category grids
9.  Additional promotional sections
10. New Arrivals / Best Seller / Best Offers tabs
11. App promotion banner
12. Most Popular Seller / Brand section
13. Footer

The reference is primarily optimized for a **desktop ecommerce
experience**, with a two-column visual composition in the supplied
screenshot.

------------------------------------------------------------------------

# 3. Header Design

## 3.1 Top Header

Use a white background with a compact ecommerce header.

### Elements

-   Logo on the left
-   Search bar in the center
-   Search button
-   Wishlist icon
-   Cart icon
-   User/account icon
-   Login / Sign Up text
-   Small utility information where required

### Layout

``` text
[Logo]     [ Search products...                 ][Search]     [♡] [Cart] [User/Login]
```

### Visual Style

-   White background
-   Very light bottom border
-   Small rounded controls
-   Compact height
-   Dark text
-   Orange/yellow used for the primary search/action button
-   Icons should be simple outline-style icons

------------------------------------------------------------------------

# 4. Main Navigation

Immediately below the main header, create a horizontal navigation menu.

Example structure:

``` text
Browse Categories   Shop   Super Deals   Find Store   What's New   Special Offer   Pages
```

### Design

-   White background
-   Small font
-   Medium font weight
-   Horizontal spacing between items
-   One primary/highlighted navigation item can use the brand accent
    color
-   Dropdown arrows can be used for categories with children

The navigation should remain visually lightweight so that the hero
section gets the most attention.

------------------------------------------------------------------------

# 5. Hero Section

The hero area is the main visual focus of the homepage.

The reference uses multiple promotional cards instead of one full-width
banner.

## 5.1 Hero Grid

Recommended desktop layout:

``` text
┌───────────────────────────┬─────────────────────────────┐
│                           │                             │
│     Furniture / Main      │      Stylish Looks          │
│     Promotional Card      │      Promotional Card       │
│                           │                             │
├───────────────────────────┤                             │
│ Men's Fashion             │                             │
│ Promotional Card          │                             │
└───────────────────────────┴─────────────────────────────┘
```

The exact grid can be implemented as:

-   Left column: 2 stacked promotional cards
-   Right column: one large promotional card

### Hero Card Content

Each card can contain:

-   Small promotional label
-   Large heading
-   Supporting text
-   CTA button
-   Product/person image
-   Decorative background shapes

Example:

``` text
Furniture Collection

Dining, living & décor...
[Shop Now]

                  [Furniture Image]
```

------------------------------------------------------------------------

# 6. Hero Card Styling

Hero cards should use:

-   Rounded corners
-   Soft pastel backgrounds
-   Large product/lifestyle images
-   Strong heading typography
-   Small descriptive text
-   Compact CTA buttons

### Suggested colors

  Purpose             Approximate Color
  ------------------- -------------------
  Page background     `#FFFFFF`
  Primary dark teal   `#003F3B`
  Secondary teal      `#075C55`
  Orange accent       `#F5A623`
  Light cream         `#FFF8EC`
  Light blue          `#EEF6FA`
  Light green         `#EAF7F2`
  Primary text        `#202020`
  Secondary text      `#777777`
  Border              `#E8E8E8`

These are approximate visual references and can be adjusted while
maintaining the same design character.

------------------------------------------------------------------------

# 7. Promotional Cards

The homepage uses several different promotional card sizes.

## Card Types

### Large card

Used for major campaigns.

Contains:

-   Large heading
-   Description
-   CTA
-   Large lifestyle/product image

### Medium card

Used for:

-   Men's fashion
-   Smartwatch
-   Home products
-   Seasonal campaigns

### Small card

Used for:

-   Category promotions
-   Limited offers
-   Product promotions

### Card Rules

All promotional cards should:

-   Have rounded corners
-   Use controlled image cropping
-   Maintain strong text/image contrast
-   Keep CTA visible
-   Avoid excessive text

------------------------------------------------------------------------

# 8. Weekly Best Deals Section

A major dark teal section appears after the hero area.

## Section Style

``` text
Background: Dark Teal
Text: White
Cards: White
```

### Header

``` text
Weekly Best Deals

[Up to 50% off] [Under $50] [Almost Sold Out] [Beauty & Health] ...
```

Include:

-   Section title
-   Category/filter chips
-   Limited-time countdown
-   Product grid

------------------------------------------------------------------------

# 9. Countdown Timer

The Weekly Best Deals section includes a countdown timer.

Example:

``` text
Limited time only

[05] : [39] : [48] : [40]
 Days   Hours  Minutes Seconds
```

### Style

-   Compact boxes
-   White or light background
-   Dark text
-   Small labels
-   Strong numeric typography

The timer should visually communicate urgency without dominating the
product cards.

------------------------------------------------------------------------

# 10. Product Cards

Product cards are one of the most important components in the design.

## Card Structure

``` text
┌─────────────────────────────┐
│ [Discount]           [♡]    │
│                             │
│       Product Image         │
│                             │
├─────────────────────────────┤
│ Product Name                │
│ Category / Brand            │
│ ★★★★★                      │
│ ₹ Price                     │
│ [Add to Cart]               │
└─────────────────────────────┘
```

## Product Card Features

Each product card may contain:

-   Discount badge
-   Wishlist icon
-   Product image
-   Product name
-   Short category/brand information
-   Rating
-   Price
-   Original price
-   Add to Cart button

### Visual Design

-   White card
-   Rounded corners
-   Thin border
-   Subtle shadow on hover
-   Clean product image area
-   Compact spacing

------------------------------------------------------------------------

# 11. Product Grid

Desktop layout should support approximately:

-   4 to 6 products per row depending on container width

Suggested:

``` text
Desktop: 5–6 columns
Tablet: 3–4 columns
Mobile: 2 columns
```

Product cards should have equal height where practical.

------------------------------------------------------------------------

# 12. Promotional Banner Row

Below the first product grid, the design uses promotional cards.

Example:

``` text
┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Fitness Smart        │ │ Men's Fashion    │ │ Felly Fan Offer  │
│ Special Offer        │ │ Collection       │ │                  │
│ [Shop Now]           │ │ [Shop Now]       │ │ [Shop Now]       │
└──────────────────────┘ └──────────────────┘ └──────────────────┘
```

These banners should use different background colors and
product/lifestyle images.

------------------------------------------------------------------------

# 13. Shop Deals by Category

After the dark promotional area, return to a white/light section.

## Section Header

``` text
Shop Deals by Category

Dining, living, and décor save their purpose...
```

The heading should be centered.

## Category Cards

Use circular or rounded category thumbnails.

Example:

``` text
[Image]  [Image]  [Image]  [Image]  [Image]  [Image]
Fashion  Beauty   Home     Shoes    Watches  Gifts
```

Each category should include:

-   Image/icon
-   Category name
-   Optional product count

------------------------------------------------------------------------

# 14. Category Navigation

Category navigation should feel visual rather than text-heavy.

Use:

-   Circular product/category images
-   Rounded containers
-   Consistent dimensions
-   Small category labels
-   Horizontal scrolling on mobile

------------------------------------------------------------------------

# 15. Secondary Product Section

The design contains additional product browsing areas using tabs such
as:

``` text
New Arrivals    Best Seller    Best Offers
```

The selected tab should have a visible active state.

### Product Layout

Use a combination of:

-   Featured large product card
-   Smaller product cards
-   Promotional product tile
-   Standard product cards

This creates an editorial ecommerce layout instead of a repetitive grid.

------------------------------------------------------------------------

# 16. Featured Product Tile

A large product tile can be placed next to standard products.

Example:

``` text
┌──────────────────────┐
│ Limited time only    │
│                      │
│    Large Product     │
│       Image          │
│                      │
│ Sneaker Fest 2024    │
│ [Shop Now]           │
└──────────────────────┘
```

This tile should be visually stronger than normal product cards.

------------------------------------------------------------------------

# 17. Smartwatch Promotional Banner

The reference includes a wide green/teal promotional banner.

### Layout

``` text
┌───────────────────────────────────────────────────────┐
│                                                       │
│  AMAZFIT                                              │
│  SMARTWATCH                                           │
│  Explore stylish smartwatch collection               │
│                                                       │
│                              [Watch Image]             │
│                              [Shop Now]                │
└───────────────────────────────────────────────────────┘
```

### Style

-   Green/teal gradient or solid background
-   White text
-   Large product image
-   Rounded corners
-   CTA button
-   High contrast

------------------------------------------------------------------------

# 18. App Promotion Section

The reference includes an app-download promotional block.

## Content

Example:

``` text
NextCart User Friendly
App Available

Shop easily from our mobile application.

[Google Play] [App Store]

                         [Mobile App Mockup]
```

### Design

-   Dark teal background
-   White text
-   Mobile phone mockup
-   Store badges
-   Rounded container

------------------------------------------------------------------------

# 19. Most Popular Seller Section

The design includes a seller/brand area near the lower part of the
homepage.

## Layout

Use horizontally arranged seller/brand cards.

Each can contain:

-   Brand logo
-   Brand name
-   Rating
-   Product count or short information

Example:

``` text
[Logo] [Logo] [Logo] [Logo] [Logo] [Logo]
Seller  Seller  Seller  Seller  Seller  Seller
```

Keep this section minimal and clean.

------------------------------------------------------------------------

# 20. Footer

Although the footer is not fully visible in the supplied reference, the
design should continue the same ecommerce visual language.

Recommended footer structure:

``` text
Company
- About Us
- Contact
- Careers

Customer Service
- Shipping
- Returns
- FAQs
- Support

Shop
- Categories
- New Arrivals
- Best Sellers
- Offers

Contact
- Phone
- Email
- Address

Social
- Instagram
- Facebook
- YouTube
```

Use a dark background with light text or a clean white footer depending
on the final implementation.

------------------------------------------------------------------------

# 21. Typography

The design uses a dual-font strategy for a modern, elegant ecommerce feel.

## Font Families

- **Headings & Main Texts**: `Montserrat`
- **Secondary Texts, Descriptions, Small Texts**: `Google Sans`

## Recommended hierarchy

### H1
- Font: Montserrat
- Large
- Bold
- Approx. 36--56px desktop

### H2
- Font: Montserrat
- Bold
- Approx. 24--32px

### H3
- Font: Montserrat
- Approx. 18--24px

### Body
- Font: Google Sans
- 13--16px

### Product text & Descriptions
- Font: Google Sans
- 13--15px

### Price
- Font: Google Sans
- 15--18px
- Semi-bold/bold

Use these modern fonts instead of older system fonts. Do not use decorative fonts for product information.

------------------------------------------------------------------------

# 22. Color System

## Primary Colors

``` text
Primary: #dce0d9
Secondary: #fbf6ef
Accent: #ead7c3
```

## Neutral Colors

``` text
White:             #FFFFFF
Off White:         #FAFAFA
Light Gray:        #F4F4F4
Border Gray:       #E8E8E8
Text:              #202020
Muted Text:        #777777
```

## Promotional Colors

Use soft promotional backgrounds such as:

``` text
Light Cream
Light Blue
Light Green
Soft Peach
Soft Gray
```

Promotional colors should remain subtle so product images remain the
visual focus.

------------------------------------------------------------------------

# 23. Buttons

## Primary Button

Example:

``` text
[ Shop Now ]
```

Style:

-   Orange/yellow background
-   Dark text
-   Rounded
-   Medium font weight
-   Small-to-medium padding

## Secondary Button

Use:

-   Dark teal background
-   White text

or

-   White background
-   Dark text
-   Border

## Product Button

``` text
[ Add to Cart ]
```

Keep product buttons compact.

------------------------------------------------------------------------

# 24. Border Radius

Use a consistent `rounded-xl` (12px) border radius universally across all UI elements (buttons, cards, inputs, dialogs) to maintain a highly uniform, soft, and modern aesthetic. The only exception is `rounded-full` for perfect circles like avatars or icon backgrounds.

``` text
Universal Radius: rounded-xl (12px)
Circular Elements: rounded-full
```

Avoid excessive pill-shaped components except for:

-   Filter chips
-   Category tags
-   Small badges

------------------------------------------------------------------------

# 25. Shadows

Use subtle shadows only.

Example:

``` text
Product cards:
0 2px 8px rgba(0,0,0,0.05)

Hover:
0 8px 24px rgba(0,0,0,0.10)
```

The overall design should remain clean rather than heavily elevated.

------------------------------------------------------------------------

# 26. Product Image Treatment

Product images should have:

-   Clean backgrounds
-   Consistent aspect ratio
-   Center alignment
-   Object-fit contain
-   Adequate white space

Recommended product image container:

``` text
Aspect ratio: approximately 1 / 1
Background: #FFFFFF or #F8F8F8
```

Lifestyle promotional images can use:

``` text
object-fit: cover
```

------------------------------------------------------------------------

# 27. Spacing System

Use a consistent spacing scale.

``` text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Recommended homepage section spacing:

``` text
Desktop: 48–80px
Tablet: 40–60px
Mobile: 28–40px
```

------------------------------------------------------------------------

# 28. Container Width

Use a centered max-width container.

Recommended:

``` text
max-width: 1280px–1440px
width: 92%–95%
margin: 0 auto
```

The exact value can be adjusted based on the application's content
density.

------------------------------------------------------------------------

# 29. Responsive Design

The supplied reference is desktop-heavy, so the layout must be adapted
for smaller screens rather than simply shrinking everything.

## Desktop

``` text
≥ 1200px

Header: Full navigation
Hero: Multi-card grid
Products: 5–6 columns
Categories: Horizontal row
Promotional banners: Multi-column
```

## Tablet

``` text
768px–1199px

Header: Reduced navigation
Hero: 2-column layout
Products: 3–4 columns
Categories: Horizontal scroll
Banners: 2 columns
```

## Mobile

``` text
< 768px

Header:
[Menu] [Logo] [Cart]

Search:
Full-width search bar

Hero:
Single-column promotional cards

Products:
2-column grid

Categories:
Horizontal scrolling row

Promotional banners:
Single column

Seller cards:
Horizontal scrolling
```

------------------------------------------------------------------------

# 30. Mobile Product Card

Mobile cards should remain compact.

Example:

``` text
┌──────────────┐
│   [Discount] │
│              │
│    Image     │
│              │
│ Product Name │
│ ★★★★★        │
│ ₹999         │
│ [Add Cart]   │
└──────────────┘
```

Avoid displaying too much metadata on mobile.

------------------------------------------------------------------------

# 31. Header Mobile Behavior

On mobile:

-   Hide desktop navigation
-   Show hamburger menu
-   Keep logo visible
-   Keep cart icon visible
-   Keep account icon if space allows
-   Move search below the top header
-   Use a slide-out drawer for categories/navigation

------------------------------------------------------------------------

# 32. Interaction Design

## Product Hover

On desktop:

-   Slight card elevation
-   Product image subtle zoom
-   Wishlist icon becomes more prominent
-   Add to Cart remains accessible

## Buttons

Use subtle hover transitions:

``` text
transition: 200ms ease
```

## Category Hover

Category cards can:

-   Slightly scale
-   Increase shadow
-   Change border/accent

Avoid aggressive animations.

------------------------------------------------------------------------

# 33. Homepage Visual Hierarchy

Priority should be:

``` text
1. Hero promotions
2. Main product deals
3. Product images
4. Promotional campaigns
5. Categories
6. New arrivals / best sellers
7. App promotion
8. Sellers / brands
9. Footer
```

The user should understand what the store sells within the first few
seconds.

------------------------------------------------------------------------

# 34. E-commerce UX Requirements

The design should support:

-   Product discovery
-   Search
-   Category filtering
-   Product details
-   Add to cart
-   Wishlist
-   Checkout
-   Login/signup
-   Order tracking/status
-   Admin product management
-   Admin order management

The visual design should not interfere with these core shopping actions.

------------------------------------------------------------------------

# 35. Accessibility

Implement:

-   Good text/background contrast
-   Visible focus states
-   Alt text for product images
-   Accessible buttons
-   Keyboard navigation
-   Proper heading hierarchy
-   Labels for search and form fields
-   Do not rely only on color to communicate status

------------------------------------------------------------------------

# 36. Component Breakdown

Recommended reusable React components:

``` text
Header
TopNavigation
SearchBar
CategoryMenu
HeroSection
PromoCard
CountdownTimer
SectionHeader
FilterChips
ProductCard
ProductGrid
CategoryCard
CategoryCarousel
PromoBanner
FeaturedProductCard
ProductTabs
AppPromoBanner
SellerCard
SellerCarousel
Footer
```

------------------------------------------------------------------------

# 37. Suggested React Page Structure

``` text
src/
├── components/
│   ├── Header.jsx
│   ├── Navigation.jsx
│   ├── SearchBar.jsx
│   ├── HeroSection.jsx
│   ├── PromoCard.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── CategoryCard.jsx
│   ├── PromoBanner.jsx
│   ├── CountdownTimer.jsx
│   ├── SellerCard.jsx
│   └── Footer.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Orders.jsx
│
├── assets/
│   ├── products/
│   ├── categories/
│   ├── banners/
│   └── brands/
│
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
│
└── App.jsx
```

------------------------------------------------------------------------

# 38. Design Implementation Recommendation

For the requested ecommerce project, implement the UI using:

``` text
React
Vite
Tailwind CSS
React Icons
Supabase
```

The visual system should be component-driven so that:

-   Product cards can be reused
-   Promotional banners can be reused
-   Categories can be dynamically generated
-   Products can come from Supabase
-   Admin-created products automatically appear in the storefront

------------------------------------------------------------------------

# 39. Homepage Component Hierarchy

``` text
Home
│
├── Header
│   ├── Logo
│   ├── SearchBar
│   ├── Wishlist
│   ├── Cart
│   └── Account
│
├── Navigation
│
├── HeroSection
│   ├── PromoCard
│   ├── PromoCard
│   └── PromoCard
│
├── WeeklyDeals
│   ├── SectionHeader
│   ├── FilterChips
│   ├── CountdownTimer
│   └── ProductGrid
│       └── ProductCard
│
├── PromoBannerGrid
│
├── CategorySection
│   └── CategoryCard
│
├── FeaturedProducts
│   ├── ProductTabs
│   ├── FeaturedProductCard
│   └── ProductGrid
│
├── SmartwatchBanner
│
├── AppPromo
│
├── PopularSellers
│   └── SellerCard
│
└── Footer
```

------------------------------------------------------------------------

# 40. Final Design Direction

The final implementation should closely follow the supplied reference's
visual language:

-   White ecommerce canvas
-   Dark teal promotional blocks
-   Orange/yellow CTAs
-   Large lifestyle imagery
-   Rounded promotional cards
-   Compact product cards
-   Dense but organized product grids
-   Visual category navigation
-   Multiple promotional sections
-   Strong product imagery
-   Minimal shadows
-   Modern typography
-   Generous section spacing
-   Responsive mobile adaptation

The goal is to create a **premium modern ecommerce homepage**, not a
basic product grid.

The design should feel similar to a large marketplace/storefront while
remaining simple enough to implement and maintain in a React + Vite +
Tailwind project.
