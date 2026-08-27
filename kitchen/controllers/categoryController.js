import Food from "../models/foodModel.js";
import Category from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategory = async (req, res, next) => {
    try {
        const { title, image } = req.body;
        if (!title || !image) return res.status(400).json({ success: false, message: "Title and Image are required" });

        const slug = slugify(title, { lower: true });
        const exists = await Category.findOne({ slug });
        if (exists) return res.status(400).json({ success: false, message: "Category already exists" });

        const category = await Category.create({ title, slug, image });
        res.status(201).json({ success: true, category });
    } catch (error) { next(error); }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
    } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { title } = req.body;
        let updateData = { ...req.body };
        if (title) updateData.slug = slugify(title, { lower: true });

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });

        res.status(200).json({ success: true, category });
    } catch (error) { next(error); }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        
        // Delete all foods associated with this category
        await Food.deleteMany({ category: req.params.id });
        
        res.status(200).json({ success: true, message: "Category and associated dishes deleted" });
    } catch (error) { next(error); }
};
