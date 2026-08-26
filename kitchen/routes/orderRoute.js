import express from "express";
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// Customer Endpoints
router.post("/", createOrder);
router.get("/track/:orderId", getOrderById);

// Kitchen Endpoints (Ideally protected with verifyToken, but omitting for now as per previous auth removal request)
router.get("/admin/all", getAllOrders);
router.put("/admin/status/:orderId", updateOrderStatus);

export default router;
