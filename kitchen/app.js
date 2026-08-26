import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import foodRoute from "./routes/foodRoute.js";
import uploadRoute from "./routes/uploadRoute.js";

const app = express();

// Global Security & Parsers
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for storefront & dashboard
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://your-cloud-kitchen.vercel.app",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Shree Shyam Kitchen Backend API is live & healthy 🚀",
        timestamp: new Date().toISOString(),
    });
});

// place all the routes here
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/food", foodRoute);
app.use("/api/upload", uploadRoute);

// Global 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route ${req.originalUrl} not found`,
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

export default app;