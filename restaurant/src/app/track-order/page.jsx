"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiPhone,
    FiArrowLeft,
    FiCheck,
    FiShield,
    FiAlertCircle,
    FiXCircle,
    FiRefreshCw,
} from "react-icons/fi";
import { FaMotorcycle, FaUtensils, FaStoreAlt } from "react-icons/fa";
import { io } from "socket.io-client";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import EmptyState from "@/components/shared/EmptyState";
import orderService from "@/services/orderService";

function TrackOrderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlOrderId = searchParams.get("id");

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const activeOrders = useStore((state) => state.activeOrders || []);
    const syncActiveOrders = useStore((state) => state.syncActiveOrders);
    const updateActiveOrder = useStore((state) => state.updateActiveOrder);
    const dismissActiveOrder = useStore((state) => state.dismissActiveOrder);

    const [isMounted, setIsMounted] = useState(false);
    const [fetchedOrder, setFetchedOrder] = useState(null);
    const [fetchingUrlOrder, setFetchingUrlOrder] = useState(false);

    const socketRef = useRef(null);
    const joinedRoomsRef = useRef(new Set());

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If an order ID is provided in URL (?id=YK-XXXX) and not already in activeOrders, fetch it directly
    useEffect(() => {
        if (!isMounted || !urlOrderId) return;

        const existsInStore = activeOrders.some(
            (o) => (o.orderId && o.orderId.toUpperCase() === urlOrderId.toUpperCase()) ||
                (o.id && o.id.toUpperCase() === urlOrderId.toUpperCase())
        );

        if (!existsInStore) {
            setFetchingUrlOrder(true);
            orderService.trackOrder(urlOrderId)
                .then((res) => {
                    if (res.data?.success && res.data?.order) {
                        setFetchedOrder(res.data.order);
                    }
                })
                .catch((err) => console.warn("Failed to fetch order from URL query:", err))
                .finally(() => setFetchingUrlOrder(false));
        }
    }, [isMounted, urlOrderId, activeOrders]);

    // Real-time tracking: Connect to Socket.io ONCE and keep connection active
    useEffect(() => {
        if (!isMounted) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");
        const socket = io(socketUrl, {
            transports: ["websocket", "polling"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            // Re-join active tracking rooms if socket reconnects
            joinedRoomsRef.current.forEach((id) => {
                socket.emit("join-order-tracking", id);
            });
        });

        socket.on("order-status-update", (data) => {
            if (data && data.orderId) {
                // Update Zustand store directly without tearing down socket
                useStore.getState().updateActiveOrder(data.orderId, {
                    status: data.status,
                    courierInfo: data.courierInfo,
                    trackingUrl: data.trackingUrl || data.borzoTrackingUrl,
                });

                setFetchedOrder((prev) => {
                    if (prev && (prev.orderId === data.orderId || prev.id === data.orderId)) {
                        return {
                            ...prev,
                            status: data.status,
                            courierInfo: data.courierInfo,
                            trackingUrl: data.trackingUrl || data.borzoTrackingUrl,
                        };
                    }
                    return prev;
                });
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isMounted]);

    // Join tracking room whenever new order IDs are found (without reconnecting socket)
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !isMounted) return;

        const idsToTrack = new Set();
        activeOrders.forEach((order) => {
            const id = order.orderId || order.id;
            if (id) idsToTrack.add(id);
        });
        if (fetchedOrder) {
            const id = fetchedOrder.orderId || fetchedOrder.id;
            if (id) idsToTrack.add(id);
        }

        idsToTrack.forEach((id) => {
            if (!joinedRoomsRef.current.has(id)) {
                socket.emit("join-order-tracking", id);
                joinedRoomsRef.current.add(id);
            }
        });
    }, [isMounted, activeOrders, fetchedOrder]);

    // Fallback polling every 10 seconds
    useEffect(() => {
        if (!isMounted || activeOrders.length === 0) return;

        syncActiveOrders();
        const intervalId = setInterval(syncActiveOrders, 10000);
        return () => clearInterval(intervalId);
    }, [isMounted, activeOrders.length, syncActiveOrders]);

    if (!isMounted || fetchingUrlOrder) {
        return (
            <div className="inner-wrapper track-page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #e11d48', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Helper: is an order still in-progress / actively ongoing?
    const isOrderActive = (o) => {
        const s = (o?.status || "").toUpperCase();
        return s && !["DELIVERED", "CANCELLED"].includes(s);
    };

    // Smart Multi-Order Handling:
    // 1. If customer came from a specific order link (?id=YK-XXXX), feature that order
    // 2. Also include any other ongoing active orders (if customer placed multiple active orders)
    // 3. Never clutter the live tracking screen with old already-delivered orders when active orders exist!
    let displayOrders = [];

    if (urlOrderId) {
        const queryOrder = activeOrders.find(
            (o) => (o.orderId && o.orderId.toUpperCase() === urlOrderId.toUpperCase()) ||
                (o.id && o.id.toUpperCase() === urlOrderId.toUpperCase())
        ) || fetchedOrder;

        if (queryOrder) {
            const otherActive = activeOrders.filter(
                (o) => isOrderActive(o) &&
                    o.orderId?.toUpperCase() !== urlOrderId.toUpperCase() &&
                    o.id?.toUpperCase() !== urlOrderId.toUpperCase()
            );
            displayOrders = [queryOrder, ...otherActive];
        }
    }

    if (displayOrders.length === 0) {
        // If no query param, show ALL currently active orders
        const activeOnly = activeOrders.filter(isOrderActive);
        if (activeOnly.length > 0) {
            displayOrders = activeOnly;
        } else if (activeOrders.length > 0 || fetchedOrder) {
            // If ALL orders are already delivered, show ONLY the single most recent order so user sees delivery celebration
            const latest = fetchedOrder || activeOrders[activeOrders.length - 1];
            displayOrders = latest ? [latest] : [];
        }
    }

    if (displayOrders.length === 0) {
        return (
            <div className="inner-wrapper track-page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <EmptyState
                        title="No Ongoing Orders"
                        description="You don't have any active orders to track right now."
                        buttonText="Start a Delicious Order"
                        buttonHref="/foods"
                        icon={<FaMotorcycle size={48} />}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="inner-wrapper track-page-wrapper">
            <div className="container">
                <div className="cart-header-strip">
                    <Link href="/foods" className="back-to-shop-link">
                        <FiArrowLeft size={16} />
                        <span>Continue Ordering</span>
                    </Link>
                </div>

                {displayOrders.map((activeOrder, index) => {
                    const orderMode = activeOrder.orderType || "delivery";
                    const orderedItems = activeOrder.items || [];
                    const orderId = activeOrder.orderId || activeOrder.id || (activeOrder._id ? activeOrder._id.substring(activeOrder._id.length - 6).toUpperCase() : "ORDER");
                    const status = (activeOrder.status || "PLACED").toUpperCase();

                    let stepIndex = 0;
                    if (status === "CONFIRMED") stepIndex = 0;
                    else if (status === "PREPARING") stepIndex = 1;
                    else if (status === "READY_FOR_PICKUP") stepIndex = 1; // Food ready, packed
                    else if (status === "OUT_FOR_DELIVERY") stepIndex = 2; // Rider in transit
                    else if (status === "DELIVERED") stepIndex = 3;

                    const isCancelled = status === "CANCELLED";
                    const isDelivered = status === "DELIVERED";

                    const deliveryPartnerLabel = activeOrder.deliveryPartner
                        ? `${activeOrder.deliveryPartner.toUpperCase()} Delivery Partner`
                        : "Pidge Delivery Partner";

                    const deliverySteps = [
                        { id: 0, title: "Order Placed & Confirmed", time: activeOrder.placedAt || "Received", desc: `Order #${orderId} confirmed with kitchen`, icon: <FiCheckCircle size={18} /> },
                        { id: 1, title: "Kitchen Preparing", time: status === "READY_FOR_PICKUP" ? "Packed & Ready" : "Cooking", desc: status === "READY_FOR_PICKUP" ? "Dishes freshly packed and ready for rider pickup" : "Chef is handcrafting your gourmet meal", icon: <FaUtensils size={16} /> },
                        { id: 2, title: "Rider On the Way", time: status === "OUT_FOR_DELIVERY" ? "In Transit" : "Dispatched", desc: (activeOrder.courierInfo?.name || activeOrder.rider?.name) ? `Rider ${activeOrder.courierInfo?.name || activeOrder.rider?.name} is on the way to you` : "Delivery rider dispatched", icon: <FaMotorcycle size={17} /> },
                        { id: 3, title: "Delivered", time: isDelivered ? "Delivered" : "Est. Arrival", desc: isDelivered ? "Order successfully delivered! Enjoy your authentic meal!" : "Estimated handover at your doorstep", icon: <FiCheck size={18} /> },
                    ];

                    const takeawaySteps = [
                        { id: 0, title: "Order Placed", time: activeOrder.placedAt || "Confirmed", desc: `Takeaway order #${orderId} received & confirmed`, icon: <FiCheckCircle size={18} /> },
                        { id: 1, title: "Kitchen Preparing", time: "In Progress", desc: "Chef is packing your meal hot & fresh", icon: <FaUtensils size={16} /> },
                        { id: 2, title: "Ready for Pickup", time: "At Counter", desc: "Your order is ready at the restaurant pickup counter", icon: <FaStoreAlt size={16} /> },
                        { id: 3, title: "Picked Up", time: isDelivered ? "Handed Over" : "Ready", desc: "Order handed over to customer", icon: <FiCheck size={18} /> },
                    ];

                    const dineInSteps = [
                        { id: 0, title: "Order Placed", time: activeOrder.placedAt || "Confirmed", desc: `Table #${activeOrder.tableNo || "T-04"} order sent to kitchen`, icon: <FiCheckCircle size={18} /> },
                        { id: 1, title: "Kitchen Cooking", time: "In Progress", desc: "Fresh sizzlers & gravies on the flame", icon: <FaUtensils size={16} /> },
                        { id: 2, title: "Food Ready", time: "Plated", desc: "Plating and garnishing completed", icon: <FaUtensils size={16} /> },
                        { id: 3, title: "Served at Table", time: `Table #${activeOrder.tableNo || "T-04"}`, desc: `Served fresh to your table`, icon: <FiCheck size={18} /> },
                    ];

                    const activeSteps = orderMode === "delivery" ? deliverySteps : orderMode === "takeaway" ? takeawaySteps : dineInSteps;

                    return (
                        <div key={orderId || index} style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: index < displayOrders.length - 1 ? '2px dashed #e2e8f0' : 'none' }}>

                            <div className="track-layout-grid">
                                <div className="track-main-col">
                                    <div className="track-status-banner">
                                        <div className="status-live-pill" style={isCancelled ? { background: '#ef4444' } : isDelivered ? { background: '#10b981' } : {}}>
                                            <span className="live-pulse-dot" style={isCancelled || isDelivered ? { animation: 'none', background: '#fff' } : {}}></span>
                                            <span>{isCancelled ? "ORDER CANCELLED" : isDelivered ? "ORDER DELIVERED" : "LIVE REAL-TIME TRACKING"}</span>
                                        </div>

                                        <div className="status-eta-block">
                                            <div className="eta-time-wrap">
                                                <FiClock size={24} className="eta-icon" />
                                                <div>
                                                    <h2 className="eta-heading">
                                                        {isCancelled ? "Cancelled" : isDelivered ? "Delivered 🎉" : (activeOrder.eta || (orderMode === "takeaway" ? "15-20 Mins" : "25-35 Mins"))}
                                                    </h2>
                                                    <p className="eta-subtext">
                                                        {isCancelled ? "This order was cancelled" : isDelivered ? "Hope you loved your meal!" : `Estimated ${orderMode === "takeaway" ? "Pickup" : "Arrival"} Time`}
                                                    </p>
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
                                                            ? `Takeaway (Counter Pickup)`
                                                            : `Dine-In (Table ${activeOrder.tableNo || "04"})`}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cancelled Banner */}
                                    {isCancelled && (
                                        <div style={{ padding: "18px", backgroundColor: "#fee2e2", border: "1px solid #f87171", borderRadius: "10px", color: "#991b1b", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                                            <FiXCircle size={24} />
                                            <div>
                                                <strong>This order was cancelled.</strong>
                                                <div style={{ fontSize: "13px", marginTop: "2px" }}>If you made an online payment, your refund will automatically reflect in your original payment method within 3 to 5 business days.</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Delivered Celebration Card */}
                                    {isDelivered && (
                                        <div style={{ padding: "20px", backgroundColor: "#dcfce7", border: "1px solid #86efac", borderRadius: "12px", color: "#166534", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                                <FiCheckCircle size={28} color="#16a34a" />
                                                <div>
                                                    <strong style={{ fontSize: "17px" }}>Order Delivered Successfully!</strong>
                                                    <div style={{ fontSize: "13px", marginTop: "2px", color: "#15803d" }}>We hope you enjoy your delicious food from Shree Shyam Fast Food.</div>
                                                </div>
                                            </div>
                                            <div>
                                                <Link
                                                    href="/foods"
                                                    onClick={() => dismissActiveOrder(orderId)}
                                                    style={{
                                                        padding: "10px 20px",
                                                        backgroundColor: "#16a34a",
                                                        color: "#fff",
                                                        borderRadius: "8px",
                                                        textDecoration: "none",
                                                        fontSize: "14px",
                                                        fontWeight: "700",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        boxShadow: "0 2px 6px rgba(22, 163, 74, 0.35)",
                                                        transition: "transform 0.15s ease"
                                                    }}
                                                >
                                                    <FiRefreshCw size={14} />
                                                    <span>Order Again</span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {!isCancelled && (
                                        <div className="track-timeline-card">
                                            <h3 className="track-card-title">Order Status Progress</h3>

                                            <div className="timeline-stepper">
                                                {activeSteps.map((step, idx) => {
                                                    const isDone = isDelivered ? true : idx < stepIndex;
                                                    const isCurrent = isDelivered ? false : idx === stepIndex;

                                                    return (
                                                        <div
                                                            key={step.id}
                                                            className={`timeline-step-item ${isDone ? "step-done" : isCurrent ? "step-current" : "step-pending"}`}
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
                                    )}

                                    {orderMode === "delivery" && (activeOrder.rider || activeOrder.courierInfo) && (
                                        <div className="rider-contact-card">
                                            <div className="rider-avatar-wrap">
                                                {activeOrder.courierInfo?.photo_url ? (
                                                    <img
                                                        src={activeOrder.courierInfo.photo_url}
                                                        alt="Rider"
                                                        style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div className="rider-avatar-placeholder">
                                                        <FaMotorcycle size={22} />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="rider-name">
                                                        {activeOrder.courierInfo?.name || activeOrder.rider?.name || "Rider Assigned"}
                                                    </h4>
                                                    <p className="rider-service">{deliveryPartnerLabel}</p>
                                                    {activeOrder.rider?.otp && (
                                                        <div className="otp-verification-pill">
                                                            <span>Delivery OTP:</span>
                                                            <strong>{activeOrder.rider.otp}</strong>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rider-action-btns">
                                                {(activeOrder.courierInfo?.phone || activeOrder.rider?.phone) && (
                                                    <a href={`tel:${activeOrder.courierInfo?.phone || activeOrder.rider?.phone}`} className="rider-btn call-btn">
                                                        <FiPhone size={15} />
                                                        <span>Call Rider</span>
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
                                            {orderedItems.map((item, idx) => (
                                                <div key={item.cartItemId || item.id || item._id || idx} className="track-item-row">
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
                                                    <span className="track-item-price">₹{((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}</span>
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
                                                <span>Taxes &amp; GST (5%)</span>
                                                <span>₹{(activeOrder.totals?.tax || activeOrder.tax || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="breakdown-row total-row">
                                                <span>Total Amount</span>
                                                <span className="grand-total-val">
                                                    ₹{(activeOrder.totals?.grandTotal || activeOrder.grandTotal || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="track-security-badge">
                                            <FiShield size={16} className="security-icon" />
                                            <span>Direct Kitchen State Machine Sync</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function TrackOrder() {
    return (
        <Suspense fallback={
            <div className="inner-wrapper track-page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #e11d48', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
