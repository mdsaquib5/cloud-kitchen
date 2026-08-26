import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        
        // Hardcoded admin secret for MVP (in production, use process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "fallback_secret_for_mvp");
        
        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden. Admin access required." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};
