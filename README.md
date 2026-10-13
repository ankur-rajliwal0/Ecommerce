# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## 🎨 Brand Color System

The website uses a cohesive 6-color system defined in `src/index.css` and documented in [`COLOR_PALETTE.md`](./COLOR_PALETTE.md):

| Role | Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Forest Green | `#344B38` | Buttons, CTAs, brand accents (use white text) |
| **Background** | Warm Cream | `#F8F6F1` | Page backgrounds, hero containers |
| **Secondary** | Sage Green | `#829078` | Feature icons, subtitles, decorative tags |
| **Accent** | Warm Beige | `#DCC6A8` | Card borders, gift cards, product background badges |
| **Text** | Soft Charcoal | `#292923` | Headings, navigation links, body copy |
| **Surface** | Pale Sage | `#E9E9E0` | Category cards, promotional sections, dropdowns |

