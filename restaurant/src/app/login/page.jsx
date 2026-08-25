"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

const Login = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [currentState, setCurrentState] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (currentState === "signup") {
                const res = await api.post("/user/signup", formData);
                if (res.data.success) {
                    setAuth(res.data.user, res.data.accessToken);
                    toast.success("Account created successfully!");
                    router.push("/");
                }
            } else {
                const res = await api.post("/user/login", {
                    email: formData.email,
                    password: formData.password
                });
                if (res.data.success) {
                    setAuth(res.data.user, res.data.accessToken);
                    toast.success("Logged in successfully!");
                    router.push("/");
                }
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inner-wrapper login-page-wrapper">
            <div className="container">
                <div className="auth-box-card">
                    <div className="auth-form-side">
                        <div className="auth-form-container">
                            <div className="auth-header-text">
                                <h2 className="auth-title">
                                    {currentState === "login" ? "Access Your Account" : "Create An Account"}
                                </h2>
                                <p className="auth-subtitle">
                                    {currentState === "login"
                                        ? "Enter your credentials to access your dashboard"
                                        : "Fill in your details to start ordering delicious food"}
                                </p>
                            </div>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                {currentState === "signup" && (
                                    <div className="auth-input-group">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                            className="auth-input"
                                        />
                                    </div>
                                )}

                                <div className="auth-input-group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email Address"
                                        required
                                        className="auth-input"
                                    />
                                </div>

                                {currentState === "signup" && (
                                    <div className="auth-input-group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number (10 digits)"
                                            required
                                            pattern="[0-9]{10}"
                                            title="Please enter a valid 10-digit phone number"
                                            className="auth-input"
                                        />
                                    </div>
                                )}

                                <div className="auth-input-group password-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password (min 6 chars)"
                                        required
                                        minLength={6}
                                        className="auth-input"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                    </button>
                                </div>

                                {currentState === "login" ? (
                                    <div className="auth-options-row">
                                        <label className="remember-checkbox-label">
                                            <input type="checkbox" className="custom-checkbox" />
                                            <span>Remember Me</span>
                                        </label>
                                        <button type="button" className="forgot-pwd-btn">
                                            Forgot Password?
                                        </button>
                                    </div>
                                ) : (
                                    <div className="auth-terms-row">
                                        <label className="remember-checkbox-label">
                                            <input type="checkbox" required className="custom-checkbox" />
                                            <span>I agree to the Terms & Privacy Policy</span>
                                        </label>
                                    </div>
                                )}

                                <button type="submit" className="auth-submit-btn" disabled={loading}>
                                    <span>
                                        {loading 
                                            ? "Processing..." 
                                            : currentState === "login" ? "Login Account" : "Create Account"
                                        }
                                    </span>
                                </button>

                                <div className="auth-switch-prompt">
                                    {currentState === "login" ? (
                                        <p>
                                            Don't have an account?{" "}
                                            <button
                                                type="button"
                                                className="auth-switch-link"
                                                onClick={() => {
                                                    setCurrentState("signup");
                                                    setFormData({ name: "", email: "", phone: "", password: "" });
                                                }}
                                            >
                                                Sign up
                                            </button>
                                        </p>
                                    ) : (
                                        <p>
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                className="auth-switch-link"
                                                onClick={() => {
                                                    setCurrentState("login");
                                                    setFormData({ name: "", email: "", phone: "", password: "" });
                                                }}
                                            >
                                                Log in
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="auth-banner-side">
                        <div className="auth-banner-overlay"></div>
                        <div className="auth-banner-content">
                            <h2 className="auth-banner-title">Hot & Fresh, Every Order</h2>
                            <p className="auth-banner-subtitle">Made after you place the order</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
