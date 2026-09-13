"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiGrid,
    FiTruck,
    FiClock,
    FiUsers,
    FiSend,
    FiLayers,
    FiBarChart2,
    FiLogOut,
    FiShield,
} from "react-icons/fi";
import Logo from "../shared/Logo";
import orderService from "@/services/orderService";
import { useKitchenAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const KitchenSidebar = () => {
    const pathname = usePathname();
    const [liveOrdersCount, setLiveOrdersCount] = useState(0);
    const [dispatchOrdersCount, setDispatchOrdersCount] = useState(0);
    const { kitchenUser, clearKitchenAuth } = useKitchenAuthStore();

    useEffect(() => {
        const fetchLiveCount = async () => {
            try {
                const res = await orderService.getAllOrders();
                const data = res.data;
                if (data.success && data.orders) {
                    const count = data.orders.filter(
                        (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED" && o.status !== "COMPLETED" && o.status !== "OUT_FOR_DELIVERY"
                    ).length;
                    setLiveOrdersCount(count);

                    const dispatchCnt = data.orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length;
                    setDispatchOrdersCount(dispatchCnt);
                }
            } catch (error) {
                console.error("Failed to fetch live order count:", error);
            }
        };

        fetchLiveCount();
        const interval = setInterval(fetchLiveCount, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        clearKitchenAuth();
        toast.info("Kitchen Manager logged out.");
    };

    const mainNav = [
        {
            id: "live-kds",
            label: "Live Orders",
            href: "/kitchen",
            icon: <FiGrid size={19} />,
            badge: liveOrdersCount > 0 ? liveOrdersCount.toString() : null,
            badgeType: "hot",
        },
        {
            id: "dispatch",
            label: "Dispatch",
            href: "/kitchen/dispatch",
            icon: <FiTruck size={19} />,
            badge: dispatchOrdersCount > 0 ? dispatchOrdersCount.toString() : null,
            badgeType: "hot",
        },
        {
            id: "order-history",
            label: "Order History",
            href: "/kitchen/history",
            icon: <FiClock size={19} />,
        },
    ];

    const peopleNav = [
        {
            id: "customers",
            label: "Customers",
            href: "/kitchen/customers",
            icon: <FiUsers size={19} />,
        },
        {
            id: "delivery-partners",
            label: "Delivery Partners",
            href: "/kitchen/delivery-partners",
            icon: <FiSend size={19} />,
        },
    ];

    const manageNav = [
        {
            id: "menu-stock",
            label: "Menu & Stock",
            href: "/kitchen/menu-stock",
            icon: <FiLayers size={19} />,
        },
        {
            id: "analytics",
            label: "Analytics Report",
            href: "/kitchen/analytics",
            icon: <FiBarChart2 size={19} />,
        },
    ];

    return (
        <aside className="kitchen-sidebar">
            <div className="sidebar-logo-container">
                <Logo />
            </div>

            <div className="sidebar-scroll-area">
                <div className="sidebar-section">
                    <span className="sidebar-section-title">Operations</span>
                    <nav className="sidebar-nav">
                        {mainNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                                >
                                    <span className="nav-item-icon">{item.icon}</span>
                                    <span className="nav-item-label">{item.label}</span>
                                    {item.badge && (
                                        <span className={`nav-item-badge ${item.badgeType}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-section-title">People & Fleet</span>
                    <nav className="sidebar-nav">
                        {peopleNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                                >
                                    <span className="nav-item-icon">{item.icon}</span>
                                    <span className="nav-item-label">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-section-title">Management</span>
                    <nav className="sidebar-nav">
                        {manageNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                                >
                                    <span className="nav-item-icon">{item.icon}</span>
                                    <span className="nav-item-label">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="sidebar-section" style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FiShield size={14} color="#38bdf8" />
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#e2e8f0" }}>{kitchenUser?.name || "Manager"}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            title="Logout Manager"
                            style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
                        >
                            <FiLogOut size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default KitchenSidebar;
