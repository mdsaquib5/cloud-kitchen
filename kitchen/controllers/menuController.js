import Food from "../models/foodModel.js";
import Category from "../models/categoryModel.js";

export const getMenuCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        next(error);
    }
};

export const getMenuFoods = async (req, res, next) => {
    try {
        const foods = await Food.find({ inStock: true }).populate("category", "title slug image");
        res.status(200).json({ success: true, foods });
    } catch (error) {
        next(error);
    }
};

export const addCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, category });
    } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, category });
    } catch (error) { next(error); }
};

export const deleteCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) { next(error); }
};

export const addFood = async (req, res, next) => {
    try {
        const food = await Food.create(req.body);
        res.status(201).json({ success: true, food });
    } catch (error) { next(error); }
};

export const updateFood = async (req, res, next) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, food });
    } catch (error) { next(error); }
};

export const deleteFood = async (req, res, next) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Food deleted" });
    } catch (error) { next(error); }
};
