"use client";

import React, { useState } from "react";
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

const mockDispatches = [
    {
        id: "YK-84920",
        customerName: "Rahul Sharma",
        customerPhone: "+91 98765 43210",
        address: "Flat 402, Royal Palms, Cyber City, Gurgaon",
        orderValue: 390,
        itemsCount: 3,
        status: "RIDER_ASSIGNED",
        provider: "Shadowfax",
        riderName: "Sonu Kumar",
        riderPhone: "+91 91234 56780",
        eta: "3 mins to kitchen",
        otp: "4921",
        dispatchTime: "4 mins ago",
    },
    {
        id: "YK-84918",
        customerName: "Amit Kumar",
        customerPhone: "+91 98111 22334",
        address: "Tower B, Sector 29, Gurgaon",
        orderValue: 230,
        itemsCount: 3,
        status: "SEARCHING_RIDER",
        provider: "Borzo (Cascading)",
        riderName: "Assigning nearest rider...",
        riderPhone: "-",
        eta: "Auto-waterfall in 45s",
        otp: "8190",
        dispatchTime: "1 min ago",
    },
    {
        id: "YK-84915",
        customerName: "Vikram Singh",
        customerPhone: "+91 97654 32109",
        address: "House 12, Block C, Sushant Lok",
        orderValue: 190,
        itemsCount: 2,
        status: "OUT_FOR_DELIVERY",
        provider: "Porter",
        riderName: "Deepak Rawat",
        riderPhone: "+91 98990 11223",
        eta: "8 mins to customer",
        otp: "3302",
        dispatchTime: "12 mins ago",
    },
    {
        id: "YK-84912",
        customerName: "Neha Gupta",
        customerPhone: "+91 99100 88776",
        address: "D-44, Golf Course Road, DLF Phase 5",
        orderValue: 480,
        itemsCount: 4,
        status: "DELIVERED",
        provider: "Shiprocket Quick",
        riderName: "Rakesh Yadav",
        riderPhone: "+91 98109 44332",
        eta: "Delivered",
        otp: "6612",
        dispatchTime: "26 mins ago",
    },
];

const Dispatch = () => {

    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDispatches = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/orders/admin/all");
            const data = await res.json();
            if (data.success) {
                const activeDispatches = data.orders
                    .filter(o => o.status === "READY_FOR_PICKUP" || o.status === "OUT_FOR_DELIVERY")
                    .map(o => {
                        const isDelivery = o.orderType === "delivery";
                        return {
                            id: o._id.substring(o._id.length - 6).toUpperCase(),
                            originalId: o._id,
                            customerName: o.customer.name,
                            customerPhone: o.customer.phone,
                            address: o.customer.address || "No Address Provided",
                            orderValue: o.totalAmount,
                            itemsCount: o.items.reduce((acc, item) => acc + item.quantity, 0),
                            status: o.status === "READY_FOR_PICKUP" ? "RIDER_ASSIGNED" : "OUT_FOR_DELIVERY",
                            provider: isDelivery ? "Shadowfax" : "Self-Pickup",
                            riderName: isDelivery ? "Assigning Rider..." : "Customer Pickup",
                            riderPhone: "-",
                            eta: "Live tracking",
                            otp: Math.floor(1000 + Math.random() * 9000).toString(), // Mock OTP for now
                            dispatchTime: new Date(o.updatedAt).toLocaleTimeString()
                        };
                    });
                setDispatches(activeDispatches);
            }
        } catch (error) {
            console.error("Failed to fetch dispatch orders", error);
            toast.error("Failed to load dispatch data");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDispatches();
        const interval = setInterval(fetchDispatches, 10000);
        return () => clearInterval(interval);
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const reassignProvider = (dispatchId, newProvider) => {
        toast.info(`Cascading #${dispatchId} to ${newProvider}`);
    };

    const confirmHandover = async (dispatchId) => {
        try {
            const orderToUpdate = dispatches.find(d => d.id === dispatchId);
            if (!orderToUpdate) return;

            // Change status to DELIVERED when handed over (assuming it implies completed for MVP)
            const res = await fetch(`http://localhost:4000/api/orders/admin/status/${orderToUpdate.originalId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "DELIVERED" })
            });

            const data = await res.json();
            if (data.success) {
                fetchDispatches();
                toast.success(`Order #${dispatchId} Handed Over successfully!`);
            } else {
                toast.error("Failed to handover order");
            }
        } catch (error) {
            toast.error("Error during handover");
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
                    <p>Automated multi-provider rider waterfall (Shadowfax, Borzo, Porter &amp; Shiprocket).</p>
                </div>

                <div className="dispatch-kpi-strip">
                    <div className="kpi-box active-riders">
                        <FaMotorcycle size={18} />
                        <div className="kpi-meta">
                            <span className="kpi-num">3</span>
                            <span className="kpi-text">Active Dispatches</span>
                        </div>
                    </div>
                    <div className="kpi-box waterfall-rate">
                        <FiShield size={18} />
                        <div className="kpi-meta">
                            <span className="kpi-num">98.4%</span>
                            <span className="kpi-text">3PL SLA Match</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dispatch-controls-bar">
                <div className="dispatch-search-field">
                    <FiSearch className="search-ico" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Rider Name, Customer or 3PL Provider..."
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
                        className={`dispatch-filter-btn ${statusFilter === "SEARCHING_RIDER" ? "active" : ""}`}
                        onClick={() => setStatusFilter("SEARCHING_RIDER")}
                    >
                        Searching Rider ({dispatches.filter((d) => d.status === "SEARCHING_RIDER").length})
                    </button>
                    <button
                        type="button"
                        className={`dispatch-filter-btn ${statusFilter === "RIDER_ASSIGNED" ? "active" : ""}`}
                        onClick={() => setStatusFilter("RIDER_ASSIGNED")}
                    >
                        Rider Assigned ({dispatches.filter((d) => d.status === "RIDER_ASSIGNED").length})
                    </button>
                    <button
                        type="button"
                        className={`dispatch-filter-btn ${statusFilter === "OUT_FOR_DELIVERY" ? "active" : ""}`}
                        onClick={() => setStatusFilter("OUT_FOR_DELIVERY")}
                    >
                        Out for Delivery ({dispatches.filter((d) => d.status === "OUT_FOR_DELIVERY").length})
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
                                {item.status === "SEARCHING_RIDER" && "Searching Rider"}
                                {item.status === "RIDER_ASSIGNED" && "Rider Assigned"}
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
                                        <span className="rider-phone">
                                            <FiPhone size={11} /> {item.riderPhone}
                                        </span>
                                    )}
                                    <span className="rider-eta">
                                        <FiClock size={11} /> {item.eta}
                                    </span>
                                </div>
                            </div>
                            <div className="d-otp-box">
                                <span className="otp-lbl">OTP</span>
                                <span className="otp-val">{item.otp}</span>
                            </div>
                        </div>

                        <div className="d-destination-box">
                            <div className="dest-row">
                                <FiMapPin className="pin-ico" size={14} />
                                <span className="dest-addr">{item.address}</span>
                            </div>
                            <div className="cust-row">
                                <span className="cust-lbl">Customer:</span>
                                <strong className="cust-val">{item.customerName} ({item.customerPhone})</strong>
                            </div>
                        </div>

                        <div className="d-card-footer">
                            <div className="order-meta-info">
                                <span>{item.itemsCount} Items</span>
                                <strong>₹{item.orderValue}</strong>
                            </div>

                            <div className="d-actions">
                                {item.status === "SEARCHING_RIDER" && (
                                    <button
                                        type="button"
                                        className="d-btn cascade"
                                        onClick={() => reassignProvider(item.id, "Borzo")}
                                    >
                                        <FiRefreshCw size={13} />
                                        <span>Cascade (Next 3PL)</span>
                                    </button>
                                )}

                                {item.status === "RIDER_ASSIGNED" && (
                                    <button
                                        type="button"
                                        className="d-btn handover"
                                        onClick={() => confirmHandover(item.id)}
                                    >
                                        <FiCheckCircle size={14} />
                                        <span>Verify OTP &amp; Handover</span>
                                    </button>
                                )}

                                {item.status === "OUT_FOR_DELIVERY" && (
                                    <span className="live-track-note">
                                        <FaCircle className="pulse-green" size={7} />
                                        <span>Live GPS Tracking Active</span>
                                    </span>
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
