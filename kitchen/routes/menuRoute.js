import express from "express";
import { 
    getMenuCategories, getMenuFoods, 
    addCategory, updateCategory, deleteCategory,
    addFood, updateFood, deleteFood 
} from "../controllers/menuController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/user.js";

const router = express.Router();

// Public read endpoints
router.get("/categories", getMenuCategories);
router.get("/foods", getMenuFoods);

// Protected Admin mutations
router.post("/categories", isAuthenticated, authorizeRoles("admin"), addCategory);
router.put("/categories/:id", isAuthenticated, authorizeRoles("admin"), updateCategory);
router.delete("/categories/:id", isAuthenticated, authorizeRoles("admin"), deleteCategory);

router.post("/foods", isAuthenticated, authorizeRoles("admin"), addFood);
router.put("/foods/:id", isAuthenticated, authorizeRoles("admin"), updateFood);
router.delete("/foods/:id", isAuthenticated, authorizeRoles("admin"), deleteFood);

export default router;
