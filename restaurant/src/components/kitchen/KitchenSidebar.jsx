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
} from "react-icons/fi";
import Logo from "../shared/Logo";

const KitchenSidebar = () => {
    const pathname = usePathname();
    const [liveOrdersCount, setLiveOrdersCount] = useState(0);

    useEffect(() => {
        const fetchLiveCount = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`);
                const data = await res.json();
                if (data.success && data.orders) {
                    // Count only active orders
                    const count = data.orders.filter(
                        (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED" && o.status !== "COMPLETED"
                    ).length;
                    setLiveOrdersCount(count);
                }
            } catch (error) {
                console.error("Failed to fetch live order count:", error);
            }
        };

        fetchLiveCount();
        const interval = setInterval(fetchLiveCount, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const mainNav = [
        {
            id: "live-kds",
            label: "Live KDS Orders",
            href: "/kitchen",
            icon: <FiGrid size={19} />,
            badge: liveOrdersCount > 0 ? liveOrdersCount.toString() : null,
            badgeType: "hot",
        },

        {
            id: "dispatch",
            label: "3PL & Dispatch",
            href: "/kitchen/dispatch",
            icon: <FiTruck size={19} />,
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
            label: "Menu & 86 Items",
            href: "/kitchen/menu-stock",
            icon: <FiLayers size={19} />,
        },
        {
            id: "analytics",
            label: "Sales & Insights",
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
            </div>
        </aside>
    );
};

export default KitchenSidebar;