import express from "express";
import { createOrder, getOrderById, getAllOrders, updateOrderStatus, getUserOrders } from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/user.js";

const router = express.Router();

// Customer Endpoints
router.post("/", createOrder);
router.get("/user", isAuthenticated, getUserOrders);
router.get("/track/:orderId", getOrderById);

// Kitchen Endpoints (Ideally protected with verifyToken, but omitting for now as per previous auth removal request)
router.get("/admin/all", getAllOrders);
router.put("/admin/status/:orderId", updateOrderStatus);

export default router;
