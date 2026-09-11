import express from "express";
import { createFood, getFoods, updateFood, deleteFood } from "../controllers/foodController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/user.js";

const router = express.Router();

router.get("/", getFoods);
router.post("/", isAuthenticated, authorizeRoles("admin"), createFood);
router.put("/:id", isAuthenticated, authorizeRoles("admin"), updateFood);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteFood);

export default router;
