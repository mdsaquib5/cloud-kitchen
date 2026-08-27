import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String },
            address: { type: String },
            landmark: { type: String },
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
            enum: ["PLACED", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
            default: "PLACED",
        },
        totals: {
            subtotal: Number,
            deliveryFee: Number,
            platformFee: Number,
            tax: Number,
            discount: Number,
            grandTotal: Number,
        }
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
