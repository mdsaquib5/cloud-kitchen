import express from "express";
import { signup, login, refresh, logout, getProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/user.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getProfile);

export default router;
