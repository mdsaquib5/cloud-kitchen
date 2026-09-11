import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            index: true,
        },
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String },
            address: { type: String },       // Reverse geocoded address (from GPS)
            addressLine: { type: String },   // User-typed full address
            landmark: { type: String },      // User-typed landmark
            latitude: { type: String },      // GPS latitude
            longitude: { type: String },     // GPS longitude
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
                title: String,
                image: String,
                quantity: Number,
                unitPrice: Number,
                portion: String,
                portionLabel: String,
                addons: [
                    {
                        name: String,
                        price: Number,
                    }
                ],
                cookingNote: String,
            }
        ],
        orderType: {
            type: String,
            enum: ["delivery", "takeaway", "dine-in"],
            default: "delivery",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "online"],
            default: "cash",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        status: {
            type: String,
            enum: [
                "PENDING_PAYMENT",
                "PLACED",
                "CONFIRMED",
                "PREPARING",
                "READY_FOR_PICKUP",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PLACED",
            index: true,
        },
        totals: {
            subtotal: Number,
            deliveryFee: Number,
            platformFee: Number,
            tax: Number,
            discount: Number,
            grandTotal: Number,
        },
        courierInfo: {
            name:      { type: String, default: null },
            phone:     { type: String, default: null },
            photo_url: { type: String, default: null },
        },

        // Generic Delivery Fields (works for Pidge, Borzo, or any future partner)
        deliveryPartner: { type: String, enum: ["borzo", "pidge", null], default: null },
        externalOrderId: { type: String, default: null, index: true },
        trackingUrl:     { type: String, default: null },
        dispatchedAt:    { type: Date, default: null },
        deliveryCost:    { type: Number, default: null },
    },
    { timestamps: true }
);

// Compound indexes for optimized kitchen dashboard & user past orders queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
