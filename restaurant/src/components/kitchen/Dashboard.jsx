"use client";

import React, { useState, useEffect } from "react";
import {
    FiSearch,
    FiClock,
    FiPrinter,
    FiRefreshCw,
    FiCheck,
    FiChevronRight,
    FiPackage,
    FiAlertCircle,
} from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils } from "react-icons/fa";
import { toast } from "sonner";
import { useKitchenStore } from "@/store/useKitchenStore";

const Dashboard = () => {
    const {
        orders,
        loading,
        todaysRevenue,
        todaysOrders,
        quotesModalOpen,
        quotesLoading,
        availableQuotes,
        selectedQuoteIndex,
        fetchOrders,
        openQuotesModal,
        closeQuotesModal,
        setSelectedQuoteIndex,
        assignRider,
        updateOrderStatus
    } = useKitchenStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const handlePrintKOT = (order) => {
        toast.success(`Thermal KOT Printed for #${order.id}`, {
            description: `${order.items.length} items • ${order.orderType.toUpperCase()}`,
        });
    };

    const filteredOrders = orders.filter((order) => {
        const matchesType = activeTab === "all" || order.orderType === activeTab;
        const matchesSearch =
            searchQuery === "" ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone.includes(searchQuery);

        return matchesType && matchesSearch;
    });

    const formatEta = (etaVal) => {
        if (!etaVal || etaVal === "N/A" || etaVal === "Manual") return etaVal;
        if (typeof etaVal === "string" && etaVal.includes("T")) {
            const dropTime = new Date(etaVal);
            const now = new Date();
            const diffMs = dropTime - now;
            const diffMins = Math.round(diffMs / 60000);
            return diffMins > 0 ? `${diffMins} mins` : "Arriving soon";
        }
        return `${etaVal} mins`;
    };

    return (
        <div className="kds-screen">
            <div className="kds-sub-bar">
                <div className="kds-search-field">
                    <FiSearch className="search-ico" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Order #ID, Customer Name or Phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="kds-input"
                    />
                </div>

                <div className="kds-filter-tabs">
                    <button
                        type="button"
                        className={`kds-tab ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => setActiveTab("all")}
                    >
                        All ({orders.length})
                    </button>
                    <button
                        type="button"
                        className={`kds-tab ${activeTab === "delivery" ? "active" : ""}`}
                        onClick={() => setActiveTab("delivery")}
                    >
                        <FaMotorcycle size={14} />
                        <span>Delivery ({orders.filter((o) => o.orderType === "delivery").length})</span>
                    </button>
                    <button
                        type="button"
                        className={`kds-tab ${activeTab === "takeaway" ? "active" : ""}`}
                        onClick={() => setActiveTab("takeaway")}
                    >
                        <FaStoreAlt size={14} />
                        <span>Takeaway ({orders.filter((o) => o.orderType === "takeaway").length})</span>
                    </button>
                    <button
                        type="button"
                        className={`kds-tab ${activeTab === "dine-in" ? "active" : ""}`}
                        onClick={() => setActiveTab("dine-in")}
                    >
                        <FaUtensils size={14} />
                        <span>Dine-In ({orders.filter((o) => o.orderType === "dine-in").length})</span>
                    </button>
                </div>
            </div>

            <div className="kds-kanban-board">
                <div className="kds-column col-new">
                    <div className="col-header">
                        <div className="col-title-wrap">
                            <span className="col-indicator new"></span>
                            <h3>NEW ORDERS</h3>
                        </div>
                        <span className="col-count">{filteredOrders.filter((o) => o.status === "PLACED").length}</span>
                    </div>

                    <div className="col-tickets-flow">
                        {filteredOrders
                            .filter((o) => o.status === "PLACED")
                            .map((order) => (
                                <div key={order.id} className={`kds-ticket ${order.urgent ? "urgent" : ""}`}>
                                    <div className="ticket-header">
                                        <div className="ticket-id-box">
                                            <span className="ticket-id">#{order.id}</span>
                                            <span className="ticket-timer">
                                                <FiClock size={12} /> {order.orderTime}
                                            </span>
                                        </div>
                                        <span className={`ticket-type-pill ${order.orderType}`}>
                                            {order.orderType === "delivery" && <FaMotorcycle size={11} />}
                                            {order.orderType === "takeaway" && <FaStoreAlt size={11} />}
                                            {order.orderType === "dine-in" && <FaUtensils size={11} />}
                                            <span>{order.orderType.toUpperCase()}</span>
                                        </span>
                                    </div>

                                    <div className="ticket-meta">
                                        <div className="meta-cust">
                                            <strong>{order.customerName}</strong>
                                            <span>{order.phone}</span>
                                        </div>
                                        <span className="meta-total">₹{order.total}</span>
                                    </div>

                                    <div className="ticket-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                                                <div className="ticket-item-row" style={{ marginBottom: 0 }}>
                                                    <span className="item-qty">{item.qty}x</span>
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-portion">{item.portion}</span>
                                                    </div>
                                                </div>
                                                {item.addons && item.addons.length > 0 && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', paddingLeft: '28px', paddingRight: '8px' }}>
                                                        {item.addons.map((a, i) => (
                                                            <div key={i} style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '4px',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#f8fafc',
                                                                fontSize: '11px',
                                                                color: '#0f172a'
                                                            }}>
                                                                <div style={{ width: '12px', height: '12px', border: '1px solid #cbd5e1', borderRadius: '2px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                                                    <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '1px' }}></div>
                                                                </div>
                                                                <span style={{ fontWeight: '600' }}>{a.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="ticket-actions">
                                        <button
                                            type="button"
                                            className="ticket-print-btn"
                                            onClick={() => handlePrintKOT(order)}
                                            title="Print Thermal KOT"
                                        >
                                            <FiPrinter size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            className="ticket-primary-btn accept"
                                            onClick={() => updateOrderStatus(order.id, "PREPARING")}
                                        >
                                            <span>Accept &amp; Prepare</span>
                                            <FiChevronRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="kds-column col-prep">
                    <div className="col-header">
                        <div className="col-title-wrap">
                            <span className="col-indicator prep"></span>
                            <h3>PREPARING</h3>
                        </div>
                        <span className="col-count">{filteredOrders.filter((o) => o.status === "PREPARING").length}</span>
                    </div>

                    <div className="col-tickets-flow">
                        {filteredOrders
                            .filter((o) => o.status === "PREPARING")
                            .map((order) => (
                                <div key={order.id} className="kds-ticket in-prep">
                                    <div className="ticket-header">
                                        <div className="ticket-id-box">
                                            <span className="ticket-id">#{order.id}</span>
                                            <span className="ticket-timer in-kitchen">
                                                <FiClock size={12} /> Cooking ({order.orderTime})
                                            </span>
                                        </div>
                                        <span className={`ticket-type-pill ${order.orderType}`}>
                                            <span>{order.orderType.toUpperCase()}</span>
                                        </span>
                                    </div>

                                    <div className="ticket-meta">
                                        <div className="meta-cust">
                                            <strong>{order.customerName}</strong>
                                        </div>
                                        <span className="meta-total">₹{order.total}</span>
                                    </div>

                                    <div className="ticket-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                                                <div className="ticket-item-row" style={{ marginBottom: 0 }}>
                                                    <span className="item-qty prep">{item.qty}x</span>
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-portion">{item.portion}</span>
                                                    </div>
                                                </div>
                                                {item.addons && item.addons.length > 0 && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', paddingLeft: '28px', paddingRight: '8px' }}>
                                                        {item.addons.map((a, i) => (
                                                            <div key={i} style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '4px',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#f8fafc',
                                                                fontSize: '11px',
                                                                color: '#0f172a'
                                                            }}>
                                                                <div style={{ width: '12px', height: '12px', border: '1px solid #cbd5e1', borderRadius: '2px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                                                    <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '1px' }}></div>
                                                                </div>
                                                                <span style={{ fontWeight: '600' }}>{a.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="ticket-actions">
                                        <button
                                            type="button"
                                            className="ticket-print-btn"
                                            onClick={() => handlePrintKOT(order)}
                                        >
                                            <FiPrinter size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            className="ticket-primary-btn ready"
                                            onClick={() => updateOrderStatus(order.id, "READY")}
                                        >
                                            <FiCheck size={15} />
                                            <span>Food Ready</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="kds-column col-ready">
                    <div className="col-header">
                        <div className="col-title-wrap">
                            <span className="col-indicator ready"></span>
                            <h3>READY FOR DISPATCH</h3>
                        </div>
                        <span className="col-count">{filteredOrders.filter((o) => o.status === "READY_FOR_PICKUP").length}</span>
                    </div>

                    <div className="col-tickets-flow">
                        {filteredOrders
                            .filter((o) => o.status === "READY_FOR_PICKUP")
                            .map((order) => (
                                <div key={order.id} className="kds-ticket ready-ticket">
                                    <div className="ticket-header">
                                        <div className="ticket-id-box">
                                            <span className="ticket-id">#{order.id}</span>
                                            <span className="ticket-timer ready">
                                                <FiPackage size={12} /> Packed &amp; Ready
                                            </span>
                                        </div>
                                        <span className={`ticket-type-pill ${order.orderType}`}>
                                            <span>{order.orderType.toUpperCase()}</span>
                                        </span>
                                    </div>

                                    {order.riderName && (
                                        <div className="rider-assign-box">
                                            <div className="rider-info">
                                                <FaMotorcycle size={14} />
                                                <span>{order.riderName}</span>
                                            </div>
                                            {order.otp && <span className="otp-pill">OTP: {order.otp}</span>}
                                        </div>
                                    )}

                                    {order.pickupTime && (
                                        <div className="takeaway-box">
                                            <span>Status: {order.pickupTime}</span>
                                        </div>
                                    )}

                                    <div className="ticket-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                                                <div className="ticket-item-row" style={{ marginBottom: 0 }}>
                                                    <span className="item-qty done">{item.qty}x</span>
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                    </div>
                                                </div>
                                                {item.addons && item.addons.length > 0 && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', paddingLeft: '28px', paddingRight: '8px' }}>
                                                        {item.addons.map((a, i) => (
                                                            <div key={i} style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '4px',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#f8fafc',
                                                                fontSize: '11px',
                                                                color: '#0f172a'
                                                            }}>
                                                                <div style={{ width: '12px', height: '12px', border: '1px solid #cbd5e1', borderRadius: '2px', marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                                                    <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '1px' }}></div>
                                                                </div>
                                                                <span style={{ fontWeight: '600' }}>{a.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {order.orderType === "delivery" && !order.riderName && (
                                        <div className="ticket-actions" style={{ marginBottom: "10px" }}>
                                            <button
                                                type="button"
                                                className="ticket-primary-btn"
                                                style={{ backgroundColor: "#8b5cf6", width: "100%", justifyContent: "center", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", fontWeight: "bold" }}
                                                onClick={() => openQuotesModal(order.originalId)}
                                            >
                                                <FiSearch size={16} />
                                                <span style={{ marginLeft: "5px" }}>Find Rider (Live Quotes)</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="ticket-actions">
                                        <button
                                            type="button"
                                            className="ticket-primary-btn dispatch"
                                            onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                                        >
                                            <FiCheck size={16} />
                                            <span>Handover Complete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* --- Live Quotes Modal --- */}
            {quotesModalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '500px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Select Delivery Partner</h3>
                            <button onClick={closeQuotesModal} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>✖</button>
                        </div>

                        {quotesLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                <FiRefreshCw className="spin-icon" size={24} style={{ marginBottom: '10px' }} />
                                <div>Fetching live quotes from Pidge...</div>
                            </div>
                        ) : availableQuotes.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                                <FiAlertCircle size={24} style={{ marginBottom: '10px' }} />
                                <div>No delivery partners available right now.</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {availableQuotes.map((quote, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedQuoteIndex(idx)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '16px',
                                            border: selectedQuoteIndex === idx ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedQuoteIndex === idx ? '#eff6ff' : '#fff',
                                            transition: 'all 0.2s ease'
                                        }}>
                                        <div style={{ width: '40px', height: '40px', marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderRadius: '50%' }}>
                                            <FaMotorcycle size={20} color={selectedQuoteIndex === idx ? '#3b82f6' : '#64748b'} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a' }}>{quote.networkName}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>ETA: {formatEta(quote.etaDrop)}</div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#0f172a' }}>
                                            ₹{quote.price}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    disabled={selectedQuoteIndex === null}
                                    onClick={assignRider}
                                    style={{
                                        marginTop: '20px',
                                        padding: '14px',
                                        backgroundColor: selectedQuoteIndex === null ? '#cbd5e1' : '#3b82f6',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        cursor: selectedQuoteIndex === null ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}>
                                    Confirm &amp; Assign Rider
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="kds-bottom-bar">
                <div className="bottom-stat">
                    <span className="b-label">Today's Revenue:</span>
                    <strong className="b-val">₹{todaysRevenue}</strong>
                </div>
                <div className="bottom-stat">
                    <span className="b-label">Total Orders Today:</span>
                    <strong className="b-val">{todaysOrders} Orders</strong>
                </div>
                <div className="bottom-stat">
                    <span className="b-label">Active 3PL Fleet:</span>
                    <strong className="b-val">Pidge / Shadowfax</strong>
                </div>
                <div className="bottom-time">
                    <span>Auto-Sync Active (SSE)</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
