import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";


const router = express.Router();

// Memory storage for multer since we upload buffer directly to R2
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/", upload.single("image"), uploadImage);

export default router;
