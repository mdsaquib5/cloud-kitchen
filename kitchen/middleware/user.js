import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route. Please login."
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Special handling for configured static admin credentials
        if (decoded.role === "admin" && String(decoded.id).startsWith("admin_")) {
            req.user = {
                _id: decoded.id,
                role: "admin",
                name: decoded.name || "Kitchen Manager",
                email: decoded.email || "admin@yourskitchen.com",
            };
            return next();
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "The user belonging to this token no longer exists."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid or expired. Please login again.",
            error: error.message
        });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user?.role || 'guest'}) is not allowed to access this resource`
            });
        }
        next();
    };
};
