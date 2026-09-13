"use client";

import React, { useState, useEffect } from "react";
import { FiLock, FiUser, FiKey, FiArrowRight, FiShield, FiAlertCircle } from "react-icons/fi";
import { toast } from "sonner";
import { useKitchenAuthStore } from "@/store/useAuthStore";
import authService from "@/services/authService";

export default function AdminAuthGuard({ children }) {
    const { kitchenUser, isKitchenAuthenticated, setKitchenAuth } = useKitchenAuthStore();
    const [mounted, setMounted] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!username.trim() || !password.trim()) {
            setErrorMsg("Please enter both Username and Password.");
            return;
        }

        setLoading(true);
        try {
            // Call dedicated /user/admin-login endpoint directly
            const res = await authService.adminLogin({
                username: username.trim(),
                email: username.trim(),
                password: password.trim(),
            });

            const data = res.data;
            if (data.success && data.accessToken) {
                const adminUser = data.user || { role: "admin", name: "Kitchen Manager" };
                adminUser.role = "admin";

                setKitchenAuth(adminUser, data.accessToken);
                toast.success("Manager verified! Welcome to Kitchen Control.");
            } else {
                setErrorMsg(data.message || "Invalid Manager Credentials.");
            }
        } catch (error) {
            console.error("Admin login error:", error);
            setErrorMsg(
                error.response?.data?.message || "Invalid credentials. Please verify your admin password."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f172a", color: "#fff" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "40px", border: "3px solid #334155", borderTop: "3px solid #38bdf8", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 15px" }}></div>
                    <p style={{ color: "#94a3b8", fontSize: "14px" }}>Verifying security permissions...</p>
                </div>
            </div>
        );
    }

    const isAdmin = isKitchenAuthenticated && kitchenUser?.role === "admin";

    if (!isAdmin) {
        return (
            <div style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "#090d16",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999,
                padding: "20px",
                backgroundImage: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.15), rgba(255, 255, 255, 0))"
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: "420px",
                    backgroundColor: "#111827",
                    borderRadius: "16px",
                    border: "1px solid #1f2937",
                    padding: "36px 30px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                    color: "#f9fafb"
                }}>
                    <div style={{ textAlign: "center", marginBottom: "28px" }}>
                        <div style={{
                            width: "56px",
                            height: "56px",
                            backgroundColor: "rgba(225, 29, 72, 0.12)",
                            border: "1px solid rgba(225, 29, 72, 0.3)",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            color: "#f43f5e"
                        }}>
                            <FiLock size={26} />
                        </div>
                        <h2 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 6px", color: "#fff" }}>Kitchen Manager Portal</h2>
                        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
                            Enter authorized credentials to access live KDS & order controls.
                        </p>
                    </div>

                    {errorMsg && (
                        <div style={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#fca5a5",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            marginBottom: "18px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            <FiAlertCircle size={16} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Manager Username
                            </label>
                            <div style={{ position: "relative" }}>
                                <FiUser size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px 12px 42px",
                                        backgroundColor: "#1f2937",
                                        border: "1px solid #374151",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        fontSize: "14px",
                                        outline: "none",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Security Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <FiKey size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px 12px 42px",
                                        backgroundColor: "#1f2937",
                                        border: "1px solid #374151",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        fontSize: "14px",
                                        outline: "none",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: "8px",
                                padding: "13px 18px",
                                backgroundColor: loading ? "#475569" : "#e11d48",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                transition: "all 0.2s"
                            }}
                        >
                            <span>{loading ? "Authenticating..." : "Unlock Kitchen Panel"}</span>
                            {!loading && <FiArrowRight size={16} />}
                        </button>
                    </form>

                    <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #1f2937", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
                        <FiShield size={13} />
                        <span>Protected by Role-Based Access Control</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}
