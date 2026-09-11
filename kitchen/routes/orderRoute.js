import express from "express";
import {
    createOrder,
    getOrderById,
    getOrderLiveTracking,
    getAllOrders,
    updateOrderStatus,
    getUserOrders,
    dispatchRider,
    cancelRider,
    getDeliveryQuotes
} from "../controllers/orderController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/user.js";

const router = express.Router();

// Customer Endpoints
router.post("/", createOrder);
router.get("/user", isAuthenticated, getUserOrders);
router.get("/track/:orderId", getOrderById);
router.get("/track/:orderId/live-location", getOrderLiveTracking);

// Kitchen Admin Endpoints (Protected for Admin / Kitchen Manager only)
router.get("/admin/all", isAuthenticated, authorizeRoles("admin"), getAllOrders);
router.put("/admin/status/:orderId", isAuthenticated, authorizeRoles("admin"), updateOrderStatus);

// Generic Delivery Endpoints — supports Borzo + Pidge (Protected for Admin)
router.post("/admin/dispatch/:orderId", isAuthenticated, authorizeRoles("admin"), dispatchRider);
router.post("/admin/cancel/:orderId", isAuthenticated, authorizeRoles("admin"), cancelRider);
router.get("/admin/quotes/:orderId", isAuthenticated, authorizeRoles("admin"), getDeliveryQuotes);

export default router;
