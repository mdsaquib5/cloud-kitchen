"use client";

import React, { useState } from "react";
import {
    FiDollarSign,
    FiTrendingUp,
    FiShoppingBag,
    FiClock,
    FiPieChart,
    FiCalendar,
    FiArrowUpRight,
    FiArrowDownRight,
    FiAward,
} from "react-icons/fi";
import { FaFire, FaMotorcycle } from "react-icons/fa";

const topDishes = [
    { rank: 1, name: "Paneer Kurkure Momos", category: "Kurkure Momos", orders: 142, revenue: 17040, growth: "+18%" },
    { rank: 2, name: "₹179 Mega Feast Combo", category: "Combos", orders: 118, revenue: 21122, growth: "+24%" },
    { rank: 3, name: "Butter Malai Chaap", category: "Chaap Specials", orders: 96, revenue: 8640, growth: "+12%" },
    { rank: 4, name: "Paneer Chowmein", category: "Chowmein", orders: 84, revenue: 9240, growth: "+8%" },
    { rank: 5, name: "Cold Coffee", category: "Beverages", orders: 79, revenue: 3950, growth: "+15%" },
];

const categoryShare = [
    { name: "Momos Specials", percentage: 38, revenue: "₹34,200", color: "#f01543" },
    { name: "Combo Offers", percentage: 26, revenue: "₹23,400", color: "#ffb703" },
    { name: "Chaap & Rolls", percentage: 18, revenue: "₹16,200", color: "#3b82f6" },
    { name: "Chowmein & Pasta", percentage: 12, revenue: "₹10,800", color: "#10b981" },
    { name: "Beverages & Samosa", percentage: 6, revenue: "₹5,400", color: "#8b5cf6" },
];

const hourlyTrends = [
    { hour: "12 PM - 2 PM (Lunch Rush)", orders: 48, percentage: 65 },
    { hour: "2 PM - 5 PM (Snack Window)", orders: 22, percentage: 30 },
    { hour: "5 PM - 8 PM (Evening Peak)", orders: 76, percentage: 100 },
    { hour: "8 PM - 11 PM (Dinner Rush)", orders: 64, percentage: 85 },
];

const Analytics = () => {
    const [timeframe, setTimeframe] = useState("week");

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
                    <strong className="kpi-main-val">₹90,000</strong>
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
                    <strong className="kpi-main-val">419 Orders</strong>
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
                    <strong className="kpi-main-val">₹215</strong>
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
                        {topDishes.map((dish) => (
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
                        {categoryShare.map((cat, idx) => (
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

            <div className="a-card hourly-peaks-card">
                <div className="a-card-header">
                    <div className="header-title-box">
                        <FaFire size={16} className="fire-icon" />
                        <h3>Peak Kitchen Ordering Windows</h3>
                    </div>
                    <span className="header-subtitle">Hourly order volume load for kitchen staff allocation</span>
                </div>

                <div className="hourly-bars-grid">
                    {hourlyTrends.map((trend, idx) => (
                        <div key={idx} className="hourly-bar-card">
                            <div className="hour-info">
                                <strong className="h-time">{trend.hour}</strong>
                                <span className="h-orders">{trend.orders} Orders</span>
                            </div>
                            <div className="h-progress-track">
                                <div
                                    className="h-progress-fill"
                                    style={{ width: `${trend.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
