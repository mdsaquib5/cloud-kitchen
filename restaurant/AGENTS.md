# AGENTS.md — Cloud Kitchen AI Assistant Guidelines

## 🍽️ Project Context
**Cloud Kitchen** is a multi-tenant direct-ordering and kitchen management platform designed specifically for Indian restaurants, cloud kitchens, QSRs, and bakeries. It provides an escape hatch from 25–35% aggregator commissions (Swiggy/Zomato) by offering white-label mobile-first storefronts, real-time Kitchen Display Systems (KDS) with thermal ESC/POS printing, multi-provider 3PL delivery dispatch, WhatsApp-driven reorder loops, and ONDC seller network integration.

---

## 🏛️ Architectural Guardrails

### 1. Multi-Tenancy from Day One
- Every database query and model must be strictly scoped by `tenant_id` (PostgreSQL Row-Level Security).
- One codebase powers all vertical storefronts (cloud kitchens, tiffin services, bakeries, dine-in QR).
- Custom domains & subdomains (`restaurant.domain.com`) map dynamically to tenant configs.

### 2. Business Model: Model A (White-Label SaaS)
- The restaurant is the merchant of record (using their direct Razorpay/Cashfree/UPI merchant accounts).
- **Never pool customer funds centrally** without split settlements (avoids RBI Payment Aggregator licensing requirements and CGST Sec 9(5) aggregator liabilities).

### 3. Kitchen Display & Thermal Printing
- The KDS tablet view is critical: loud persistent audio alerts, large touch targets, automatic thermal receipt printing (ESC/POS 58mm/80mm over local network bridge/WebUSB).
- Reliable state machine: `PLACED` → `ACCEPTED` → `PREPARING` → `READY` → `RIDER_ASSIGNED` → `PICKED` → `DELIVERED`.

### 4. Real-time Resilience
- Delhi/Indian restaurant Wi-Fi drops frequently: use WebSocket/SSE with automatic reconnection and fallback polling to prevent missed orders.
- Unaccepted order escalation: auto-alarm/WhatsApp trigger if an order remains unaccepted for > 60 seconds.

### 5. Delivery Logistics (3PL Fallback)
- Multi-provider dispatch waterfall: Shadowfax / Borzo / Porter / Shiprocket Quick.
- If primary 3PL does not assign a rider within 90s, cascade to secondary provider, then restaurant self-fleet.

---

## 📚 Strategy & Context Index
All context and strategy documents are located in [`.agents/context/`](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context):
- [MVP & Customer Ordering App Specification](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/MVP_AND_CUSTOMER_APP_SPEC.md)
- [Project Vision & Strategy](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/PROJECT_VISION.md)
- [Market Reality & Competitor Landscape (India 2026)](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/MARKET_REALITY_INDIA_2026.md)
- [Business Model, Pricing & Legal](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/BUSINESS_MODEL_AND_PRICING.md)
- [Technical Architecture & State Machine](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/TECHNICAL_ARCHITECTURE.md)
- [Delivery Logistics & 3PL Strategy](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/DELIVERY_LOGISTICS.md)
- [Risk Register & Mitigations](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/RISK_REGISTER.md)
- [90-Day Execution Roadmap](file:///c:/Users/mdsaq/OneDrive/Desktop/kitchen/.agents/context/ROADMAP_90_DAYS.md)
