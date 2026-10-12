# TRD — Gift & Flower E-commerce Website

Technical Requirements Document
Version 1.0 | Based on PRD v1.0 | MVP / Development Ready

# 1. Technical Overview

This TRD translates the supplied PRD into an implementation plan for a simple gift and flower e-commerce application. The MVP has two areas: a customer-facing React website and an admin dashboard. The core platform is React.js/Vite with Supabase Authentication, Supabase PostgreSQL, Supabase Storage, Supabase Data API, Supabase Row Level Security (RLS), and Razorpay payment processing.

# 2. MVP Scope

## 2.1 Customer Features

Home page with navigation, search, categories, featured/latest products, CTA and footer.

Products listing with image, name, price, category and add-to-cart/details actions.

Product details with description, category, stock, quantity and cart actions.

Product search by name and description.

Category filtering.

Supabase signup, login and logout.

Cart with quantity updates, removal and totals. MVP may use React state/context plus localStorage.

Checkout with customer and shipping information.

Razorpay online payment.

Payment verification through trusted backend/Edge Function.

My Orders and Order Details pages.

## 2.2 Admin Features

Admin login and protected dashboard.

Dashboard summary cards.

Product CRUD: add, edit, delete and list.

Product image upload through Supabase Storage.

Order list and order details.

Order status management: Pending, Confirmed, Shipped, Delivered, Cancelled.

## 2.3 Explicit MVP Exclusions

Multiple vendors, reviews/ratings, coupons, loyalty points, advanced analytics, multiple admin permission levels, complex inventory management and multiple payment providers.

Wishlist is optional.

Email, WhatsApp and SMS notifications are future features in the supplied PRD, not core MVP functionality.

# 3. System Architecture

Browser
  |
  v
React + Vite
  |
  +--> Supabase Auth
  |
  +--> Supabase Data API --> PostgreSQL
  |
  +--> Supabase Storage
  |
  +--> Supabase Edge Function --> Razorpay
                              |
                              +--> Payment verification
                              +--> Trusted order/payment updates

The frontend must not contain Razorpay secret credentials or other private API credentials. Public product reads can use the Supabase client, while privileged payment creation/verification and protected updates must run in trusted server-side logic.

# 4. Frontend Technical Design

## 4.1 Routes

## 4.2 Suggested Project Structure

src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── SearchBar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── MyOrders.jsx
│   └── OrderDetails.jsx
├── admin/
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AddProduct.jsx
│   ├── EditProduct.jsx
│   └── AdminOrders.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── services/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── payment.js
├── lib/
│   └── supabase.js
└── App.jsx

# 5. Database Design

## 5.1 Entity Relationship Overview

auth.users
   |
   | 1:1
   v
profiles

categories 1 ---- N products

orders 1 ---- N order_items
profiles 1 ---- N orders
products 1 ---- N order_items

## 5.2 profiles

## 5.3 categories

## 5.4 products

## 5.5 orders

## 5.6 order_items

Historical product name, image and price must be copied into order_items so previous orders remain understandable if the product is later edited or deleted.

# 6. Supabase Configuration

Enable the Supabase Data API because the application uses supabase-js.

Prefer manual table exposure so access can be controlled table-by-table.

Enable RLS on protected tables.

Use Supabase Storage bucket named product-images for product images.

Use Supabase Auth for signup/login/session handling.

# 7. RLS and Authorization

## 7.1 Products

Public/anonymous users: SELECT only.

Admin users: INSERT, UPDATE and DELETE.

## 7.2 Profiles

Customer can SELECT and UPDATE only their own profile.

Admin can access profiles as required by the dashboard.

## 7.3 Orders

Customer can SELECT their own orders.

Customer can create their own order through the intended trusted flow.

Customer must not SELECT another customer's orders.

Customer must not change order_status or payment_status directly.

Admin can SELECT all orders and UPDATE order status.

Payment-related fields must be controlled by trusted backend/server-side logic.

## 7.4 Admin Authorization

The frontend may use profile.role to choose the UI, but this is not a security boundary. Database RLS must independently enforce admin permissions.

# 8. Authentication Flow

Signup
  -> Supabase Auth signup
  -> Create/obtain profile
  -> Customer session
  -> Customer UI

Login
  -> Supabase Auth
  -> Get authenticated user
  -> Fetch profile
  -> Check role
  -> Customer UI OR Admin Dashboard

Logout
  -> Supabase signOut()
  -> Clear client auth state
  -> Redirect

# 9. Product and Storage Flow

Admin
  -> Select product image
  -> Upload to Supabase Storage / product-images
  -> Obtain image URL/path
  -> Insert/update products.image_url

Customer
  -> SELECT public products
  -> Display image from stored URL/path

# 10. Cart Technical Design

The PRD recommends a simple MVP cart stored in frontend React state/context plus localStorage. No cart database table is required for the MVP.

Cart item:
{
  productId,
  name,
  image,
  price,
  quantity
}

Subtotal = sum(price * quantity)
Total = subtotal + delivery_charge

Validate product availability/stock before final order creation.

Do not treat localStorage price data as authoritative during payment/order creation.

Re-fetch/validate product price and stock through trusted data access before creating the final order.

# 11. Checkout and Order Flow

Cart
  -> Checkout
  -> Collect name, phone, email, address, city, state, pincode
  -> Calculate/display subtotal + delivery + total
  -> Create/prepare Razorpay payment
  -> Customer pays
  -> Server-side verification
  -> Create/confirm order
  -> Clear cart
  -> Show order confirmation
  -> My Orders

# 12. Razorpay Technical Flow

React Checkout
     |
     v
Supabase Edge Function / trusted backend
     |
     +--> Create Razorpay Order
     |
     v
Razorpay Checkout
     |
     v
Customer Payment
     |
     v
Razorpay response
     |
     v
Edge Function / trusted verification
     |
     +--> Verify signature/payment
     |
     +--> Update payment_status
     |
     +--> Create/confirm order
     v
Customer Order Confirmation

Razorpay secret key must never be shipped to the browser.

Payment signatures must be verified server-side.

Frontend payment success alone must not be treated as final payment verification.

Store Razorpay order/payment IDs in orders.

# 13. Admin Order State Machine

Pending
  -> Confirmed
  -> Shipped
  -> Delivered

Pending/Confirmed
  -> Cancelled

The admin UI should provide controlled status changes and display payment status separately from order status.

# 14. Error Handling

Use user-friendly toast/error messages and avoid exposing sensitive backend details.

# 15. Validation

Signup: required name, valid email, password and matching confirmation.

Product: required name/category/image, price > 0, stock >= 0.

Checkout: required name, phone, address, city, state and pincode.

Important validation must be repeated in trusted backend/database logic where appropriate.

# 16. Security Requirements

Enable Supabase RLS.

Enforce admin operations with database policies.

Never expose Razorpay secret keys or private API credentials in frontend code.

Verify Razorpay signatures server-side.

Restrict customers to their own orders.

Protect admin routes in both frontend navigation and database authorization.

Do not allow customers to modify payment/order status directly.

Validate important data on the server/trusted function.

# 17. Future Notification Integration

The supplied PRD lists Email Notifications and WhatsApp Order Notifications as future features. They are therefore outside the core MVP TRD scope, but the architecture should leave room for them.

Order status/payment event
        |
        v
Supabase Edge Function
        |
        +--> Email provider (future)
        |
        +--> WhatsApp Business API/provider (future)

Notification credentials must remain server-side.

Order events should be generated from trusted order/payment state changes.

Email and WhatsApp templates can be added after the MVP is stable.

# 18. Testing Plan

Authentication: signup, login, logout, invalid credentials and session expiry.

Product: public listing, search, category filter, details and out-of-stock behavior.

Cart: add, quantity change, remove, refresh persistence and total calculation.

Checkout: validation, delivery charge and order summary.

Payment: success, failure, cancellation and invalid verification.

Orders: customer isolation and admin status changes.

RLS: verify anonymous/customer/admin permissions independently.

Admin: CRUD and protected access.

Storage: admin upload and product image display.

Responsive UI: desktop and mobile.

# 19. Development Order

Create Supabase project.

Create database tables and relationships.

Enable RLS and implement policies.

Configure Supabase Auth.

Create React/Vite project and Supabase client.

Build AuthContext and protected routes.

Build product CRUD for admin.

Add Supabase Storage product image upload.

Build customer Home/Products/Product Details pages.

Build CartContext and localStorage cart.

Build Checkout.

Implement Razorpay Edge Function/payment flow.

Create verified orders and order_items.

Build My Orders and Order Details.

Build Admin Dashboard and Admin Orders.

Add error handling and validation.

Test RLS/security/payment flows.

Deploy and configure production environment.

# 20. MVP Acceptance Mapping

# 21. Environment Configuration

Frontend
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

Server/Edge Function secrets
SUPABASE_SERVICE_ROLE_KEY=...   # only if required by trusted backend logic
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

Never commit secret values to GitHub or expose them through Vite client-side variables.

The exact environment variable names can be changed during implementation; the security rule is that only public Supabase client configuration belongs in the browser.

# 22. Final Technical Scope

The MVP should remain intentionally simple: React/Vite customer UI + admin UI, Supabase Auth, PostgreSQL tables, RLS, Storage, localStorage cart, Razorpay through trusted server-side/Edge Function logic, and order management. Email and WhatsApp notifications are reserved for the next iteration, consistent with the supplied PRD.



| Layer | Technology / Responsibility |

| --- | --- |

| Frontend | React.js + Vite; responsive customer and admin UI |

| Styling | Tailwind CSS or equivalent frontend styling approach |

| Authentication | Supabase Auth |

| Database | Supabase PostgreSQL |

| Data access | supabase-js / Supabase Data API |

| File storage | Supabase Storage |

| Authorization | PostgreSQL RLS + profile role |

| Server-side logic | Supabase Edge Functions where trusted backend logic is required |

| Payments | Razorpay |

| Payment verification | Supabase Edge Function / trusted backend |





| Route | Access | Purpose |

| --- | --- | --- |

| / | Public | Home |

| /products | Public | Product listing/search/filter |

| /products/:id | Public | Product details |

| /login | Public | Customer/admin login |

| /signup | Public | Customer signup |

| /checkout | Customer | Checkout |

| /my-orders | Customer | Order history |

| /my-orders/:id | Customer | Order details |

| /admin | Admin | Dashboard |

| /admin/products | Admin | Product management |

| /admin/products/add | Admin | Create product |

| /admin/products/edit/:id | Admin | Edit product |

| /admin/orders | Admin | Order management |





| Column | Type / Meaning | Notes |

| --- | --- | --- |

| id | UUID | Primary key for profile record |

| user_id | UUID | Supabase Auth user ID; unique relationship |

| full_name | TEXT | Customer/admin name |

| email | TEXT | User email |

| phone | TEXT | Phone number |

| role | TEXT | customer or admin |

| created_at | TIMESTAMPTZ | Creation time |





| Column | Type / Meaning | Notes |

| --- | --- | --- |

| id | UUID/INT | Primary key |

| name | TEXT | Category name |

| slug | TEXT | URL-friendly identifier |

| created_at | TIMESTAMPTZ | Creation time |





| Column | Type / Meaning | Notes |

| --- | --- | --- |

| id | UUID/INT | Primary key |

| name | TEXT | Product name |

| slug | TEXT | URL-friendly identifier |

| description | TEXT | Product description |

| price | NUMERIC | Current product price |

| category_id | FK | References categories.id |

| image_url | TEXT | Supabase Storage URL/path |

| stock | INTEGER | Available stock |

| featured | BOOLEAN | Featured product flag |

| created_at | TIMESTAMPTZ | Creation time |

| updated_at | TIMESTAMPTZ | Last update |





| Column | Type / Meaning | Notes |

| --- | --- | --- |

| id | UUID/INT | Primary key / order identifier |

| user_id | FK | References authenticated customer |

| customer_name | TEXT | Snapshot at checkout |

| phone | TEXT | Snapshot at checkout |

| email | TEXT | Snapshot at checkout |

| address | TEXT | Shipping address |

| city | TEXT | Shipping city |

| state | TEXT | Shipping state |

| pincode | TEXT | Shipping pincode |

| subtotal | NUMERIC | Items subtotal |

| delivery_charge | NUMERIC | Delivery charge |

| total_amount | NUMERIC | Grand total |

| payment_status | TEXT | Pending/Paid/Failed/Refunded |

| order_status | TEXT | Pending/Confirmed/Shipped/Delivered/Cancelled |

| razorpay_order_id | TEXT | Razorpay order reference |

| razorpay_payment_id | TEXT | Successful payment reference |

| created_at | TIMESTAMPTZ | Order creation time |

| updated_at | TIMESTAMPTZ | Last update |





| Column | Type / Meaning | Notes |

| --- | --- | --- |

| id | UUID/INT | Primary key |

| order_id | FK | References orders.id |

| product_id | FK | References products.id |

| product_name | TEXT | Historical snapshot |

| product_image | TEXT | Historical snapshot |

| price | NUMERIC | Historical purchase price |

| quantity | INTEGER | Purchased quantity |

| subtotal | NUMERIC | price × quantity |





| Area | Errors to handle | UI response |

| --- | --- | --- |

| Auth | Invalid credentials, duplicate email, weak password, expired session | Toast/form message |

| Products | Not found, out of stock, load failure | Empty/error state + toast |

| Payment | Failed, cancelled, verification failure | Payment error state; do not create a falsely paid order |

| Orders | Create/load failure, unauthorized access | Toast/error state |





| Requirement | Technical completion condition |

| --- | --- |

| Signup/Login/Logout | Supabase Auth works and session/role routing is correct. |

| Products | Public users can list/search/filter/view product details. |

| Cart | Users can add/update/remove items and calculate totals. |

| Checkout | Required shipping/customer data is validated and submitted. |

| Razorpay | Payment order is created through trusted logic and verified server-side. |

| Orders | Verified orders and order_items are stored with payment/order status. |

| My Orders | Customer can only see their own orders. |

| Admin Products | Admin can add/edit/delete/list products with Storage images. |

| Admin Orders | Admin can view details and change order status. |

| Security | RLS prevents unauthorized product/order/admin operations. |
