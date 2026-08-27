"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
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
    const setActiveOrder = useStore((state) => state.setActiveOrder);
    const [currentStepIndex, setCurrentStepIndex] = useState(2);
    
    // Fix hydration flicker
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Real-time tracking poll
    useEffect(() => {
        if (!isMounted || !activeOrder || !(activeOrder.orderId || activeOrder.id)) return;
        
        // Stop polling if delivered or cancelled
        if (activeOrder.status === "DELIVERED" || activeOrder.status === "CANCELLED") return;

        const fetchOrderLive = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/orders/track/${activeOrder.orderId || activeOrder.id}`);
                const data = await res.json();
                if (data.success && data.order) {
                    const latest = data.order;
                    // Retain store-specific metadata (like local ETA calculations, etc)
                    // but update server state
                    const mergedOrder = {
                        ...activeOrder,
                        status: latest.status,
                        rider: latest.rider || activeOrder.rider,
                        eta: latest.eta || activeOrder.eta,
                        totals: latest.totals || activeOrder.totals
                    };
                    setActiveOrder(mergedOrder);
                }
            } catch (error) {
                console.error("Live tracking error:", error);
            }
        };

        const intervalId = setInterval(fetchOrderLive, 10000);
        return () => clearInterval(intervalId);
    }, [isMounted, activeOrder]);

    if (!isMounted) {
        return (
            <div className="inner-wrapper track-page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #e11d48', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!activeOrder) {
        return (
            <div className="inner-wrapper track-page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>No Active Order Found</h2>
                    <p>It seems you don't have an ongoing order to track.</p>
                    <Link href="/foods" className="back-to-shop-link" style={{ marginTop: '20px', display: 'inline-flex' }}>
                        <FiArrowLeft size={16} />
                        <span>Continue Ordering</span>
                    </Link>
                </div>
            </div>
        );
    }

    const orderMode = activeOrder.orderType || "delivery";
    const orderedItems = activeOrder.items || [];
    const orderId = activeOrder.id || activeOrder._id?.substring(activeOrder._id.length - 6).toUpperCase();

    // Determine current step based on order status
    let stepIndex = 0;
    const status = activeOrder.status || "PENDING";
    if (status === "CONFIRMED") stepIndex = 0;
    else if (status === "PREPARING") stepIndex = 1;
    else if (status === "READY_FOR_PICKUP" || status === "OUT_FOR_DELIVERY") stepIndex = 2;
    else if (status === "DELIVERED") stepIndex = 3;

    const deliverySteps = [
        {
            id: 0,
            title: "Order Placed",
            time: activeOrder.placedAt || new Date(activeOrder.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
            desc: activeOrder.rider ? `Rider ${activeOrder.rider.name} is arriving` : "Assigning rider...",
            icon: <FaMotorcycle size={17} />,
        },
        {
            id: 3,
            title: "Delivered",
            time: activeOrder.eta || "Est. Time",
            desc: "Enjoy your hot, authentic delicious food",
            icon: <FiCheck size={18} />,
        },
    ];

    const takeawaySteps = [
        {
            id: 0,
            title: "Order Placed",
            time: activeOrder.placedAt || new Date(activeOrder.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
            time: `Slot: ${activeOrder.pickupSlot || "15"} Mins`,
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
            time: activeOrder.placedAt || new Date(activeOrder.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            desc: `Table #${activeOrder.tableNo || "T-04"} order sent to kitchen`,
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
            time: `Table #${activeOrder.tableNo || "T-04"}`,
            desc: `Served fresh to your table #${activeOrder.tableNo || "T-04"}`,
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
                                        <h2 className="eta-heading">{activeOrder.eta || (orderMode === "takeaway" ? "15-20 Mins" : "30-40 Mins")}</h2>
                                        <p className="eta-subtext">Estimated {orderMode === "takeaway" ? "Pickup" : "Arrival"} Time</p>
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
                                            ? `Takeaway (Pickup in ${activeOrder.pickupSlot || 15}m)`
                                            : `Dine-In (Table ${activeOrder.tableNo || "04"})`}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="track-timeline-card">
                            <h3 className="track-card-title">Order Status Progress</h3>

                            <div className="timeline-stepper">
                                {activeSteps.map((step, idx) => {
                                    const isDone = idx < stepIndex;
                                    const isCurrent = idx === stepIndex;

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

                        {orderMode === "delivery" && activeOrder.rider && (
                            <div className="rider-contact-card">
                                <div className="rider-avatar-wrap">
                                    <div className="rider-avatar-placeholder">
                                        <FaMotorcycle size={22} />
                                    </div>
                                    <div>
                                        <h4 className="rider-name">{activeOrder.rider.name}</h4>
                                        <p className="rider-service">Delivery Partner ({activeOrder.rider.provider || 'Express'})</p>
                                        {activeOrder.rider.otp && (
                                            <div className="otp-verification-pill">
                                                <span>Delivery OTP:</span>
                                                <strong>{activeOrder.rider.otp}</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rider-action-btns">
                                    {activeOrder.rider.phone && (
                                        <a href={`tel:${activeOrder.rider.phone}`} className="rider-btn call-btn">
                                            <FiPhone size={15} />
                                            <span>Call</span>
                                        </a>
                                    )}
                                    {activeOrder.rider.phone && (
                                        <a href={`https://wa.me/${activeOrder.rider.phone.replace(/[^0-9]/g, '')}`} className="rider-btn chat-btn" target="_blank" rel="noopener noreferrer">
                                            <FiMessageSquare size={15} />
                                            <span>WhatsApp</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeOrder.customer?.address && (
                            <div className="delivery-destination-card">
                                <div className="dest-icon-wrap">
                                    <FiMapPin size={20} />
                                </div>
                                <div className="dest-info">
                                    <h4 className="dest-title">Delivery Destination</h4>
                                    <p className="dest-address">{activeOrder.customer.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="track-sidebar-col">
                        <div className="track-summary-card">
                            <h3 className="track-card-title">Order Items ({orderedItems.length})</h3>

                            <div className="track-items-list">
                                {orderedItems.map((item, index) => (
                                    <div key={item.cartItemId || item.id || item._id || index} className="track-item-row">
                                        {item.image && (
                                            <div className="track-item-img-wrap">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title || "Item"}
                                                    width={48}
                                                    height={48}
                                                    className="track-item-img"
                                                />
                                            </div>
                                        )}
                                        <div className="track-item-info">
                                            <h5 className="track-item-name">{item.title}</h5>
                                            <span className="track-item-qty">
                                                Qty: {item.quantity} {item.portionLabel ? `• Portion: ${item.portionLabel}` : ''}
                                            </span>
                                        </div>
                                        <span className="track-item-price">
                                            ₹{((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="track-price-breakdown">
                                <div className="breakdown-row">
                                    <span>Item Total</span>
                                    <span>₹{(activeOrder.totals?.subtotal || activeOrder.subtotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Delivery Partner Fee</span>
                                    <span>
                                        {orderMode === "delivery" && (activeOrder.totals?.deliveryFee || activeOrder.deliveryFee)
                                            ? `₹${(activeOrder.totals?.deliveryFee || activeOrder.deliveryFee).toFixed(2)}`
                                            : "FREE"}
                                    </span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Platform Fee</span>
                                    <span>₹{(activeOrder.totals?.platformFee || activeOrder.platformFee || 0).toFixed(2)}</span>
                                </div>
                                {(activeOrder.totals?.discount > 0 || activeOrder.discount > 0) && (
                                    <div className="breakdown-row">
                                        <span>Discount</span>
                                        <span className="discount-val">-₹{(activeOrder.totals?.discount || activeOrder.discount || 0).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="breakdown-row">
                                    <span>Taxes & GST (5%)</span>
                                    <span>₹{(activeOrder.totals?.tax || activeOrder.tax || 0).toFixed(2)}</span>
                                </div>
                                <div className="breakdown-row total-row">
                                    <span>Total Amount Paid</span>
                                    <span className="grand-total-val">
                                        ₹{(activeOrder.totals?.grandTotal || activeOrder.grandTotal || 0).toFixed(2)}
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
