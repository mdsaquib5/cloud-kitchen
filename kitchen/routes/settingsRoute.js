import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/user.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/status", isAuthenticated, authorizeRoles("admin"), updateSettings);

export default router;
