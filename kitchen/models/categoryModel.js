import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Category title is required"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    image: {
        type: String,
        required: [true, "Category image is required"]
    }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
