# 🍲 Cloud Kitchen — Multi-Tenant Direct Ordering Platform

> **Empowering Indian restaurants and cloud kitchens to reclaim their customer relationships, retain their 25–35% margins, and operate with a modern, high-resilience tech stack.**

---

## 📌 Project Overview
**Cloud Kitchen** is a high-performance, multi-tenant eCommerce and kitchen management platform tailored for the Indian food service market. By offering white-label mobile storefronts, a real-time Kitchen Display System (KDS) with thermal receipt printing, automated 3PL logistics dispatch, and WhatsApp-powered reorder campaigns, we give food operators an escape route from heavy aggregator commissions.

---

## 📑 Core Documentation Index

All strategy, market insights, and architecture specs are organized inside the [`.agents/context/`](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context) directory:

| Document | Key Highlights |
| :--- | :--- |
| **[AGENTS.md](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/AGENTS.md)** | AI assistant guardrails, rules, and workspace context |
| **[MVP & Customer App Spec](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/MVP_AND_CUSTOMER_APP_SPEC.md)** | Restobite-in-a-box for 1 restaurant, PWA flows, 3PL dispatch, live status |
| **[Project Vision & Strategy](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/PROJECT_VISION.md)** | Ordrio playbook decode, multi-tenant vertical presets, sales conversion scripts |
| **[Market Reality (India 2026)](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/MARKET_REALITY_INDIA_2026.md)** | Swiggy/Zomato take-rates, ₹17.58 fee hike, ONDC landscape, hybrid shift strategy |
| **[Business Model & Pricing](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/BUSINESS_MODEL_AND_PRICING.md)** | Model A (SaaS) vs Model B (Marketplace), RBI PA compliance, Delhi GTM |
| **[Technical Architecture](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/TECHNICAL_ARCHITECTURE.md)** | Multi-tenancy, 4 surfaces (Storefront, KDS, Owner, Admin), State machine |
| **[Delivery Logistics](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/DELIVERY_LOGISTICS.md)** | 3PL APIs (Shadowfax, Borzo, Porter), multi-provider fallback waterfall |
| **[Risk Register](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/RISK_REGISTER.md)** | 6 critical risk factors and concrete operational mitigations |
| **[90-Day Roadmap](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/ROADMAP_90_DAYS.md)** | 4-phase execution plan from validation to 15+ paying outlets |

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Database**: PostgreSQL with Row-Level Security (RLS) & Multi-Tenant `tenant_id` scoping
- **Real-Time Layer**: WebSockets & Server-Sent Events (SSE) with offline polling fallback
- **Payments**: Direct Merchant Razorpay / Cashfree / UPI Intent
- **Hardware Integration**: WebUSB / Bluetooth ESC/POS 58mm/80mm thermal receipt printing
- **Logistics**: Shadowfax / Borzo / Porter / Shiprocket Quick API adapters
- **Messaging**: WhatsApp Business Cloud API (Gupshup / AiSensy)

---

## 🚀 Quickstart

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
