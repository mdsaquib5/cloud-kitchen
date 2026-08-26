import express from "express";
import { 
    getMenuCategories, getMenuFoods, 
    addCategory, updateCategory, deleteCategory,
    addFood, updateFood, deleteFood 
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/categories", getMenuCategories);
router.post("/categories", addCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/foods", getMenuFoods);
router.post("/foods", addFood);
router.put("/foods/:id", updateFood);
router.delete("/foods/:id", deleteFood);

export default router;
