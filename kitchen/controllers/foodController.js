import Food from "../models/foodModel.js";
import slugify from "slugify";

export const createFood = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ success: false, message: "Title is required" });

        const slug = slugify(title, { lower: true }) + "-" + Date.now().toString().slice(-4);
        const food = await Food.create({ ...req.body, slug });
        res.status(201).json({ success: true, food });
    } catch (error) { next(error); }
};

export const getFoods = async (req, res, next) => {
    try {
        const query = req.query.category ? { category: req.query.category } : {};
        const foods = await Food.find(query).populate("category", "title slug");
        res.status(200).json({ success: true, foods });
    } catch (error) { next(error); }
};

export const updateFood = async (req, res, next) => {
    try {
        const { title } = req.body;
        let updateData = { ...req.body };
        if (title) updateData.slug = slugify(title, { lower: true }) + "-" + Date.now().toString().slice(-4);

        const food = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate("category", "title slug");
        if (!food) return res.status(404).json({ success: false, message: "Food not found" });

        res.status(200).json({ success: true, food });
    } catch (error) { next(error); }
};

export const deleteFood = async (req, res, next) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) return res.status(404).json({ success: false, message: "Food not found" });
        res.status(200).json({ success: true, message: "Food deleted" });
    } catch (error) { next(error); }
};
