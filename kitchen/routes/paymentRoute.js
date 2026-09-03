import express from "express";
import { createPaymentSession, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createPaymentSession);
router.post("/verify", verifyPayment);

export default router;
