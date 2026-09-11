import express from "express";
import { handlePidgeWebhook } from "../controllers/pidgeWebhookController.js";

const router = express.Router();

/**
 * POST /api/webhook/pidge
 * Pidge calls this when delivery status changes.
 * Secret is validated via query param: ?secret=PIDGE_WEBHOOK_SECRET
 */
router.post("/pidge", handlePidgeWebhook);

export default router;
