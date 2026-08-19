"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiPhone,
    FiMessageSquare,
    FiArrowLeft,
    FiCheck,
    FiShield,
} from "react-icons/fi";
import { FaMotorcycle, FaUtensils, FaStoreAlt } from "react-icons/fa";
import { PRODUCTS } from "@/constant/product";

const TrackOrder = () => {
    const [orderMode, setOrderMode] = useState("delivery");
    const [currentStepIndex, setCurrentStepIndex] = useState(2);

    const deliverySteps = [
        {
            id: 0,
            title: "Order Placed",
            time: "12:30 PM",
            desc: "Order #YK-84920 received & confirmed",
            icon: <FiCheckCircle size={18} />,
        },
        {
            id: 1,
            title: "Kitchen Preparing",
            time: "12:34 PM",
            desc: "Chef is handcrafting your gourmet meal",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 2,
            title: "Rider Assigned & On the Way",
            time: "12:45 PM",
            desc: "Rider Rahul Verma is arriving with your fresh order",
            icon: <FaMotorcycle size={17} />,
        },
        {
            id: 3,
            title: "Delivered",
            time: "Est. 12:55 PM",
            desc: "Enjoy your hot, authentic delicious food",
            icon: <FiCheck size={18} />,
        },
    ];

    const takeawaySteps = [
        {
            id: 0,
            title: "Order Placed",
            time: "12:30 PM",
            desc: "Takeaway order received & confirmed",
            icon: <FiCheckCircle size={18} />,
        },
        {
            id: 1,
            title: "Kitchen Preparing",
            time: "12:34 PM",
            desc: "Chef is packing your meal hot & fresh",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 2,
            title: "Ready for Pickup",
            time: "12:48 PM",
            desc: "Your order is ready at the kitchen counter",
            icon: <FaStoreAlt size={16} />,
        },
        {
            id: 3,
            title: "Picked Up",
            time: "Est. 12:55 PM",
            desc: "Order handed over to customer",
            icon: <FiCheck size={18} />,
        },
    ];

    const dineInSteps = [
        {
            id: 0,
            title: "Order Placed",
            time: "12:30 PM",
            desc: "Table #T-04 order sent to kitchen",
            icon: <FiCheckCircle size={18} />,
        },
        {
            id: 1,
            title: "Kitchen Cooking",
            time: "12:33 PM",
            desc: "Fresh sizzlers & gravies on the flame",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 2,
            title: "Food Ready",
            time: "12:45 PM",
            desc: "Plating and garnishing completed",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 3,
            title: "Served at Table",
            time: "Est. 12:48 PM",
            desc: "Served fresh to your table #T-04",
            icon: <FiCheck size={18} />,
        },
    ];

    const activeSteps =
        orderMode === "delivery"
            ? deliverySteps
            : orderMode === "takeaway"
            ? takeawaySteps
            : dineInSteps;

    const orderedItems = PRODUCTS.slice(0, 2);

    return (
        <div className="inner-wrapper track-page-wrapper">
            <div className="container">
                <div className="cart-header-strip">
                    <Link href="/foods" className="back-to-shop-link">
                        <FiArrowLeft size={16} />
                        <span>Continue Ordering</span>
                    </Link>
                </div>

                <div className="track-layout-grid">
                    <div className="track-main-col">
                        <div className="track-status-banner">
                            <div className="status-live-pill">
                                <span className="live-pulse-dot"></span>
                                <span>LIVE TRACKING</span>
                            </div>

                            <div className="status-eta-block">
                                <div className="eta-time-wrap">
                                    <FiClock size={24} className="eta-icon" />
                                    <div>
                                        <h2 className="eta-heading">20-25 Mins</h2>
                                        <p className="eta-subtext">Estimated Arrival Time</p>
                                    </div>
                                </div>
                                <div className="order-id-badge">
                                    <span>Order ID:</span>
                                    <strong>#YK-84920</strong>
                                </div>
                            </div>

                            <div className="order-mode-toggle-pills">
                                <button
                                    type="button"
                                    className={`mode-pill-btn ${orderMode === "delivery" ? "active" : ""}`}
                                    onClick={() => setOrderMode("delivery")}
                                >
                                    <FaMotorcycle size={14} />
                                    <span>Delivery</span>
                                </button>
                                <button
                                    type="button"
                                    className={`mode-pill-btn ${orderMode === "takeaway" ? "active" : ""}`}
                                    onClick={() => setOrderMode("takeaway")}
                                >
                                    <FaStoreAlt size={14} />
                                    <span>Takeaway</span>
                                </button>
                                <button
                                    type="button"
                                    className={`mode-pill-btn ${orderMode === "dine-in" ? "active" : ""}`}
                                    onClick={() => setOrderMode("dine-in")}
                                >
                                    <FaUtensils size={14} />
                                    <span>Dine-In (Table 04)</span>
                                </button>
                            </div>
                        </div>

                        <div className="track-timeline-card">
                            <h3 className="track-card-title">Order Status Progress</h3>

                            <div className="timeline-stepper">
                                {activeSteps.map((step, idx) => {
                                    const isDone = idx < currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    const isPending = idx > currentStepIndex;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`timeline-step-item ${
                                                isDone ? "step-done" : isCurrent ? "step-current" : "step-pending"
                                            }`}
                                        >
                                            <div className="step-node-col">
                                                <div className="step-icon-circle">
                                                    {step.icon}
                                                </div>
                                                {idx < activeSteps.length - 1 && (
                                                    <div className="step-connector-line"></div>
                                                )}
                                            </div>

                                            <div className="step-content-col">
                                                <div className="step-heading-row">
                                                    <h4 className="step-title">{step.title}</h4>
                                                    <span className="step-time">{step.time}</span>
                                                </div>
                                                <p className="step-desc">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {orderMode === "delivery" && (
                            <div className="rider-contact-card">
                                <div className="rider-avatar-wrap">
                                    <div className="rider-avatar-placeholder">
                                        <FaMotorcycle size={22} />
                                    </div>
                                    <div>
                                        <h4 className="rider-name">Rahul Verma</h4>
                                        <p className="rider-service">Delivery Partner (Shadowfax Express)</p>
                                        <div className="otp-verification-pill">
                                            <span>Delivery OTP:</span>
                                            <strong>5892</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="rider-action-btns">
                                    <a href="tel:+919876543210" className="rider-btn call-btn">
                                        <FiPhone size={15} />
                                        <span>Call</span>
                                    </a>
                                    <a href="https://wa.me/919876543210" className="rider-btn chat-btn">
                                        <FiMessageSquare size={15} />
                                        <span>WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="delivery-destination-card">
                            <div className="dest-icon-wrap">
                                <FiMapPin size={20} />
                            </div>
                            <div className="dest-info">
                                <h4 className="dest-title">
                                    {orderMode === "delivery"
                                        ? "Delivery Destination"
                                        : orderMode === "takeaway"
                                        ? "Kitchen Pickup Location"
                                        : "Restaurant Table"}
                                </h4>
                                <p className="dest-address">
                                    {orderMode === "delivery"
                                        ? "Flat 402, Royal Palms Residency, DLF Phase 3, Gurugram"
                                        : orderMode === "takeaway"
                                        ? "Your's Kitchen Counter, Sector 29 Cyber Hub, Gurugram"
                                        : "Main Dining Hall, Table #04 (Ground Floor)"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="track-sidebar-col">
                        <div className="track-summary-card">
                            <h3 className="track-card-title">Order Items ({orderedItems.length})</h3>

                            <div className="track-items-list">
                                {orderedItems.map((item) => (
                                    <div key={item.id} className="track-item-row">
                                        <div className="track-item-img-wrap">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={48}
                                                height={48}
                                                className="track-item-img"
                                            />
                                        </div>
                                        <div className="track-item-info">
                                            <h5 className="track-item-name">{item.title}</h5>
                                            <span className="track-item-qty">Qty: 1 • Portion: Regular</span>
                                        </div>
                                        <span className="track-item-price">{item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="track-price-breakdown">
                                <div className="breakdown-row">
                                    <span>Item Total</span>
                                    <span>$58.58</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Delivery Partner Fee</span>
                                    <span>{orderMode === "delivery" ? "$5.00" : "FREE"}</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Taxes & GST (5%)</span>
                                    <span>$2.92</span>
                                </div>
                                <div className="breakdown-row total-row">
                                    <span>Total Amount Paid</span>
                                    <span className="grand-total-val">
                                        {orderMode === "delivery" ? "$66.50" : "$61.50"}
                                    </span>
                                </div>
                            </div>

                            <div className="track-security-badge">
                                <FiShield size={16} className="security-icon" />
                                <span>Verified Instant Kitchen State Machine</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
