import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    allowInstructions: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    portions: [
        {
            portionName: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],
    addOns: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

export default mongoose.models.Food || mongoose.model("Food", foodSchema);
