"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiClock, FiMapPin, FiX, FiCheckCircle } from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils } from "react-icons/fa";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";

const Profile = () => {
    const [mounted, setMounted] = useState(false);
    const pastOrders = useStore((state) => state.pastOrders) || [];

    // Tracking Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    // Authentication check
    useEffect(() => {
        if (mounted && !isAuthenticated) {
            window.location.href = '/login';
        }
    }, [mounted, isAuthenticated]);

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/login';
    };

    const handleTrackOrder = async (order) => {
        setSelectedOrder(order);
        setIsTracking(true);
        setLiveStatus(order); // fallback to stored state initially

        try {
            const idToFetch = order.orderId || order.id || order._id;
            if (!idToFetch) return;
            const res = await fetch(`http://localhost:4000/api/orders/track/${idToFetch}`);
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

            <style jsx>{`
                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 15px;
                }
                .profile-header h2 {
                    font-size: 1.8rem;
                    color: #111827;
                    margin: 0;
                }
                .past-orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .past-order-card {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    transition: all 0.2s ease;
                }
                .past-order-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .po-img-wrap {
                    width: 100px;
                    height: 80px;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-right: 20px;
                    flex-shrink: 0;
                    background: #f3f4f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .po-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .po-main-info {
                    flex: 1.5;
                    min-width: 150px;
                }
                .po-title {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 5px 0;
                }
                .po-id {
                    font-size: 0.85rem;
                    color: #3b82f6;
                    font-weight: 500;
                }
                .po-meta-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .po-label {
                    font-size: 0.8rem;
                    color: #6b7280;
                }
                .po-value {
                    font-size: 0.95rem;
                    color: #374151;
                    font-weight: 500;
                }
                .po-status-col {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4px;
                }
                .po-status-badge {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }
                .po-status-badge.inprogress { background: #e0f2fe; color: #0284c7; }
                .po-status-badge.completed { background: #dcfce7; color: #166534; }
                .po-status-badge.cancelled { background: #fee2e2; color: #991b1b; }
                
                .po-actions {
                    margin-left: 20px;
                }
                .po-track-btn {
                    padding: 8px 16px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    color: #111827;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .po-track-btn:hover {
                    border-color: #f01543;
                    color: #f01543;
                }

                /* Modal Styles */
                .tracking-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease;
                }
                .tracking-modal-content {
                    background: white;
                    width: 100%;
                    max-width: 450px;
                    border-radius: 20px;
                    padding: 30px;
                    position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .modal-close-btn {
                    position: absolute;
                    top: 15px; right: 15px;
                    background: #f3f4f6;
                    border: none;
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #4b5563;
                }
                .modal-close-btn:hover { background: #e5e7eb; }
                .tm-header h3 { margin: 0 0 5px 0; font-size: 1.6rem; color: #0f172a; font-weight: 700; letter-spacing: -0.5px; }
                .tm-header p { margin: 0; color: #64748b; font-size: 0.95rem; font-weight: 500; }
                .tm-body { margin-top: 25px; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                
                @media (max-width: 768px) {
                    .past-order-card { flex-wrap: wrap; gap: 15px; }
                    .po-img-wrap { width: 80px; height: 64px; }
                    .po-main-info { min-width: 100%; order: -1; }
                }
            `}</style>
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
            <style jsx>{`
                .mini-timeline-container {
                    padding: 10px 15px;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }
                .mini-timeline { 
                    display: flex;
                    flex-direction: column;
                }
                .mini-step { 
                    display: flex; 
                    gap: 20px; 
                    position: relative;
                }
                .ms-icon-col { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    width: 40px; 
                }
                .ms-icon-wrap {
                    position: relative;
                    width: 40px; 
                    height: 40px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    background: #fff;
                    z-index: 2;
                }
                .ms-icon { 
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    background: #f1f5f9; 
                    color: #94a3b8;
                    transition: all 0.3s ease;
                }
                .ms-line {
                    flex: 1; 
                    width: 2px; 
                    background: #e2e8f0; 
                    margin: 0;
                    min-height: 25px;
                    transition: all 0.3s ease;
                }
                
                /* Done State */
                .mini-step.done .ms-icon {
                    background: #10b981; 
                    color: white;
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }
                .mini-step.done .ms-line { 
                    background: #10b981; 
                }
                
                /* Current State */
                .mini-step.current .ms-icon {
                    background: #f01543; 
                    color: white;
                    box-shadow: 0 0 0 6px rgba(240, 21, 67, 0.15);
                    animation: pulse 2s infinite;
                }
                .mini-step.current .ms-line {
                    background: #e2e8f0;
                    background-image: linear-gradient(to bottom, #f01543 50%, transparent 50%);
                    background-size: 100% 8px;
                    animation: dash 1s linear infinite;
                }
                
                .ms-content {
                    padding-bottom: 25px;
                    padding-top: 8px;
                }
                .mini-step:last-child .ms-content {
                    padding-bottom: 5px;
                }
                .ms-content h4 { 
                    margin: 0 0 4px 0; 
                    font-size: 1.1rem; 
                    color: #0f172a; 
                    font-weight: 600;
                }
                .ms-content p { 
                    margin: 0; 
                    font-size: 0.9rem; 
                    color: #64748b; 
                }
                
                .mini-step.pending .ms-content h4, 
                .mini-step.pending .ms-content p { 
                    color: #94a3b8; 
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(240, 21, 67, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(240, 21, 67, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(240, 21, 67, 0); }
                }
                @keyframes dash {
                    to { background-position: 0 8px; }
                }
            `}</style>
        </div>
    );
}

export default Profile;
