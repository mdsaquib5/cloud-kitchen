import User from "../models/userModel.js";
import { generateTokens, setRefreshTokenCookie, clearRefreshTokenCookie } from "../utils/token.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields." });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: "Account already exists! Please login instead. 👋" });
        }
        const user = await User.create({ name, email, phone, password });
        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save({ validateBeforeSave: false });
        setRefreshTokenCookie(res, refreshToken);
        
        user.password = undefined;
        user.refreshToken = undefined;
        res.status(201).json({ success: true, message: "User registered successfully", accessToken, user });
    } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password." });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "Account doesn't exist. Please sign up first! 👋" });
        }
        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Incorrect password. Please try again." });
        }
        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save({ validateBeforeSave: false });
        setRefreshTokenCookie(res, refreshToken);
        
        user.password = undefined;
        user.refreshToken = undefined;
        res.status(200).json({ success: true, message: "Login successful", accessToken, user });
    } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken: incomingToken } = req.cookies;
        if (!incomingToken) {
            return res.status(401).json({ success: false, message: "No refresh token provided." });
        }
        const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("+refreshToken");
        if (!user || !user.refreshToken) {
            clearRefreshTokenCookie(res);
            return res.status(401).json({ success: false, message: "User not found or token revoked." });
        }
        const isMatch = await bcrypt.compare(incomingToken, user.refreshToken);
        if (!isMatch) {
            user.refreshToken = undefined;
            await user.save({ validateBeforeSave: false });
            clearRefreshTokenCookie(res);
            return res.status(403).json({ success: false, message: "Invalid token. Session revoked for security." });
        }
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
        user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
        await user.save({ validateBeforeSave: false });
        setRefreshTokenCookie(res, newRefreshToken);
        res.status(200).json({ success: true, accessToken });
    } catch (error) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
    }
};

export const logout = async (req, res, next) => {
    try {
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
        }
        clearRefreshTokenCookie(res);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) { next(error); }
};

export const getProfile = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) { next(error); }
};

export const adminLogin = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const inputUser = (username || email || "").trim();
        const inputPass = (password || "").trim();

        const expectedUser = (process.env.ADMIN_USERNAME || "pushpender").trim();
        const expectedPass = (process.env.ADMIN_PASSWORD || "shreeshyaam!kitchens@123").trim();

        const isUserValid = inputUser.toLowerCase() === expectedUser.toLowerCase() || inputUser.toLowerCase() === "admin";
        const isPassValid = inputPass === expectedPass;

        if (isUserValid && isPassValid) {
            const token = jwt.sign(
                {
                    id: "admin_id_123",
                    role: "admin",
                    name: "Kitchen Manager",
                    email: expectedUser
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "30d" }
            );

            return res.status(200).json({
                success: true,
                message: "Kitchen Admin Login successful",
                accessToken: token,
                user: {
                    id: "admin_id_123",
                    role: "admin",
                    name: "Kitchen Manager",
                    email: expectedUser
                }
            });
        }
        
        return res.status(401).json({ success: false, message: "Invalid Kitchen Manager credentials." });
    } catch (error) { next(error); }
};

export const googleAuth = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "No Google token provided." });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        let user = await User.findOne({ email }).select("+password +refreshToken");

        if (!user) {
            user = await User.findOne({ googleId }).select("+password +refreshToken");
        }

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            user = await User.create({
                name,
                email,
                password: randomPassword,
                googleId,
                phone: "0000000000"
            });
        } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save({ validateBeforeSave: false });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save({ validateBeforeSave: false });
        setRefreshTokenCookie(res, refreshToken);
        
        user.password = undefined;
        user.refreshToken = undefined;
        res.status(200).json({ success: true, message: "Google Login successful", accessToken, user });
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(401).json({ success: false, message: "Invalid Google token." });
    }
};
