# PRD — Gift & Flower E-commerce Website

**Version:** 1.0  
**Product Type:** Simple Gift & Flower E-commerce Website  
**Primary Users:** Customers and Admin  
**Suggested Stack:** React.js + Supabase + Razorpay  
**Document Status:** MVP / Development Ready

---

## 1. Product Overview

Build a simple e-commerce website for selling **gift and flower products**.

The website will have two major areas:

1. **Customer Website**
2. **Admin Dashboard**

Customers can browse products, search/filter products, create an account, add products to cart, checkout, make payment through Razorpay, and view their orders.

Admins can manage products and orders from a simple admin dashboard.

---

# 2. Goals

### Primary Goals

- Allow customers to browse gift and flower products.
- Allow customers to search and filter products.
- Allow customers to register, login, and logout.
- Allow customers to manage their cart.
- Allow customers to place orders.
- Integrate Razorpay for online payments.
- Allow customers to view their previous orders.
- Allow admins to add, edit, and delete products.
- Allow admins to view and update orders.
- Keep the application simple and easy to maintain.

### Non-Goals for MVP

The first version will NOT require:

- Multiple vendors/sellers
- Product reviews and ratings
- Coupons/discount engine
- Loyalty points
- Advanced analytics
- Multiple admin permission levels
- Wishlist synchronization across devices
- Complex inventory management
- Multiple payment providers

---

# 3. User Roles

## 3.1 Customer

A customer can:

- Sign up
- Login
- Logout
- View products
- Search products
- Filter products by category
- View product details
- Add products to cart
- Remove products from cart
- Change cart quantity
- Checkout
- Make Razorpay payment
- View order history
- View order details

## 3.2 Admin

An admin can:

- Login
- Access Admin Dashboard
- Add product
- Edit product
- Delete product
- View all products
- View all customer orders
- View order details
- Change order status

Admin order statuses:

```text
Pending
Confirmed
Shipped
Delivered
Cancelled
```

---

# 4. Customer-Side Pages

## 4.1 Home Page

### Requirements

- Website header/navbar
- Logo
- Search
- Product categories
- Featured products
- Latest products
- Call-to-action sections
- Footer

### Navbar

```text
Logo
Home
Products
Search
Cart
Wishlist (Optional)
Login / Account
```

---

## 4.2 Products Page

Display all available products.

Each product card should contain:

- Product image
- Product name
- Price
- Category
- Add to Cart button
- View Details button

Optional:

- Wishlist button
- Discount price
- Stock status

---

## 4.3 Product Details Page

Display:

- Product image
- Product name
- Price
- Description
- Category
- Available stock
- Quantity selector
- Add to Cart button
- Buy Now button (optional)

---

## 4.4 Search

Customer can search products by:

- Product name
- Product description

Example:

```text
Search: Rose

Results:
- Red Rose Bouquet
- Premium Rose Basket
- Rose Gift Box
```

---

## 4.5 Category Filter

Suggested categories:

```text
Flowers
Bouquets
Gift Hampers
Cakes
Teddy Bears
Chocolate Gifts
Birthday Gifts
Anniversary Gifts
Other
```

Admin should be able to assign a category to each product.

---

# 5. Authentication

Authentication will be handled using **Supabase Authentication**.

## 5.1 Signup

Customer enters:

```text
Full Name
Email
Password
Confirm Password
```

After successful signup:

```text
Account Created
→ Login / Automatic Login
→ Customer Website
```

---

## 5.2 Login

Customer enters:

```text
Email
Password
```

Successful login:

```text
Login
→ Fetch User Profile
→ Check Role
→ Redirect
```

Customer:

```text
→ Home / Products
```

Admin:

```text
→ Admin Dashboard
```

---

## 5.3 Logout

Logout should:

- Clear the authenticated session
- Clear user state
- Redirect to Home/Login

---

# 6. User Profile

Create a user profile record associated with the Supabase authenticated user.

Suggested fields:

```text
id
user_id
full_name
email
phone
created_at
```

The authenticated user's ID should be used as the relationship between Supabase Auth and the profile.

---

# 7. Cart

The cart should contain:

```text
Product
Quantity
Price
Subtotal
```

Example:

```text
Red Rose Bouquet
₹599 × 2
Subtotal: ₹1198
```

Cart page:

```text
Product
Price
Quantity
Subtotal
Remove
```

Order summary:

```text
Subtotal
Delivery Charge
Total
```

### MVP Cart Recommendation

For a simple implementation, the cart can initially be stored on the frontend using React state/context and localStorage.

This avoids requiring a separate cart database table for the MVP.

---

# 8. Checkout

Checkout should collect:

```text
Full Name
Phone
Email
Address
City
State
Pincode
```

Order summary:

```text
Products
Subtotal
Delivery Charge
Grand Total
```

Then:

```text
Proceed to Payment
```

---

# 9. Razorpay Payment

Razorpay will be used for online payments.

### Important Security Requirement

Razorpay payment creation and verification should NOT rely only on frontend code.

Recommended flow:

```text
Customer
   ↓
Checkout
   ↓
Backend / Supabase Edge Function
   ↓
Create Razorpay Order
   ↓
Razorpay Checkout
   ↓
Customer Pays
   ↓
Razorpay Response
   ↓
Backend / Edge Function Verification
   ↓
Payment Verified
   ↓
Create / Confirm Order
```

Never store:

- Razorpay secret key
- Other private API credentials

inside React frontend code.

---

# 10. Orders

An order should contain:

```text
Order ID
Customer ID
Customer Name
Phone
Email
Shipping Address
Subtotal
Delivery Charge
Total Amount
Payment Status
Order Status
Razorpay Order ID
Razorpay Payment ID
Created At
```

## Order Status

```text
Pending
Confirmed
Shipped
Delivered
Cancelled
```

## Payment Status

Recommended values:

```text
Pending
Paid
Failed
Refunded
```

---

# 11. My Orders

Customer can view their previous orders.

Example:

```text
My Orders

Order #ORD-1001
₹1,299
Payment: Paid
Status: Confirmed
Date: 08 Oct 2026
View Details
```

Order details should show:

- Order ID
- Products
- Quantity
- Price
- Shipping address
- Total
- Payment status
- Order status
- Order date

---

# 12. Admin Dashboard

Admin dashboard should be simple.

### Dashboard

```text
Admin Dashboard

Total Products
Total Orders
Pending Orders
Delivered Orders
```

Optional for MVP.

---

# 13. Admin Product Management

## View Products

Admin can see:

```text
Product Image
Product Name
Category
Price
Stock
Actions
```

Actions:

```text
Edit
Delete
```

---

## Add Product

Admin form:

```text
Product Name
Description
Price
Category
Stock
Product Image
Featured
```

Example:

```text
Name: Red Rose Bouquet
Price: ₹599
Category: Flowers
Stock: 25
Image: product-image
Featured: Yes
```

---

## Edit Product

Admin can update:

```text
Name
Description
Price
Category
Stock
Image
Featured
```

---

## Delete Product

Admin can delete a product.

Recommended:

```text
Delete
→ Confirmation Dialog
→ Delete Product
```

If a product has already been included in previous orders, its historical order item data should remain available.

---

# 14. Admin Order Management

Admin can view all orders.

Example:

```text
Order ID
Customer
Amount
Payment Status
Order Status
Date
Actions
```

Admin can open an order and view:

```text
Customer Details
Products
Quantity
Shipping Address
Payment Details
Order Status
```

Admin can change status:

```text
Pending
↓
Confirmed
↓
Shipped
↓
Delivered
```

Admin may also mark an order as:

```text
Cancelled
```

---

# 15. Recommended Database Schema

## 15.1 profiles

```text
id
user_id
full_name
email
phone
role
created_at
```

Role:

```text
customer
admin
```

---

## 15.2 categories

```text
id
name
slug
created_at
```

Example:

```text
Flowers
Bouquets
Gift Hampers
Cakes
Teddy Bears
Chocolate Gifts
Birthday Gifts
Anniversary Gifts
```

---

## 15.3 products

```text
id
name
slug
description
price
category_id
image_url
stock
featured
created_at
updated_at
```

---

## 15.4 orders

```text
id
user_id
customer_name
phone
email
address
city
state
pincode
subtotal
delivery_charge
total_amount
payment_status
order_status
razorpay_order_id
razorpay_payment_id
created_at
updated_at
```

---

## 15.5 order_items

```text
id
order_id
product_id
product_name
product_image
price
quantity
subtotal
```

### Important

Store `product_name`, `product_image`, and `price` inside `order_items`.

This preserves historical order information even if the product is later edited or deleted.

---

# 16. Wishlist — Optional

Wishlist is optional for MVP.

If implemented:

```text
wishlist
---------
id
user_id
product_id
created_at
```

Customer can:

```text
Add to Wishlist
Remove from Wishlist
View Wishlist
Move to Cart
```

---

# 17. Supabase Configuration

For this project, recommended Supabase setup:

```text
Data API: ON
Automatically expose new tables: OFF
Automatic RLS: ON
```

Because the application will use `supabase-js`, the Data API should be enabled.

New tables should preferably be exposed manually so access can be controlled table-by-table.

RLS should be enabled to protect customer and admin data.

---

# 18. RLS Requirements

## Products

Public users can:

```text
SELECT products
```

Only admins can:

```text
INSERT
UPDATE
DELETE
```

## Profiles

Customer can:

```text
SELECT own profile
UPDATE own profile
```

Admin can access profiles as required by the admin dashboard.

## Orders

Customer can:

```text
SELECT own orders
CREATE own orders
```

Customer must NOT be able to:

```text
View another customer's orders
Change order status
Change payment status
```

Admin can:

```text
SELECT all orders
UPDATE order status
```

Payment-related fields should be controlled by trusted backend/server-side logic rather than arbitrary frontend updates.

---

# 19. Admin Authorization

Do NOT rely only on hiding the Admin page in React.

The frontend can check:

```text
profile.role === "admin"
```

But database-level RLS policies must also enforce admin permissions.

Example logic:

```text
User Login
    ↓
Get authenticated user
    ↓
Get profile
    ↓
Check role
    ↓
customer → Customer UI
admin → Admin UI
```

Database policies should independently verify the user's admin role.

---

# 20. Image Management

Product images can be stored using **Supabase Storage**.

Suggested bucket:

```text
product-images
```

Admin uploads:

```text
Image
↓
Supabase Storage
↓
Image URL
↓
products.image_url
```

For MVP, one main product image can be supported initially.

Multiple product images can be added later.

---

# 21. Frontend Structure

Suggested React structure:

```text
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── SearchBar.jsx
│   └── ProtectedRoute.jsx
│
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
│
├── admin/
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AddProduct.jsx
│   ├── EditProduct.jsx
│   └── AdminOrders.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
│
├── services/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── payment.js
│
├── lib/
│   └── supabase.js
│
└── App.jsx
```

---

# 22. Main User Flow

## Customer Flow

```text
Home
 ↓
Products
 ↓
Product Details
 ↓
Add to Cart
 ↓
Cart
 ↓
Checkout
 ↓
Login / Signup if required
 ↓
Enter Address
 ↓
Razorpay Payment
 ↓
Payment Verification
 ↓
Order Created
 ↓
Order Confirmation
 ↓
My Orders
```

---

# 23. Admin Flow

```text
Admin Login
 ↓
Admin Dashboard
 ↓
Manage Products
 ├── Add Product
 ├── Edit Product
 └── Delete Product
 ↓
Manage Orders
 ↓
View Order
 ↓
Change Status
 ├── Pending
 ├── Confirmed
 ├── Shipped
 ├── Delivered
 └── Cancelled
```

---

# 24. Protected Routes

Customer-only routes:

```text
/checkout
/my-orders
/my-orders/:id
```

Admin-only routes:

```text
/admin
/admin/products
/admin/products/add
/admin/products/edit/:id
/admin/orders
```

Public routes:

```text
/
/products
/products/:id
/login
/signup
```

---

# 25. Error Handling

The application should handle:

### Authentication Errors

```text
Invalid email/password
Email already registered
Weak password
Session expired
```

### Product Errors

```text
Product not found
Out of stock
Failed to load products
```

### Payment Errors

```text
Payment failed
Payment cancelled
Payment verification failed
```

### Order Errors

```text
Failed to create order
Failed to load order
Unauthorized order access
```

Use user-friendly toast/error messages.

---

# 26. Basic Validation

### Signup

```text
Name required
Valid email required
Password required
Password confirmation must match
```

### Product

```text
Name required
Price must be greater than 0
Stock cannot be negative
Category required
Image required
```

### Checkout

```text
Name required
Phone required
Address required
City required
State required
Pincode required
```

---

# 27. Security Requirements

- Supabase RLS must be enabled.
- Admin operations must be protected by RLS.
- Razorpay secret key must never be exposed in frontend code.
- Payment signatures must be verified server-side.
- Customers must only access their own orders.
- Admin routes must be protected.
- Do not trust frontend role checks alone.
- Validate all important data server-side.
- Do not allow customers to modify order/payment status directly.

---

# 28. MVP Acceptance Criteria

The project will be considered complete when:

### Customer

- [ ] Customer can signup.
- [ ] Customer can login.
- [ ] Customer can logout.
- [ ] Customer can view products.
- [ ] Customer can search products.
- [ ] Customer can filter products by category.
- [ ] Customer can view product details.
- [ ] Customer can add products to cart.
- [ ] Customer can update cart quantity.
- [ ] Customer can remove products from cart.
- [ ] Customer can checkout.
- [ ] Customer can enter shipping information.
- [ ] Customer can pay through Razorpay.
- [ ] Payment is verified securely.
- [ ] Customer can view their orders.
- [ ] Customer cannot view another customer's orders.

### Admin

- [ ] Admin can login.
- [ ] Admin can access dashboard.
- [ ] Admin can add products.
- [ ] Admin can edit products.
- [ ] Admin can delete products.
- [ ] Admin can view all products.
- [ ] Admin can view all orders.
- [ ] Admin can view order details.
- [ ] Admin can change order status.
- [ ] Non-admin users cannot access admin functionality.

---

# 29. Future Features

After the MVP, the following can be added:

```text
Wishlist
Product Reviews
Ratings
Coupons
Discounts
Inventory Alerts
Multiple Product Images
Order Tracking
Email Notifications
WhatsApp Order Notifications
SMS Notifications
Delivery Partner Integration
COD
Advanced Admin Analytics
Sales Reports
Customer Management
Return / Refund System
```

---

# 30. Final MVP Scope

The first version should focus on:

```text
CUSTOMER
├── Home
├── Products
├── Search
├── Category Filter
├── Product Details
├── Cart
├── Signup
├── Login
├── Logout
├── Checkout
├── Razorpay Payment
└── My Orders

ADMIN
├── Dashboard
├── Add Product
├── Edit Product
├── Delete Product
├── View Products
├── View Orders
└── Change Order Status
```

### Core Technology

```text
Frontend: React.js
Authentication: Supabase Auth
Database: Supabase PostgreSQL
Storage: Supabase Storage
API: Supabase Data API
Security: Supabase RLS
Payment: Razorpay
Payment Verification: Backend / Supabase Edge Function
```

### Recommended Development Order

```text
1. Supabase Project
2. Database Tables
3. RLS Policies
4. Supabase Auth
5. React Auth Context
6. Product CRUD
7. Customer Product Pages
8. Cart
9. Checkout
10. Razorpay Integration
11. Order Creation
12. My Orders
13. Admin Dashboard
14. Admin Order Management
15. Testing
16. Deployment
```
