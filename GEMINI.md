# Project Rules & Design System

## 🎨 Official Brand Color System
Whenever modifying existing components, adding new pages, or styling UI elements in this repository, always adhere strictly to the following 6-color palette:

1. **Primary — Deep Forest Green (`#344B38`)**:
   - Used for: Primary buttons, important CTAs, brand accents, active navigation states, Razorpay theme.
   - **Contrast Rule**: Buttons using `bg-[#344B38]` must ALWAYS use `text-white`. Never use dark text on this color.

2. **Background — Warm Cream (`#F8F6F1`)**:
   - Used for: Main page background (`html`/`body`), hero sections, container backdrops.

3. **Secondary — Sage Green (`#829078`)**:
   - Used for: Icons, decorative details, subtitles, category tags, subtle highlights.

4. **Accent — Warm Beige (`#DCC6A8`)**:
   - Used for: Card borders, gift cards, product background badges, divider lines.

5. **Text — Soft Charcoal (`#292923`)**:
   - Used for: Headings (`h1`-`h6`), body copy, navigation text, readable text across the application.

6. **Surface — Pale Sage (`#E9E9E0`)**:
   - Used for: Category cards, promotional sections, dropdown menus, table headers, icon badges.

---

## 🛠️ Tailwind & CSS Tokens
Tokens are registered in `src/index.css`:
- `--color-primary-forest: #344B38`
- `--color-background-cream: #F8F6F1`
- `--color-secondary-sage: #829078`
- `--color-accent-beige: #DCC6A8`
- `--color-text-charcoal: #292923`
- `--color-surface-sage: #E9E9E0`

Aliased utility tokens:
- `bg-primary-teal` / `text-primary-teal`: `#344B38`
- `bg-secondary-teal` / `text-secondary-teal`: `#829078`
- `border-border-gray`: `#DCC6A8`
- `bg-surface`: `#E9E9E0`

---

## 📐 Official Border Radius System
To ensure strict visual harmony and a unified luxury aesthetic across the entire website, all UI elements must adhere to this exact 3-tier border-radius standard:

1. **Cards, Containers & Modals (`rounded-2xl` — 16px / 1rem)**:
   - Used for: Product cards, category cards, review cards, sidebar filters, cart item cards, order summaries, checkout forms, login/signup dialogs, policy cards, table containers.
   - **Consistency Rule**: Never mix `rounded-xl` or `rounded-3xl` for main content cards. Always use `rounded-2xl`.

2. **Buttons, Form Inputs & Interactive Controls (`rounded-xl` — 12px / 0.75rem)**:
   - Used for: Standard rectangular action buttons, text inputs, textareas, select dropdowns, quantity stepper boxes.

3. **Pills, Badges & Avatars (`rounded-full` — 9999px)**:
   - Used for: Search input bar, pill filter tags, pill CTA buttons, circular icon badges, avatars, status pills, floating action buttons.

