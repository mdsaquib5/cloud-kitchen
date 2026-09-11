"use client";

import React, { useState, useEffect } from "react";
import {
    FiSearch,
    FiTruck,
    FiPhone,
    FiMapPin,
    FiClock,
    FiCheckCircle,
    FiRefreshCw,
    FiAlertTriangle,
    FiShield,
    FiSend,
} from "react-icons/fi";
import { FaMotorcycle, FaCircle } from "react-icons/fa";
import { toast } from "sonner";
import orderService from "@/services/orderService";

const Dispatch = () => {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDispatches = async () => {
        try {
            const res = await orderService.getAllOrders();
            const data = res.data;
            if (data.success) {
                const activeDispatches = (data.orders || [])
                    .filter(
                        (o) =>
                            o.orderType === "delivery" &&
                            (o.status === "READY_FOR_PICKUP" || o.status === "OUT_FOR_DELIVERY")
                    )
                    .map((o) => {
                        const isDelivery = o.orderType === "delivery";
                        const partnerName = o.deliveryPartner ? `${o.deliveryPartner.toUpperCase()} Logistics` : "Pidge Network";

                        return {
                            id: o._id.substring(o._id.length - 6).toUpperCase(),
                            originalId: o._id,
                            orderId: o.orderId,
                            customerName: o.customer?.name || "Customer",
                            customerPhone: o.customer?.phone || "N/A",
                            address: o.customer?.address || "No Address Provided",
                            orderValue: o.totals?.grandTotal || 0,
                            itemsCount: (o.items || []).reduce((acc, item) => acc + item.quantity, 0),
                            status: o.status === "READY_FOR_PICKUP" ? "RIDER_ASSIGNED" : "OUT_FOR_DELIVERY",
                            provider: partnerName,
                            riderName: o.courierInfo?.name || (o.status === "OUT_FOR_DELIVERY" ? "Rider in transit" : "Assigning Nearest Rider..."),
                            riderPhone: o.courierInfo?.phone || "-",
                            eta: o.status === "OUT_FOR_DELIVERY" ? "Live GPS Active" : "Arriving at Kitchen",
                            otp: o.courierInfo?.otp || "Verified",
                            dispatchTime: new Date(o.updatedAt || o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                    });
                setDispatches(activeDispatches);
            }
        } catch (error) {
            console.error("Failed to fetch dispatch orders", error);
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                toast.error("Failed to load dispatch data");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispatches();
        const interval = setInterval(fetchDispatches, 10000);
        return () => clearInterval(interval);
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const confirmHandover = async (dispatchId) => {
        try {
            const orderToUpdate = dispatches.find((d) => d.id === dispatchId);
            if (!orderToUpdate) return;

            // When handed to 3PL rider at the restaurant counter, order moves to OUT_FOR_DELIVERY
            const nextStatus = "OUT_FOR_DELIVERY";
            const res = await orderService.updateOrderStatus(orderToUpdate.originalId, nextStatus);
            const data = res.data;
            if (data.success) {
                fetchDispatches();
                toast.success(`Order #${dispatchId} handed to rider! Now Out for Delivery.`);
            } else {
                toast.error("Failed to handover order");
            }
        } catch (error) {
            toast.error("Error during handover");
        }
    };

    const markDelivered = async (dispatchId) => {
        try {
            const orderToUpdate = dispatches.find((d) => d.id === dispatchId);
            if (!orderToUpdate) return;

            const res = await orderService.updateOrderStatus(orderToUpdate.originalId, "DELIVERED");
            if (res.data?.success) {
                fetchDispatches();
                toast.success(`Order #${dispatchId} marked DELIVERED! Moved to Order History.`);
            } else {
                toast.error("Failed to mark delivered");
            }
        } catch (error) {
            toast.error("Error updating order status");
        }
    };

    const filteredList = dispatches.filter((d) => {
        const matchesStatus = statusFilter === "all" || d.status === statusFilter;
        const matchesSearch =
            searchQuery === "" ||
            d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.provider.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="dispatch-screen">
            <div className="dispatch-top-header">
                <div className="dispatch-title-wrap">
                    <h2>3PL &amp; Logistics Dispatch</h2>
                    <p>Automated multi-partner rider fulfillment via Pidge Delivery Network.</p>
                </div>
            </div>
            <div className="dispatch-controls-bar">
                <div className="dispatch-search-field">
                    <FiSearch className="search-ico" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Rider Name, Customer or Partner..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="dispatch-input"
                    />
                </div>

                <div className="dispatch-filter-pills">
                    <button
                        type="button"
                        className={`dispatch-filter-btn ${statusFilter === "all" ? "active" : ""}`}
                        onClick={() => setStatusFilter("all")}
                    >
                        All ({dispatches.length})
                    </button>
                    <button
                        type="button"
                        className={`dispatch-filter-btn ${statusFilter === "RIDER_ASSIGNED" ? "active" : ""}`}
                        onClick={() => setStatusFilter("RIDER_ASSIGNED")}
                    >
                        At Kitchen / Pickup ({dispatches.filter((d) => d.status === "RIDER_ASSIGNED").length})
                    </button>
                    <button
                        type="button"
                        className={`dispatch-filter-btn ${statusFilter === "OUT_FOR_DELIVERY" ? "active" : ""}`}
                        onClick={() => setStatusFilter("OUT_FOR_DELIVERY")}
                    >
                        On the Road ({dispatches.filter((d) => d.status === "OUT_FOR_DELIVERY").length})
                    </button>
                </div>
            </div>

            <div className="dispatch-cards-grid">
                {filteredList.map((item) => (
                    <div key={item.id} className={`dispatch-card ${item.status.toLowerCase()}`}>
                        <div className="d-card-header">
                            <div className="d-id-block">
                                <span className="order-id">#{item.id}</span>
                                <span className="d-provider-tag">{item.provider}</span>
                            </div>
                            <span className={`d-status-pill ${item.status.toLowerCase()}`}>
                                {item.status === "RIDER_ASSIGNED" && "Rider at Counter"}
                                {item.status === "OUT_FOR_DELIVERY" && "On the Road"}
                                {item.status === "DELIVERED" && "Delivered"}
                            </span>
                        </div>

                        <div className="d-rider-box">
                            <div className="rider-avatar">
                                <FaMotorcycle size={16} />
                            </div>
                            <div className="rider-details">
                                <span className="rider-name">{item.riderName}</span>
                                <div className="rider-sub">
                                    {item.riderPhone !== "-" && (
                                        <a href={`tel:${item.riderPhone}`} className="rider-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: '500' }}>
                                            <FiPhone size={11} /> {item.riderPhone}
                                        </a>
                                    )}
                                    <span className="rider-eta">
                                        <FiClock size={11} /> {item.eta}
                                    </span>
                                </div>
                            </div>
                            <div className="d-otp-box">
                                <span className="otp-lbl">Partner</span>
                                <span className="otp-val" style={{ fontSize: "11px", fontWeight: "bold" }}>{item.provider.split(" ")[0]}</span>
                            </div>
                        </div>

                        <div className="d-destination-box">
                            <div className="dest-row">
                                <FiMapPin className="pin-ico" size={14} />
                                <span className="dest-addr">{item.address}</span>
                            </div>
                            <div className="cust-row">
                                <span className="cust-lbl">Customer:</span>
                                <strong className="cust-val">
                                    {item.customerName} ({item.customerPhone})
                                </strong>
                            </div>
                        </div>

                        <div className="d-card-footer">
                            <div className="order-meta-info">
                                <span>{item.itemsCount} Items</span>
                                <strong>₹{item.orderValue}</strong>
                            </div>

                            <div className="d-actions">
                                {item.status === "RIDER_ASSIGNED" && (
                                    <button
                                        type="button"
                                        className="d-btn handover"
                                        onClick={() => confirmHandover(item.id)}
                                    >
                                        <FiCheckCircle size={14} />
                                        <span>Handover &amp; Dispatch</span>
                                    </button>
                                )}

                                {item.status === "OUT_FOR_DELIVERY" && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span className="live-track-note">
                                            <FaCircle className="pulse-green" size={7} />
                                            <span>On the Road</span>
                                        </span>
                                        <button
                                            type="button"
                                            className="d-btn delivered"
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '11px',
                                                background: '#10b981',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontWeight: '600'
                                            }}
                                            onClick={() => markDelivered(item.id)}
                                            title="Mark delivered once rider completes drop-off"
                                        >
                                            <FiCheckCircle size={13} />
                                            <span>Mark Delivered</span>
                                        </button>
                                    </div>
                                )}

                                {item.status === "DELIVERED" && (
                                    <span className="delivered-note">
                                        <FiCheckCircle size={14} />
                                        <span>Delivery Completed</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dispatch;
