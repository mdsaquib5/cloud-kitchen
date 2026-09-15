import express from "express";
import { handleBorzoWebhook } from "../controllers/borzoWebhookController.js";

const router = express.Router();

router.post("/", handleBorzoWebhook);

export default router;
