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
    FiShoppingBag,
    FiCheck,
    FiShield,
} from "react-icons/fi";
import { FaMotorcycle, FaUtensils, FaStoreAlt } from "react-icons/fa";
import { useStore } from "@/store/useStore";

const TrackOrder = () => {
    const activeOrder = useStore((state) => state.activeOrder);
    const [currentStepIndex, setCurrentStepIndex] = useState(2);

    const orderMode = activeOrder?.orderType || "delivery";
    const orderedItems = activeOrder?.items || [];
    const orderId = activeOrder?.id || "YK-84920";

    const deliverySteps = [
        {
            id: 0,
            title: "Order Placed",
            time: activeOrder?.placedAt || "12:30 PM",
            desc: `Order #${orderId} received & confirmed`,
            icon: <FiCheckCircle size={18} />,
        },
        {
            id: 1,
            title: "Kitchen Preparing",
            time: "In Progress",
            desc: "Chef is handcrafting your gourmet meal",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 2,
            title: "Rider Assigned & On the Way",
            time: "Live Dispatch",
            desc: "Rider Rahul Verma is arriving with your fresh order",
            icon: <FaMotorcycle size={17} />,
        },
        {
            id: 3,
            title: "Delivered",
            time: `Est. ${activeOrder?.eta || "20-30 Mins"}`,
            desc: "Enjoy your hot, authentic delicious food",
            icon: <FiCheck size={18} />,
        },
    ];

    const takeawaySteps = [
        {
            id: 0,
            title: "Order Placed",
            time: activeOrder?.placedAt || "12:30 PM",
            desc: `Takeaway order #${orderId} received & confirmed`,
            icon: <FiCheckCircle size={18} />,
        },
        {
            id: 1,
            title: "Kitchen Preparing",
            time: "In Progress",
            desc: "Chef is packing your meal hot & fresh",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 2,
            title: "Ready for Pickup",
            time: `Slot: ${activeOrder?.pickupSlot || "15"} Mins`,
            desc: "Your order is ready at the kitchen counter",
            icon: <FaStoreAlt size={16} />,
        },
        {
            id: 3,
            title: "Picked Up",
            time: "Est. Handover",
            desc: "Order handed over to customer",
            icon: <FiCheck size={18} />,
        },
    ];

    const dineInSteps = [
        {
            id: 0,
            title: "Order Placed",
            time: activeOrder?.placedAt || "12:30 PM",
            desc: `Table #${activeOrder?.tableNo || "T-04"} order sent to kitchen`,
            icon: <FiCheckCircle size={18} />,
        },
        {
            id: 1,
            title: "Kitchen Cooking",
            time: "In Progress",
            desc: "Fresh sizzlers & gravies on the flame",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 2,
            title: "Food Ready",
            time: "Plating Done",
            desc: "Plating and garnishing completed",
            icon: <FaUtensils size={16} />,
        },
        {
            id: 3,
            title: "Served at Table",
            time: `Table #${activeOrder?.tableNo || "T-04"}`,
            desc: `Served fresh to your table #${activeOrder?.tableNo || "T-04"}`,
            icon: <FiCheck size={18} />,
        },
    ];

    const activeSteps =
        orderMode === "delivery"
            ? deliverySteps
            : orderMode === "takeaway"
            ? takeawaySteps
            : dineInSteps;

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
                                        <h2 className="eta-heading">{activeOrder?.eta || "20-25 Mins"}</h2>
                                        <p className="eta-subtext">Estimated Arrival Time</p>
                                    </div>
                                </div>
                                <div className="order-id-badge">
                                    <span>Order ID:</span>
                                    <strong>#{orderId}</strong>
                                </div>
                            </div>

                            <div className="order-mode-badge-display">
                                <span className="mode-badge-label">
                                    {orderMode === "delivery" && <FaMotorcycle size={14} />}
                                    {orderMode === "takeaway" && <FaStoreAlt size={14} />}
                                    {orderMode === "dine-in" && <FaUtensils size={14} />}
                                    <span>
                                        {orderMode === "delivery"
                                            ? "Home Delivery"
                                            : orderMode === "takeaway"
                                            ? `Takeaway (Pickup in ${activeOrder?.pickupSlot || 15}m)`
                                            : `Dine-In (Table ${activeOrder?.tableNo || "04"})`}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="track-timeline-card">
                            <h3 className="track-card-title">Order Status Progress</h3>

                            <div className="timeline-stepper">
                                {activeSteps.map((step, idx) => {
                                    const isDone = idx < currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;

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
                                        : `Main Dining Hall, Table #${activeOrder?.tableNo || "04"} (Ground Floor)`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="track-sidebar-col">
                        <div className="track-summary-card">
                            <h3 className="track-card-title">Order Items ({orderedItems.length})</h3>

                            <div className="track-items-list">
                                {orderedItems.map((item, index) => (
                                    <div key={item.cartItemId || item.id || index} className="track-item-row">
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
                                            <span className="track-item-qty">
                                                Qty: {item.quantity} • Portion: {item.portionLabel || "Regular"}
                                            </span>
                                        </div>
                                        <span className="track-item-price">
                                            ${((item.unitPrice || item.rawPrice || 25) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="track-price-breakdown">
                                <div className="breakdown-row">
                                    <span>Item Total</span>
                                    <span>${(activeOrder?.subtotal || 58.58).toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Delivery Partner Fee</span>
                                    <span>
                                        {orderMode === "delivery"
                                            ? `$${(activeOrder?.deliveryFee || 5.00).toFixed(2)}`
                                            : "FREE"}
                                    </span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Platform Fee</span>
                                    <span>${(activeOrder?.platformFee || 2.00).toFixed(2)}</span>
                                </div>
                                {activeOrder?.discount > 0 && (
                                    <div className="breakdown-row">
                                        <span>Discount</span>
                                        <span className="discount-val">-${activeOrder.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="breakdown-row">
                                    <span>Taxes & GST (5%)</span>
                                    <span>${(activeOrder?.tax || 2.92).toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row total-row">
                                    <span>Total Amount Paid</span>
                                    <span className="grand-total-val">
                                        ${(activeOrder?.grandTotal || 68.50).toFixed(2)}
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
