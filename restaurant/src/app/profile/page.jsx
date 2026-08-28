"use client";
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiX, FiCheckCircle } from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";

const Profile = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [pastOrders, setPastOrders] = useState([]);

    // Tracking Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const fetchUserOrders = async (token) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user`, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            });
            const data = await res.json();
            if (data.success) {
                setPastOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch user orders:", error);
        }
    };

    // Authentication check
    useEffect(() => {
        if (mounted) {
            const token = useAuthStore.getState().accessToken;
            if (!useAuthStore.getState().isAuthenticated || !token) {
                router.push("/login");
            } else {
                fetchUserOrders(token);
            }
        }
    }, [mounted]);

    const handleLogout = () => {
        clearAuth();
        router.push("/login");
    };

    const handleTrackOrder = async (order) => {
        setSelectedOrder(order);
        setIsTracking(true);
        setLiveStatus(order); // fallback to stored state initially

        try {
            const idToFetch = order.orderId || order.id || order._id;
            if (!idToFetch) return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/track/${idToFetch}`);
            const data = await res.json();
            if (data.success && data.order) {
                setLiveStatus(data.order);
            }
        } catch (error) {
            console.error("Tracking fetch error:", error);
        }
    };

    const closeTracking = () => {
        setIsTracking(false);
        setSelectedOrder(null);
        setLiveStatus(null);
    };

    if (!mounted) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>;
    if (!isAuthenticated) return <div style={{ padding: '50px', textAlign: 'center' }}>Redirecting to login...</div>;

    return (
        <div className="inner-wrapper profile-page-wrapper">
            <div className="container">
                <div className="cart-header-strip" style={{ marginBottom: '30px' }}>
                    <Link href="/foods" className="back-to-shop-link">
                        <FiArrowLeft size={16} />
                        <span>Back to Menu</span>
                    </Link>
                </div>

                <div className="profile-header">
                    <h2>Order History</h2>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginRight: '15px'
                        }}
                    >
                        Logout
                    </button>
                    <div className="sort-dropdown">
                        <span style={{ color: '#6b7280', marginRight: '10px' }}>Sort By :</span>
                        <select className="checkout-input" style={{ width: 'auto', padding: '8px 15px' }}>
                            <option>Newest Orders</option>
                            <option>Oldest Orders</option>
                        </select>
                    </div>
                </div>

                {pastOrders.length === 0 ? (
                    <div className="empty-cart-state" style={{ marginTop: '40px' }}>
                        <h2>No Past Orders</h2>
                        <p>Looks like you haven\'t placed any orders yet.</p>
                        <Link href="/foods" className="explore-menu-btn" style={{ marginTop: '20px' }}>
                            <span>Explore Menu</span>
                        </Link>
                    </div>
                ) : (
                    <div className="past-orders-list">
                        {pastOrders.map((order, idx) => {
                            const orderId = order.orderId || order.id || (order._id ? order._id.substring(order._id.length - 6).toUpperCase() : `ORD${idx}`);
                            const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

                            // Determine status color
                            const status = (order.status || "PENDING").toLowerCase();
                            let statusClass = "inprogress";
                            if (status === "delivered" || status === "completed") statusClass = "completed";
                            if (status === "cancelled") statusClass = "cancelled";

                            return (
                                <div key={orderId + idx} className="past-order-card">
                                    <div className="po-img-wrap">
                                        {firstItem && firstItem.image ? (
                                            <Image
                                                src={firstItem.image}
                                                alt={firstItem.title}
                                                width={100}
                                                height={80}
                                                className="po-img"
                                            />
                                        ) : (
                                            <div className="po-img-placeholder"><FaUtensils size={24} /></div>
                                        )}
                                    </div>

                                    <div className="po-main-info">
                                        <h4 className="po-title">
                                            {firstItem ? firstItem.title : "Custom Order"}
                                            {order.items && order.items.length > 1 && ` + ${order.items.length - 1} more`}
                                        </h4>
                                        <span className="po-id">Order ID : {orderId}</span>
                                    </div>

                                    <div className="po-meta-info">
                                        <span className="po-label">Restaurant</span>
                                        <span className="po-value">Your\'s Kitchen</span>
                                    </div>

                                    <div className="po-meta-info">
                                        <span className="po-label">Date</span>
                                        <span className="po-value">{order.placedAt || new Date().toLocaleDateString()}</span>
                                    </div>

                                    <div className="po-meta-info">
                                        <span className="po-label">Price</span>
                                        <span className="po-value">₹{(order.totals?.grandTotal || order.grandTotal || 0).toFixed(2)}</span>
                                    </div>

                                    <div className="po-status-col">
                                        <span className="po-label">Status</span>
                                        <span className={`po-status-badge ${statusClass}`}>
                                            {status.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    <div className="po-actions">
                                        <button className="po-track-btn" onClick={() => handleTrackOrder(order)}>
                                            Track
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Tracking Modal */}
            {isTracking && selectedOrder && (
                <div className="tracking-modal-overlay" onClick={closeTracking}>
                    <div className="tracking-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeTracking}>
                            <FiX size={20} />
                        </button>

                        <div className="tm-header">
                            <h3>Live Order Tracking</h3>
                            <p>Order #{selectedOrder.orderId || selectedOrder.id}</p>
                        </div>

                        <div className="tm-body">
                            <TrackingTimeline order={liveStatus || selectedOrder} />
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

// Extracted simplified tracking timeline for modal
const TrackingTimeline = ({ order }) => {
    if (!order) return null;

    const orderMode = order.orderType || "delivery";

    let stepIndex = 0;
    const status = order.status || "PENDING";
    if (status === "CONFIRMED") stepIndex = 0;
    else if (status === "PREPARING") stepIndex = 1;
    else if (status === "READY_FOR_PICKUP" || status === "OUT_FOR_DELIVERY") stepIndex = 2;
    else if (status === "DELIVERED" || status === "COMPLETED") stepIndex = 3;

    const deliverySteps = [
        { id: 0, title: "Order Placed", desc: "Received & confirmed", icon: <FiCheckCircle size={18} /> },
        { id: 1, title: "Kitchen Preparing", desc: "Chef is cooking", icon: <FaUtensils size={16} /> },
        { id: 2, title: "On the Way", desc: order.rider ? `Rider ${order.rider.name}` : "Dispatched", icon: <FaMotorcycle size={17} /> },
        { id: 3, title: "Delivered", desc: "Completed", icon: <FiCheckCircle size={18} /> },
    ];

    const takeawaySteps = [
        { id: 0, title: "Order Placed", desc: "Received & confirmed", icon: <FiCheckCircle size={18} /> },
        { id: 1, title: "Kitchen Preparing", desc: "Chef is packing", icon: <FaUtensils size={16} /> },
        { id: 2, title: "Ready for Pickup", desc: "At the counter", icon: <FaStoreAlt size={16} /> },
        { id: 3, title: "Picked Up", desc: "Handover complete", icon: <FiCheckCircle size={18} /> },
    ];

    const dineInSteps = [
        { id: 0, title: "Order Placed", desc: `Table ${order.tableNo || "T-04"}`, icon: <FiCheckCircle size={18} /> },
        { id: 1, title: "Kitchen Cooking", desc: "In Progress", icon: <FaUtensils size={16} /> },
        { id: 2, title: "Food Ready", desc: "Plating Done", icon: <FaUtensils size={16} /> },
        { id: 3, title: "Served at Table", desc: "Enjoy your meal", icon: <FiCheckCircle size={18} /> },
    ];

    const activeSteps = orderMode === "delivery" ? deliverySteps : orderMode === "takeaway" ? takeawaySteps : dineInSteps;

    return (
        <div className="mini-timeline-container">
            <div className="mini-timeline">
                {activeSteps.map((step, idx) => {
                    const isDone = idx < stepIndex;
                    const isCurrent = idx === stepIndex;
                    const statusClass = isDone ? "done" : isCurrent ? "current" : "pending";

                    return (
                        <div key={step.id} className={`mini-step ${statusClass}`}>
                            <div className="ms-icon-col">
                                <div className="ms-icon-wrap">
                                    <div className="ms-icon">{step.icon}</div>
                                </div>
                                {idx < activeSteps.length - 1 && <div className="ms-line"></div>}
                            </div>
                            <div className="ms-content">
                                <h4>{step.title}</h4>
                                <p>{step.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

export default Profile;

