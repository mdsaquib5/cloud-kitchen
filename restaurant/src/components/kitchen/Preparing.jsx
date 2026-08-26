"use client";

import React, { useState } from "react";
import {
    FiClock,
    FiCheck,
    FiPrinter,
    FiAlertCircle,
    FiCheckSquare,
    FiSquare,
    FiFilter,
} from "react-icons/fi";
import { FaFire, FaUtensils, FaMotorcycle, FaStoreAlt } from "react-icons/fa";
import { toast } from "sonner";

const mockStationTickets = [
    {
        id: "YK-84918",
        customerName: "Amit Kumar",
        orderType: "delivery",
        elapsedMinutes: 8,
        targetMinutes: 12,
        station: "Momos & Fryer Station",
        urgent: false,
        notes: "Crispy fried, extra mayo dip.",
        items: [
            { id: "item-1", name: "Veg Fried Momo", portion: "Full Portion", qty: 1, done: true },
            { id: "item-2", name: "Peri Peri Fries", portion: "Half Portion", qty: 1, done: false },
            { id: "item-3", name: "White Sauce Pasta", portion: "Full Portion", qty: 1, done: false },
        ],
    },
    {
        id: "YK-84919",
        customerName: "Table 04 (Dine-In)",
        orderType: "dine-in",
        elapsedMinutes: 14,
        targetMinutes: 15,
        station: "Wok & Chinese Station",
        urgent: true,
        notes: "Less spicy for kids.",
        items: [
            { id: "item-4", name: "Paneer Chowmein", portion: "Full Portion", qty: 1, done: false },
            { id: "item-5", name: "Cheese Balls", portion: "Half Portion", qty: 1, done: false },
        ],
    },
    {
        id: "YK-84920",
        customerName: "Rahul Sharma",
        orderType: "delivery",
        elapsedMinutes: 4,
        targetMinutes: 12,
        station: "Momos & Tandoor Station",
        urgent: false,
        notes: "Pack dips separately.",
        items: [
            { id: "item-6", name: "Paneer Kurkure Momos", portion: "Full Portion", qty: 2, done: true },
            { id: "item-7", name: "Malai Chaap", portion: "Half Portion", qty: 1, done: false },
            { id: "item-8", name: "Cold Coffee", portion: "Standard", qty: 2, done: true },
        ],
    },
];

const Preparing = () => {

    const [tickets, setTickets] = useState([]);
    const [selectedStation, setSelectedStation] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/orders/admin/all");
            const data = await res.json();
            if (data.success) {
                // Filter orders that need preparation
                const prepOrders = data.orders.filter(
                    o => o.status === "PLACED" || o.status === "PREPARING"
                ).map(o => {
                    // Calculate elapsed time roughly (for demo)
                    const placedTime = new Date(o.createdAt);
                    const now = new Date();
                    const diffMs = now - placedTime;
                    const elapsedMinutes = Math.floor(diffMs / 60000);

                    return {
                        id: o._id,
                        displayId: o._id.substring(o._id.length - 6).toUpperCase(),
                        customerName: o.customer.name,
                        orderType: o.orderType,
                        elapsedMinutes: elapsedMinutes,
                        targetMinutes: o.orderType === "delivery" ? 25 : 15,
                        station: "Main Kitchen",
                        urgent: elapsedMinutes > 15,
                        notes: o.items.map(i => i.cookingNote).filter(Boolean).join(", "),
                        items: o.items.map((item, idx) => ({
                            id: `${o._id}-${idx}`,
                            name: item.title,
                            portion: item.portionLabel || "Standard",
                            qty: item.quantity,
                            done: false
                        }))
                    };
                });
                setTickets(prepOrders);
            }
        } catch (error) {
            console.error("Failed to fetch prep orders", error);
            toast.error("Failed to load live orders");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOrders();
        // Poll every 10 seconds for new orders
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const toggleItemDone = (ticketId, itemId) => {
        setTickets((prev) =>
            prev.map((t) => {
                if (t.id === ticketId) {
                    const updatedItems = t.items.map((i) =>
                        i.id === itemId ? { ...i, done: !i.done } : i
                    );
                    return { ...t, items: updatedItems };
                }
                return t;
            })
        );
    };

    const markAllReady = async (ticketId) => {
        try {
            const orderToUpdate = tickets.find(t => t.id === ticketId);
            const newStatus = orderToUpdate?.orderType === "delivery" ? "OUT_FOR_DELIVERY" : "READY_FOR_PICKUP";

            const res = await fetch(`http://localhost:4000/api/orders/admin/status/${ticketId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (data.success) {
                setTickets((prev) => prev.filter((t) => t.id !== ticketId));
                toast.success(`Order #${orderToUpdate.displayId} fully cooked and moved to Ready!`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating order");
        }
    };

    const filteredTickets = tickets.filter((t) => {
        if (selectedStation === "all") return true;
        return t.station.toLowerCase().includes(selectedStation.toLowerCase());
    });

    return (
        <div className="prep-screen">
            <div className="prep-top-header">
                <div className="prep-title-wrap">
                    <h2>Kitchen Station &amp; Prep Queue</h2>
                    <p>Live cooking queue, station routing &amp; dish-level prep checklist for chefs.</p>
                </div>

                <div className="prep-station-filters">
                    <button
                        type="button"
                        className={`station-pill ${selectedStation === "all" ? "active" : ""}`}
                        onClick={() => setSelectedStation("all")}
                    >
                        <FaFire size={12} />
                        <span>All Stations ({tickets.length})</span>
                    </button>
                    <button
                        type="button"
                        className={`station-pill ${selectedStation === "momos" ? "active" : ""}`}
                        onClick={() => setSelectedStation("momos")}
                    >
                        Momos &amp; Fryer
                    </button>
                    <button
                        type="button"
                        className={`station-pill ${selectedStation === "wok" ? "active" : ""}`}
                        onClick={() => setSelectedStation("wok")}
                    >
                        Wok &amp; Noodles
                    </button>
                </div>
            </div>

            <div className="prep-cards-grid">
                {filteredTickets.map((ticket) => {
                    const completedItems = ticket.items.filter((i) => i.done).length;
                    const totalItems = ticket.items.length;
                    const progressPct = Math.round((completedItems / totalItems) * 100);

                    return (
                        <div
                            key={ticket.id}
                            className={`prep-ticket-card ${ticket.urgent ? "urgent" : ""}`}
                        >
                            <div className="p-ticket-header">
                                <div className="p-id-box">
                                    <strong className="p-order-id">#{ticket.displayId}</strong>
                                    <span className="p-station-badge">{ticket.station}</span>
                                </div>

                                <div className="p-timer-box">
                                    <FiClock size={13} />
                                    <span className="timer-text">
                                        {ticket.elapsedMinutes} / {ticket.targetMinutes} mins
                                    </span>
                                </div>
                            </div>

                            <div className="p-customer-strip">
                                <div className="p-cust-info">
                                    <strong>{ticket.customerName}</strong>
                                    <span className={`p-type-chip ${ticket.orderType}`}>
                                        {ticket.orderType.toUpperCase()}
                                    </span>
                                </div>

                                {ticket.urgent && (
                                    <span className="p-rush-badge">
                                        <FiAlertCircle size={12} />
                                        <span>RUSH ORDER</span>
                                    </span>
                                )}
                            </div>

                            {ticket.notes && (
                                <div className="p-chef-note">
                                    <span>Chef Note: {ticket.notes}</span>
                                </div>
                            )}

                            <div className="p-progress-track">
                                <div className="track-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progressPct}%` }}
                                    ></div>
                                </div>
                                <span className="track-text">
                                    {completedItems} of {totalItems} dishes prepped ({progressPct}%)
                                </span>
                            </div>

                            <div className="p-items-checklist">
                                {ticket.items.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`check-item-row ${item.done ? "done" : ""}`}
                                        onClick={() => toggleItemDone(ticket.id, item.id)}
                                    >
                                        <div className="check-box-ico">
                                            {item.done ? (
                                                <FiCheckSquare size={18} className="checked" />
                                            ) : (
                                                <FiSquare size={18} className="unchecked" />
                                            )}
                                        </div>
                                        <div className="check-item-detail">
                                            <span className="item-qty-tag">{item.qty}x</span>
                                            <span className="item-name-text">{item.name}</span>
                                            <span className="item-portion-tag">({item.portion})</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-ticket-footer">
                                <button
                                    type="button"
                                    className="p-ready-btn"
                                    onClick={() => markAllReady(ticket.id)}
                                >
                                    <FiCheck size={16} />
                                    <span>Mark All Prepped &amp; Food Ready</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Preparing;
