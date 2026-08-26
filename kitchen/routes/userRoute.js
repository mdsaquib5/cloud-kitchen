import express from "express";
import { login, signup, refresh, logout, getProfile, adminLogin } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/user.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin); // New admin login endpoint
router.post("/refresh", refresh);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, getProfile);

export default router;
