"use client";

import React, { useState } from "react";
import {
    FiDollarSign,
    FiTrendingUp,
    FiShoppingBag,
    FiClock,
    FiPieChart,
    FiArrowUpRight,
    FiArrowDownRight,
    FiAward,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { toast } from "sonner";

const Analytics = () => {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const updateKitchenStatus = async (status) => {
        try {
            setIsUpdatingStatus(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isKitchenOpen: status })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(status ? "Kitchen is now OPEN! Accepting new orders." : "Kitchen is now CLOSED! No new orders will be accepted.");
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdatingStatus(false);
        }
    };
    const [timeframe, setTimeframe] = useState("week");

    const [grossRevenue, setGrossRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [aov, setAov] = useState(0);
    const [topDishesList, setTopDishesList] = useState([]);

    const [categoryShareList, setCategoryShareList] = useState([]);
    const [hourlyTrendsList, setHourlyTrendsList] = useState([]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`);
            const data = await res.json();
            if (data.success) {
                let revenue = 0;
                let ordersCount = data.orders.length;
                let itemTracker = {};

                // For categories
                let categoryRevenue = {
                    "Momos Specials": 0,
                    "Combo Offers": 0,
                    "Chaap & Rolls": 0,
                    "Chowmein & Pasta": 0,
                    "Beverages & Others": 0
                };

                // For hourly trends
                let hourlyCounts = {
                    "lunch": 0, // 12-14
                    "snack": 0, // 14-17
                    "evening": 0, // 17-20
                    "dinner": 0, // 20-23
                };

                data.orders.forEach(o => {
                    if (o.status !== "CANCELLED") {
                        revenue += (o.totals?.grandTotal || 0);

                        // Hourly Trend
                        const hour = new Date(o.createdAt).getHours();
                        if (hour >= 12 && hour < 14) hourlyCounts.lunch++;
                        else if (hour >= 14 && hour < 17) hourlyCounts.snack++;
                        else if (hour >= 17 && hour < 20) hourlyCounts.evening++;
                        else if (hour >= 20 || hour < 4) hourlyCounts.dinner++;
                        else hourlyCounts.snack++; // default catchall

                        o.items.forEach(item => {
                            const itemRev = item.quantity * (item.unitPrice || 0);

                            // Track Top Dishes
                            if (!itemTracker[item.title]) {
                                itemTracker[item.title] = { name: item.title, category: "Menu Item", orders: 0, revenue: 0 };
                            }
                            itemTracker[item.title].orders += item.quantity;
                            itemTracker[item.title].revenue += itemRev;

                            // Track Categories
                            const titleLower = item.title.toLowerCase();
                            if (titleLower.includes("momo")) categoryRevenue["Momos Specials"] += itemRev;
                            else if (titleLower.includes("combo")) categoryRevenue["Combo Offers"] += itemRev;
                            else if (titleLower.includes("chaap") || titleLower.includes("roll")) categoryRevenue["Chaap & Rolls"] += itemRev;
                            else if (titleLower.includes("chowmein") || titleLower.includes("pasta") || titleLower.includes("noodle")) categoryRevenue["Chowmein & Pasta"] += itemRev;
                            else categoryRevenue["Beverages & Others"] += itemRev;
                        });
                    } else {
                        ordersCount -= 1; // Exclude cancelled
                    }
                });

                setGrossRevenue(revenue);
                setTotalOrders(ordersCount);
                setAov(ordersCount > 0 ? Math.round(revenue / ordersCount) : 0);

                let sortedDishes = Object.values(itemTracker).sort((a, b) => b.orders - a.orders);
                let top5 = sortedDishes.slice(0, 5).map((d, idx) => ({
                    ...d,
                    rank: idx + 1,
                    growth: "+10%"
                }));
                
                setTopDishesList(top5);

                // Prepare Category Share
                const colors = ["#f01543", "#ffb703", "#3b82f6", "#10b981", "#8b5cf6"];
                const totalCatRev = Object.values(categoryRevenue).reduce((a, b) => a + b, 0) || 1; // avoid / 0
                let catList = Object.entries(categoryRevenue)
                    .map(([name, rev], idx) => ({
                        name,
                        revenueNum: rev,
                        revenue: "₹" + rev.toLocaleString(),
                        percentage: Math.round((rev / totalCatRev) * 100),
                        color: colors[idx % colors.length]
                    }))
                    .sort((a, b) => b.revenueNum - a.revenueNum); // Sort by highest revenue

                setCategoryShareList(catList);

                // Prepare Hourly Trends
                const maxHour = Math.max(...Object.values(hourlyCounts)) || 1;
                setHourlyTrendsList([
                    { hour: "12 PM - 2 PM (Lunch Rush)", orders: hourlyCounts.lunch, percentage: Math.round((hourlyCounts.lunch / maxHour) * 100) },
                    { hour: "2 PM - 5 PM (Snack Window)", orders: hourlyCounts.snack, percentage: Math.round((hourlyCounts.snack / maxHour) * 100) },
                    { hour: "5 PM - 8 PM (Evening Peak)", orders: hourlyCounts.evening, percentage: Math.round((hourlyCounts.evening / maxHour) * 100) },
                    { hour: "8 PM - 11 PM (Dinner Rush)", orders: hourlyCounts.dinner, percentage: Math.round((hourlyCounts.dinner / maxHour) * 100) },
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        }
    };

    React.useEffect(() => {
        fetchAnalytics();
    }, []);

    return (
        <div className="analytics-screen">
            <div className="analytics-top-header">
                <div className="analytics-title-wrap">
                    <h2>Sales &amp; Kitchen Insights</h2>
                    <p>Gross revenue performance, dish popularity rankings &amp; peak preparation loads.</p>
                </div>

                <div className="timeframe-toggle">
                    <button
                        type="button"
                        className={`tf-btn ${timeframe === "today" ? "active" : ""}`}
                        onClick={() => setTimeframe("today")}
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        className={`tf-btn ${timeframe === "week" ? "active" : ""}`}
                        onClick={() => setTimeframe("week")}
                    >
                        This Week
                    </button>
                    <button
                        type="button"
                        className={`tf-btn ${timeframe === "month" ? "active" : ""}`}
                        onClick={() => setTimeframe("month")}
                    >
                        This Month
                    </button>
                </div>
            </div>

            <div className="analytics-kpi-grid">
                <div className="a-kpi-card revenue">
                    <div className="kpi-top">
                        <span className="kpi-title">Gross Revenue</span>
                        <div className="kpi-icon-wrap rev">
                            <FiDollarSign size={18} />
                        </div>
                    </div>
                    <strong className="kpi-main-val">₹{grossRevenue.toLocaleString()}</strong>
                    <div className="kpi-trend positive">
                        <FiArrowUpRight size={14} />
                        <span>+22.4% vs last week</span>
                    </div>
                </div>

                <div className="a-kpi-card orders">
                    <div className="kpi-top">
                        <span className="kpi-title">Total Orders</span>
                        <div className="kpi-icon-wrap ord">
                            <FiShoppingBag size={18} />
                        </div>
                    </div>
                    <strong className="kpi-main-val">{totalOrders} Orders</strong>
                    <div className="kpi-trend positive">
                        <FiArrowUpRight size={14} />
                        <span>+16.8% order volume</span>
                    </div>
                </div>

                <div className="a-kpi-card avg-order">
                    <div className="kpi-top">
                        <span className="kpi-title">Avg Order Value (AOV)</span>
                        <div className="kpi-icon-wrap aov">
                            <FiTrendingUp size={18} />
                        </div>
                    </div>
                    <strong className="kpi-main-val">₹{aov}</strong>
                    <div className="kpi-trend positive">
                        <FiArrowUpRight size={14} />
                        <span>+5.2% basket size</span>
                    </div>
                </div>

                <div className="a-kpi-card speed">
                    <div className="kpi-top">
                        <span className="kpi-title">Avg Prep Speed</span>
                        <div className="kpi-icon-wrap spd">
                            <FiClock size={18} />
                        </div>
                    </div>
                    <strong className="kpi-main-val">11.2 Mins</strong>
                    <div className="kpi-trend positive">
                        <FiArrowDownRight size={14} />
                        <span>-1.5m faster prep</span>
                    </div>
                </div>
            </div>

            <div className="analytics-main-grid">
                <div className="a-card top-dishes-card">
                    <div className="a-card-header">
                        <div className="header-title-box">
                            <FiAward size={18} className="award-icon" />
                            <h3>Top Selling Menu Items</h3>
                        </div>
                        <span className="header-subtitle">By total orders volume</span>
                    </div>

                    <div className="top-dishes-list">
                        {topDishesList.map((dish) => (
                            <div key={dish.rank} className="top-dish-row">
                                <span className={`rank-badge rank-${dish.rank}`}>#{dish.rank}</span>
                                <div className="dish-info-col">
                                    <strong className="d-name">{dish.name}</strong>
                                    <span className="d-cat">{dish.category}</span>
                                </div>
                                <div className="dish-orders-col">
                                    <span className="d-orders-num">{dish.orders} Orders</span>
                                    <span className="d-growth">{dish.growth}</span>
                                </div>
                                <span className="d-rev">₹{dish.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="a-card category-breakdown-card">
                    <div className="a-card-header">
                        <div className="header-title-box">
                            <FiPieChart size={18} />
                            <h3>Category Revenue Share</h3>
                        </div>
                    </div>

                    <div className="cat-share-list">
                        {categoryShareList.map((cat, idx) => (
                            <div key={idx} className="cat-share-row">
                                <div className="cat-share-header">
                                    <span className="cat-name">{cat.name}</span>
                                    <strong className="cat-val">{cat.revenue} ({cat.percentage}%)</strong>
                                </div>
                                <div className="cat-progress-bg">
                                    <div
                                        className="cat-progress-fill"
                                        style={{ width: `${cat.percentage}%`, background: cat.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="a-card kitchen-controls-card" style={{ display: 'flex', gap: '20px', padding: '30px', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div className="header-title-box" style={{ marginBottom: '10px' }}>
                    <FaFire size={18} className="fire-icon" style={{ color: '#f01543', marginRight: '8px' }} />
                    <h3 style={{ fontSize: '1.2rem', color: '#111827', margin: 0, display: 'inline-block' }}>Master Kitchen Controls</h3>
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px' }}>Toggle whether the restaurant is currently accepting new orders.</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button
                        type="button"
                        onClick={() => updateKitchenStatus(true)}
                        disabled={isUpdatingStatus}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
                    >
                        <FaFire size={18} />
                        Open Kitchen
                    </button>
                    <button
                        type="button"
                        onClick={() => updateKitchenStatus(false)}
                        disabled={isUpdatingStatus}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}
                    >
                        <FiClock size={18} />
                        Close Kitchen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
