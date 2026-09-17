"use client";

import React, { useState } from "react";
import {
    FiSearch,
    FiPhone,
} from "react-icons/fi";
import { FaMotorcycle, FaStar } from "react-icons/fa";
import { toast } from "sonner";
import orderService from "@/services/orderService";


const DeliveryPartners = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [fleetFilter, setFleetFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const fetchRiders = async () => {
        try {
            const res = await orderService.getAllOrders();
            const data = res.data;
            if (data.success) {
                const riderMap = {};
                const today = new Date().toLocaleDateString('en-IN');

                (data.orders || []).forEach((o) => {
                    const courier = o.courierInfo;
                    // Skip if no courier phone or name
                    if (!courier || !courier.phone) return;

                    const phone = courier.phone;
                    if (!riderMap[phone]) {
                        riderMap[phone] = {
                            id: "RIDER-" + phone.replace(/\D/g, "").substring(0, 6),
                            name: courier.name || "Unknown Rider",
                            phone: phone,
                            provider: o.deliveryPartner ? (o.deliveryPartner.charAt(0).toUpperCase() + o.deliveryPartner.slice(1)) : "3PL Partner",
                            vehicle: courier.vehicle || "Standard Bike",
                            rating: "4.9",
                            todayDeliveries: 0,
                            totalDeliveries: 0,
                            status: "AVAILABLE",
                            currentOrder: "Idle at Kitchen",
                            lastActive: new Date(o.createdAt)
                        };
                    }

                    riderMap[phone].totalDeliveries += 1;
                    
                    const orderDate = new Date(o.createdAt);
                    
                    // Increment today's deliveries if completed today
                    if (orderDate.toLocaleDateString('en-IN') === today && (o.status === "DELIVERED" || o.status === "COMPLETED")) {
                        riderMap[phone].todayDeliveries += 1;
                    }

                    if (orderDate > riderMap[phone].lastActive) {
                        riderMap[phone].lastActive = orderDate;
                    }

                    // Check if currently delivering
                    if (o.status === "OUT_FOR_DELIVERY") {
                        riderMap[phone].status = "ON_DUTY";
                        const orderIdent = o.orderId || (o._id ? o._id.substring(o._id.length - 6).toUpperCase() : "ORDER");
                        riderMap[phone].currentOrder = "#" + orderIdent;
                    }
                });

                const formattedRiders = Object.values(riderMap);
                
                // Sort: ON_DUTY first, then by todayDeliveries
                formattedRiders.sort((a, b) => {
                    if (a.status === "ON_DUTY" && b.status !== "ON_DUTY") return -1;
                    if (b.status === "ON_DUTY" && a.status !== "ON_DUTY") return 1;
                    return b.todayDeliveries - a.todayDeliveries;
                });

                setRiders(formattedRiders);
            }
        } catch (error) {
            console.error("Failed to fetch riders", error);
            toast.error("Failed to load rider data");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRiders();
    }, []);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, fleetFilter]);

    const handleCallRider = (phone, name) => {
        toast.info(`Calling rider ${name} (${phone})`);
    };

    const filteredRiders = riders.filter((r) => {
        const matchesFleet =
            fleetFilter === "all" ||
            (fleetFilter === "self" && r.provider === "Restaurant Self Fleet") ||
            (fleetFilter === "3pl" && r.provider !== "Restaurant Self Fleet");
        const matchesSearch =
            searchQuery === "" ||
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.phone.includes(searchQuery);

        return matchesFleet && matchesSearch;
    });

    const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRiders = filteredRiders.slice(startIndex, startIndex + itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="fleet-screen">
            <div className="fleet-top-header">
                <div className="fleet-title-wrap">
                    <h2>Rider History</h2>
                    <p>View active and past delivery partners.</p>
                </div>
            </div>

            <div className="fleet-controls-bar">
                <div className="fleet-search-field">
                    <FiSearch className="search-ico" size={16} />
                    <input
                        type="text"
                        placeholder="Search rider by Name, 3PL Partner or Phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="fleet-input"
                    />
                </div>

                <div className="fleet-filters">
                    <button
                        type="button"
                        className={`fleet-f-btn ${fleetFilter === "all" ? "active" : ""}`}
                        onClick={() => setFleetFilter("all")}
                    >
                        All Riders ({riders.length})
                    </button>
                    <button
                        type="button"
                        className={`fleet-f-btn ${fleetFilter === "self" ? "active" : ""}`}
                        onClick={() => setFleetFilter("self")}
                    >
                        Self Fleet (In-House)
                    </button>
                    <button
                        type="button"
                        className={`fleet-f-btn ${fleetFilter === "3pl" ? "active" : ""}`}
                        onClick={() => setFleetFilter("3pl")}
                    >
                        3PL Riders (Shadowfax / Porter)
                    </button>
                </div>
            </div>

            <div className="riders-cards-grid">
                {currentRiders.map((rider) => (
                    <div key={rider.id} className="rider-card">
                        <div className="r-card-header">
                            <div className="r-avatar-block">
                                <div className="r-avatar">
                                    <FaMotorcycle size={17} />
                                </div>
                                <div className="r-info-block">
                                    <span className="r-name">{rider.name}</span>
                                    <span className="r-provider-tag">{rider.provider}</span>
                                </div>
                            </div>

                            <span className={`r-status-badge ${rider.status.toLowerCase()}`}>
                                {rider.status === "ON_DUTY" ? "On Duty (Delivering)" : "Available (Idle)"}
                            </span>
                        </div>

                        <div className="r-vehicle-row">
                            <span className="v-label">Vehicle:</span>
                            <strong className="v-val">{rider.vehicle}</strong>
                        </div>

                        <div className="r-stats-strip">
                            <div className="r-stat">
                                <span className="rs-num">
                                    <FaStar size={11} className="star-icon" /> {rider.rating}
                                </span>
                                <span className="rs-lbl">Rating</span>
                            </div>
                            <div className="r-stat">
                                <span className="rs-num">{rider.todayDeliveries}</span>
                                <span className="rs-lbl">Deliveries Today</span>
                            </div>
                            <div className="r-stat">
                                <span className="rs-num cur-order">{rider.currentOrder}</span>
                                <span className="rs-lbl">Assigned Task</span>
                            </div>
                        </div>

                        <div className="r-card-footer">
                            <span className="r-phone">
                                <FiPhone size={12} /> {rider.phone}
                            </span>

                            <button
                                type="button"
                                className="r-call-btn"
                                onClick={() => handleCallRider(rider.phone, rider.name)}
                            >
                                <FiPhone size={13} />
                                <span>Call Rider</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '15px', padding: '0 15px 30px' }}>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: currentPage === 1 ? '#f9fafb' : '#ffffff',
                            color: currentPage === 1 ? '#9ca3af' : '#111827',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            boxShadow: currentPage === 1 ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        Previous
                    </button>
                    
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563', backgroundColor: '#f3f4f6', padding: '6px 14px', borderRadius: '20px' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: currentPage === totalPages ? '#f9fafb' : '#ffffff',
                            color: currentPage === totalPages ? '#9ca3af' : '#111827',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            boxShadow: currentPage === totalPages ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeliveryPartners;
