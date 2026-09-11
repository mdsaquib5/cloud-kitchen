import express from "express";
import { createPaymentSession, verifyPayment, handleCashfreeWebhook } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createPaymentSession);
router.post("/verify", verifyPayment);
router.post("/webhook", handleCashfreeWebhook);

export default router;
