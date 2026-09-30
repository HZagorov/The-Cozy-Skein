# 🧶 The Cozy Skein — Artisanal Yarns & Handknits E-Commerce

A full-stack, boutique e-commerce web platform specializing in ethically sourced, botanical hand-dyed natural yarns (merino, alpaca, silk) and heirloom hand-knitted accessories (beanies, scarves, cardigans, mittens, wooden needles).

Built with **Next.js 13 App Router**, **TypeScript**, **Tailwind CSS**, and **SQLite (`better-sqlite3`)**.

---

## ✨ Features

- **Artisanal Product Catalog**:
  - Categories: *Hand-Dyed Yarns*, *Beanies & Caps*, *Warm Scarves & Shawls*, *Heirloom Sweaters*, *Mittens & Socks*, *Rosewood Tools*.
  - Full fiber specifications: fiber composition, yarn weight (DK, Worsted, Fingering, Chunky, Lace), yardage/skein weight, recommended needles/hooks, tension/gauge, care notes.
  - Interactive multi-criteria filtering by category, yarn weight, in-stock availability, price range, and instant search query.
- **Product Detail Experience**:
  - Image gallery with thumbnail selection.
  - Colorway swatches & size/bundle selectors.
  - Verified customer reviews with dynamic star rating calculations.
  - Customer review submission form.
- **Persistent Shopping Cart & Drawer**:
  - Slide-over cart drawer with quantity adjustments and item deletion.
  - Dedicated full cart page.
  - Dynamic Free Shipping progress meter (Free shipping over $75).
  - Promo code discounts engine (test with `WARMTH10`, `FIRSTKNIT`, or `COZY20`).
- **Multi-Step Checkout Simulation**:
  - Shipping address and contact information (with 1-click test data auto-fill).
  - Delivery method selection (Standard Studio Delivery vs Priority Express).
  - Payment simulation with live card validation (sandbox mode).
  - Order confirmation screen with celebratory confetti, printable receipt, and unique order tracking ID.
  - Stock auto-deduction upon successful checkout.
- **Customer Account Portal**:
  - View order history with fulfillment statuses (*Knitting & Packing*, *In Transit*, *Delivered*).
  - Live tracking numbers and order receipt review.
- **Admin Dashboard (`/admin`)**:
  - Real-time studio KPI metrics: Total Revenue, Total Orders, Total Products, Low Stock Alerts.
  - Product management: Add new products with full fiber specs, edit prices/inventory, and remove items.
  - Order fulfillment management: Update statuses (*Processing*, *Knitting in Progress*, *Packed*, *Shipped*, *Delivered*).
  - Restock alert tab with 1-click "+15 Fresh Skeins" quick replenishment.
- **Educational Knitter Guides**:
  - Craft Yarn Council (CYC) yarn weight chart.
  - Needle conversion table & gauge swatching tips.
  - Wool washing, soaking, and towel-blocking care guide.

---

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your web browser.

### 2. Demo Accounts (1-Click Test Available in UI)
- **Customer Account**:
  - Email: `emma@knitlover.com`
  - Password: `password123`
  - *Has pre-seeded order history and review history.*
- **Admin Account**:
  - Email: `admin@thecozyskein.com`
  - Password: `admin123`
  - *Full access to `/admin` dashboard, product CRUD, and order fulfillment.*

### 3. Re-seed Database
To reset the SQLite database (`data/store.db`) to initial catalog items and sample orders:
```bash
npm run seed
```

### 4. Coupon Codes to Test
- `WARMTH10`: 10% discount on order subtotal
- `COZY20`: 20% discount on order subtotal
- `FIRSTKNIT`: Free standard shipping
