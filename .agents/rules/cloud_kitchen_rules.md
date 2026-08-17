# Cloud Kitchen — Development & Engineering Rules

## 1. Code Quality & Stack Standards
- **Framework**: Next.js (App Router), React 19, JavaScript/TypeScript.
- **Styling**: Clean, performant Vanilla CSS / CSS Modules with bespoke design tokens (premium dark/light UI, fast render, mobile-first responsive).
- **State Management**: Predictable state transitions for orders; optimistic updates with offline queue fallback.
- **Idempotency**: All payment webhooks, order creation calls, and 3PL dispatch triggers MUST enforce idempotency keys to avoid double-charging or duplicate riders.

## 2. Multi-Tenant Data Isolation
- Tables MUST have `tenant_id` column indexed.
- Never write queries without scoping by `tenant_id` from the authenticated session or tenant resolver.
- Storefront routes dynamically resolve tenant from hostname (subdomain or custom domain header).

## 3. UI/UX Principles
- **Customer Storefront**: Lightweight PWA, < 2s load time on 4G, seamless UPI Intent checkout (`gpay://`, `phonepe://`, `paytm://`), zero mandatory account creation (OTP-based checkout).
- **Kitchen Display System (KDS)**: High contrast, high visibility, sound buzzer (Web Audio API loop until tapped), one-tap prep time adjustments (+10m, +20m), quick "Item Sold Out" (paneer khatam) toggle.
- **Owner Dashboard**: Real-time sales metrics, order history, menu management with variant/add-on matrix, delivery radius setup, WhatsApp campaign launcher.

## 4. Third-Party Integrations
- **Payments**: Direct merchant Razorpay / Cashfree / PayU / UPI QR.
- **WhatsApp**: Cloud API / Gupshup / Interakt / AiSensy for instant receipt, live tracking link, and automated reorder sequences.
- **Logistics**: Modular 3PL adapter interface (Shadowfax, Borzo, Porter, Shiprocket Quick).
