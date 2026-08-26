import express from "express";
import { createFood, getFoods, updateFood, deleteFood } from "../controllers/foodController.js";


const router = express.Router();

router.get("/", getFoods);
router.post("/", createFood);
router.put("/:id", updateFood);
router.delete("/:id", deleteFood);

export default router;
