"use client";

import React, { useState } from "react";
import {
    FiSearch,
    FiPhone,
    FiClock,
    FiCheckCircle,
    FiShield,
    FiActivity,
    FiMapPin,
    FiPlus,
    FiTruck,
} from "react-icons/fi";
import { FaMotorcycle, FaCircle, FaStar } from "react-icons/fa";
import { toast } from "sonner";

const mockProviders = [
    {
        name: "Shadowfax Local",
        type: "3PL Aggregator",
        status: "ACTIVE",
        activeRiders: 12,
        avgPickupTime: "3.5 mins",
        successRate: "99.1%",
        costPerKm: "₹35 base (up to 3km)",
    },
    {
        name: "Borzo (WeFast)",
        type: "3PL Express",
        status: "ACTIVE",
        activeRiders: 8,
        avgPickupTime: "4.8 mins",
        successRate: "97.8%",
        costPerKm: "₹40 base (up to 3km)",
    },
    {
        name: "Porter Enterprise",
        type: "3PL Bulk Fleet",
        status: "ACTIVE",
        activeRiders: 5,
        avgPickupTime: "6.2 mins",
        successRate: "98.5%",
        costPerKm: "₹45 base",
    },
    {
        name: "Restaurant Self Fleet",
        type: "Direct Kitchen Staff",
        status: "ONLINE",
        activeRiders: 2,
        avgPickupTime: "1.5 mins",
        successRate: "100%",
        costPerKm: "₹0 Commission",
    },
];

const mockRiders = [
    {
        id: "RIDER-01",
        name: "Sonu Kumar",
        phone: "+91 91234 56780",
        provider: "Shadowfax",
        vehicle: "Hero Splendor (DL 3S 8921)",
        rating: "4.9",
        todayDeliveries: 9,
        status: "ON_DUTY",
        currentOrder: "#YK-84920",
    },
    {
        id: "RIDER-02",
        name: "Deepak Rawat",
        phone: "+91 98990 11223",
        provider: "Porter",
        vehicle: "Honda Activa (HR 26 4410)",
        rating: "4.8",
        todayDeliveries: 7,
        status: "ON_DUTY",
        currentOrder: "#YK-84915",
    },
    {
        id: "RIDER-03",
        name: "Manish Sharma",
        phone: "+91 98110 55667",
        provider: "Restaurant Self Fleet",
        vehicle: "TVS Jupiter (DL 4S 1209)",
        rating: "5.0",
        todayDeliveries: 12,
        status: "AVAILABLE",
        currentOrder: "Idle at Kitchen",
    },
    {
        id: "RIDER-04",
        name: "Rakesh Yadav",
        phone: "+91 98109 44332",
        provider: "Shiprocket Quick",
        vehicle: "Bajaj Pulsar (HR 51 9081)",
        rating: "4.7",
        todayDeliveries: 6,
        status: "AVAILABLE",
        currentOrder: "Idle near Cyber City",
    },
];

const DeliveryPartners = () => {
    const [riders, setRiders] = useState(mockRiders);
    const [searchQuery, setSearchQuery] = useState("");
    const [fleetFilter, setFleetFilter] = useState("all");

    const handleCallRider = (phone, name) => {
        toast.info(`Calling rider ${name} (${phone})`);
    };

    const handleAddRider = () => {
        toast.success("Add Self-Fleet Rider modal opened");
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

    return (
        <div className="fleet-screen">
            <div className="fleet-top-header">
                <div className="fleet-title-wrap">
                    <h2>Delivery Partners &amp; 3PL Fleet</h2>
                    <p>Aggregated multi-provider logistics performance, active riders &amp; self-fleet control.</p>
                </div>

                <button type="button" className="add-fleet-btn" onClick={handleAddRider}>
                    <FiPlus size={16} />
                    <span>Add Self-Fleet Rider</span>
                </button>
            </div>

            <div className="providers-grid">
                {mockProviders.map((prov, idx) => (
                    <div key={idx} className="provider-card">
                        <div className="prov-header">
                            <div className="prov-title-block">
                                <span className="prov-name">{prov.name}</span>
                                <span className="prov-type">{prov.type}</span>
                            </div>
                            <span className="prov-status-dot">
                                <FaCircle size={8} /> {prov.status}
                            </span>
                        </div>

                        <div className="prov-stats-row">
                            <div className="p-stat">
                                <span className="p-stat-lbl">Active Riders</span>
                                <strong className="p-stat-val">{prov.activeRiders}</strong>
                            </div>
                            <div className="p-stat">
                                <span className="p-stat-lbl">Avg Pickup</span>
                                <strong className="p-stat-val">{prov.avgPickupTime}</strong>
                            </div>
                            <div className="p-stat">
                                <span className="p-stat-lbl">SLA Rate</span>
                                <strong className="p-stat-val">{prov.successRate}</strong>
                            </div>
                        </div>

                        <div className="prov-footer">
                            <span>Cost: <strong>{prov.costPerKm}</strong></span>
                        </div>
                    </div>
                ))}
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
                {filteredRiders.map((rider) => (
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
        </div>
    );
};

export default DeliveryPartners;
