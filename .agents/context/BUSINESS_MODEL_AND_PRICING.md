# 💰 Business Model, Legal Structure & Pricing

## 1. The Architectural & Legal Fork: Model A vs. Model B

Selecting the correct legal and operational model is critical for avoiding regulatory traps.

```mermaid
flowchart TD
    Customer([Customer]) -->|Orders on Storefront| Platform[Cloud Kitchen Platform]
    
    subgraph Model_A ["Model A: White-Label SaaS (Selected Path)"]
        Platform -->|Direct UPI/Card Payment| MerchantPG[Restaurant's Razorpay / Cashfree]
        MerchantPG -->|Settles directly to| RestaurantBank[Restaurant Bank Account]
        Platform -.->|Software Subscription / Flat fee| OurAccount[Platform Revenue]
    end
    
    subgraph Model_B ["Model B: Marketplace (High Risk / Avoid)"]
        Platform -->|Central Payment Collection| CentralEscrow[Central Platform Account]
        CentralEscrow -->|Pays CGST Sec 9-5 in Cash & Net Payout| RestaurantBank2[Restaurant Bank]
        CentralEscrow -->|Requires RBI PA License (₹15-25 Cr Net Worth)| RegBarrier[RBI Regulatory Block]
    end
```

### Comparative Analysis:

| Feature | Model A: White-Label SaaS *(Our Choice)* | Model B: Central Marketplace *(Avoid)* |
| :--- | :--- | :--- |
| **Merchant of Record** | Individual Restaurant | Our Platform (E-Commerce Operator) |
| **Payment Routing** | Direct to Restaurant PG (or Razorpay Route / Cashfree Easy Split) | Central pooling into platform account |
| **RBI PA License** | **Not Required** (Pure tech enabler) | **Mandatory** (₹15 Cr to ₹25 Cr net worth threshold) |
| **GST Liability** | Restaurant handles its own GST | Under CGST Sec 9(5), platform must pay GST in cash with no ITC offset |
| **Network Effect** | Restaurant-specific (augmented via ONDC) | Shared marketplace catalog |

> [!IMPORTANT]
> **Decision**: Operate strictly under **Model A**. If split-settlements are implemented for per-order fee automation, use authorized mechanisms like *Razorpay Route* or *Cashfree Easy Split* with explicit partner agreement.

---

## 2. Realistic Pricing Models

In India, small restaurants and cloud kitchens exhibit a willingness to pay anchored at **₹1,000 – ₹3,000 / month** per outlet.

### Our Tiered Pricing Structure:

1. **Starter Hybrid Plan**:
   - **Monthly Base**: ₹999 / month
   - **Commission**: 2.5% of GMV
   - *Pitch*: "One-tenth of what Swiggy charges you."

2. **Per-Order Flat Plan**:
   - **Monthly Base**: ₹499 / month
   - **Per Order**: ₹7.00 flat per fulfilled order
   - *Pitch*: "Less than half the ₹17.58 platform fee alone."

3. **One-Time Onboarding & Setup Package** (₹3,500 – ₹5,000 one-time):
   - Swiggy/Zomato menu import & item categorization.
   - Food photography touch-ups & high-res banner design.
   - Google Business Profile (GBP) "Order Online" link setup.
   - Physical table QR standees and delivery bag insert cards.

---

## 3. Go-To-Market (GTM) Strategy: Delhi Local Beachhead

1. **Single Micro-Market Focus**: Target a tight 2–3 km radius (e.g., Lajpat Nagar, Malviya Nagar, or Rohini) where physical visits and rapid support are possible in < 20 minutes.
2. **Ideal Beachhead Profiles**:
   - High-footfall QSRs and casual dining cafés (QR table ordering captures the initial customer database).
   - Tiffin & meal-box subscription services (recurring predictability).
   - Popular local bakeries & shawarma/biryani spots with existing WhatsApp/phone ordering habits.
3. **The Settlement Statement Pitch**:
   - Walk in and request the owner's last month Swiggy/Zomato payout report.
   - Calculate their **Effective Deduction Rate** (Net Payout ÷ Gross Order Value).
   - Show in black-and-white how much money was lost, and how 20% order migration covers their rent.
4. **Google Business Profile (GBP) Lever**:
   - Set the restaurant's direct ordering URL inside the official GBP "Order Online" button.
   - Generates free, high-intent orders from users already searching for the restaurant by name.
