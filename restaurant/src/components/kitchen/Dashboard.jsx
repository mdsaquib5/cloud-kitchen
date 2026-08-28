"use client";

import React, { useState } from "react";
import {
    FiSearch,
    FiClock,
    FiPrinter,
    FiVolume2,
    FiVolumeX,
    FiRefreshCw,
    FiPhone,
    FiCheck,
    FiChevronRight,
    FiPackage,
    FiAlertCircle,
    FiWifi, FiBell} from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils, FaCircle } from "react-icons/fa";
import { toast } from "sonner";

const initialOrders = [
    {
        id: "YK-84920",
        customerName: "Rahul Sharma",
        phone: "+91 98765 43210",
        orderType: "delivery",
        orderTime: "2m ago",
        status: "PLACED",
        urgent: true,
        items: [
            { name: "Paneer Kurkure Momos", portion: "Full Portion", qty: 2, price: 240 },
            { name: "Malai Chaap", portion: "Half Portion", qty: 1, price: 50 },
            { name: "Cold Coffee", portion: "Standard", qty: 2, price: 100 },
        ],
        total: 390,
        address: "Flat 402, Royal Palms, Cyber City",
        notes: "Extra spicy red chutney & green dips please.",
    },
    {
        id: "YK-84921",
        customerName: "Sneha Patel",
        phone: "+91 98222 33445",
        orderType: "takeaway",
        orderTime: "4m ago",
        status: "PLACED",
        urgent: false,
        items: [
            { name: "₹179 Mega Feast Combo", portion: "Standard", qty: 1, price: 179 },
            { name: "Paneer Burger", portion: "Standard", qty: 1, price: 40 },
        ],
        total: 219,
        pickupTime: "Pickup in 15m",
    },
    {
        id: "YK-84918",
        customerName: "Amit Kumar",
        phone: "+91 98111 22334",
        orderType: "delivery",
        orderTime: "8m ago",
        status: "PREPARING",
        urgent: false,
        items: [
            { name: "White Sauce Pasta", portion: "Full Portion", qty: 1, price: 120 },
            { name: "Veg Fried Momo", portion: "Full Portion", qty: 1, price: 70 },
            { name: "Peri Peri Fries", portion: "Half Portion", qty: 1, price: 40 },
        ],
        total: 230,
        address: "Tower B, Sector 29",
    },
    {
        id: "YK-84919",
        customerName: "Table 04 (Dining)",
        phone: "+91 99887 66554",
        orderType: "dine-in",
        orderTime: "11m ago",
        status: "PREPARING",
        urgent: false,
        items: [
            { name: "Paneer Chowmein", portion: "Full Portion", qty: 1, price: 110 },
            { name: "Cheese Balls", portion: "Half Portion", qty: 1, price: 70 },
        ],
        total: 180,
        tableNo: "Table 04",
    },
    {
        id: "YK-84915",
        customerName: "Vikram Singh",
        phone: "+91 97654 32109",
        orderType: "delivery",
        orderTime: "16m ago",
        status: "READY",
        urgent: false,
        riderName: "Sonu Kumar (Shadowfax)",
        riderPhone: "+91 91234 56780",
        otp: "4921",
        items: [
            { name: "Butter Malai Chaap", portion: "Full Portion", qty: 1, price: 90 },
            { name: "Veg Spring Roll", portion: "Full Portion", qty: 2, price: 100 },
        ],
        total: 190,
    },
    {
        id: "YK-84916",
        customerName: "Pooja Verma",
        phone: "+91 98444 55667",
        orderType: "takeaway",
        orderTime: "19m ago",
        status: "READY",
        urgent: false,
        items: [
            { name: "₹150 Super Saver Combo", portion: "Standard", qty: 2, price: 300 },
        ],
        total: 300,
        pickupTime: "Counter Ready",
    },
];

const Dashboard = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todaysRevenue, setTodaysRevenue] = useState(0);
    const [todaysOrders, setTodaysOrders] = useState(0);

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/orders/admin/all");
            const data = await res.json();
            if (data.success) {
                // Map the backend orders to the KDS format
                const kdsOrders = data.orders.map(o => {
                    const placedTime = new Date(o.createdAt);
                    const now = new Date();
                    const diffMs = now - placedTime;
                    const elapsedMinutes = Math.floor(diffMs / 60000);

                    return {
                        id: o._id.substring(o._id.length - 6).toUpperCase(),
                        originalId: o._id,
                        customerName: o.customer.name,
                        phone: o.customer.phone,
                        orderType: o.orderType || "delivery",
                        orderTime: elapsedMinutes + "m ago",
                        status: o.status, // PLACED, PREPARING, READY_FOR_PICKUP/OUT_FOR_DELIVERY, COMPLETED
                        urgent: elapsedMinutes > 10 && o.status === "PLACED",
                        items: o.items.map(i => ({
                            name: i.title,
                            portion: i.portionLabel || "Standard",
                            qty: i.quantity,
                            price: i.price,
                            addons: i.addons || []
                        })),
                        total: (o.totals?.grandTotal || 0),
                        address: o.customer.address || "No address provided",
                        notes: o.items.map(i => i.cookingNote).filter(Boolean).join(", ")
                    };
                });
                
                // Keep only active orders for the board (ignore COMPLETED or CANCELLED)
                const activeOrders = kdsOrders.filter(o => 
                    o.status === "PLACED" || 
                    o.status === "PREPARING" || 
                    o.status === "READY_FOR_PICKUP" ||
                    o.status === "OUT_FOR_DELIVERY"
                );
                
                setOrders(activeOrders);

                // Calculate today's stats
                const today = new Date().setHours(0,0,0,0);
                const todaysOrdersList = data.orders.filter(o => new Date(o.createdAt) >= today);
                setTodaysOrders(todaysOrdersList.length);
                const revenue = todaysOrdersList.reduce((acc, o) => acc + (o.totals?.grandTotal || 0), 0);
                setTodaysRevenue(revenue);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard orders", error);
            toast.error("Failed to load live orders");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [autoPrint, setAutoPrint] = useState(true);

    const updateOrderStatus = async (orderId, nextStatus) => {
        try {
            const orderToUpdate = orders.find(o => o.id === orderId);
            if (!orderToUpdate) return;
            
            // Adjust status mapping for backend
            let backendStatus = nextStatus;
            if (nextStatus === "READY") {
                backendStatus = orderToUpdate.orderType === "delivery" ? "OUT_FOR_DELIVERY" : "READY_FOR_PICKUP";
            } else if (nextStatus === "COMPLETED") {
                backendStatus = "DELIVERED";
            }
            
            const res = await fetch(`http://localhost:4000/api/orders/admin/status/${orderToUpdate.originalId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: backendStatus })
            });

            const data = await res.json();
            if (data.success) {
                fetchOrders();
                toast.success(`Order #${orderId} moved to ${nextStatus}!`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating order status");
        }
    };

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

    const placedCount = orders.filter((o) => o.status === "PLACED").length;
    const prepCount = orders.filter((o) => o.status === "PREPARING").length;
    const readyCount = orders.filter((o) => o.status === "READY_FOR_PICKUP" || o.status === "OUT_FOR_DELIVERY").length;

    return (
        <div className="kds-screen">
            <div className="kds-top-bar">

                <div className="kds-controls-cluster">
                    <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        style={{
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            padding: '0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: soundEnabled ? '#ffe4e6' : '#f3f4f6',
                            color: soundEnabled ? '#f01543' : '#9ca3af',
                            border: soundEnabled ? '1px solid #fecdd3' : '1px solid #e5e7eb',
                            boxShadow: soundEnabled ? '0 2px 8px rgba(240, 21, 67, 0.25)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        title={soundEnabled ? "Sound ON" : "Sound OFF"}
                    >
                        {soundEnabled ? <FiBell size={20} style={{ animation: 'shake 2s infinite ease-in-out' }} /> : <FiVolumeX size={20} />}
                    </button>
                    
                    <style>{`
                        @keyframes shake {
                            0%, 100% { transform: rotate(0deg); }
                            10% { transform: rotate(15deg); }
                            20% { transform: rotate(-10deg); }
                            30% { transform: rotate(5deg); }
                            40% { transform: rotate(-5deg); }
                            50% { transform: rotate(0deg); }
                        }
                    `}</style>

                    
                </div>
            </div>

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

                                    {order.urgent && (
                                        <div className="urgent-banner">
                                            <FiAlertCircle size={13} />
                                            <span>Action Needed (&gt; 2 mins unaccepted)</span>
                                        </div>
                                    )}

                                    <div className="ticket-meta">
                                        <div className="meta-cust">
                                            <strong>{order.customerName}</strong>
                                            <span>{order.phone}</span>
                                        </div>
                                        <span className="meta-total">₹{order.total}</span>
                                    </div>

                                    {order.notes && (
                                        <div className="ticket-note">
                                            <span>Note: {order.notes}</span>
                                        </div>
                                    )}

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
                                            {order.tableNo && <span className="table-highlight">{order.tableNo}</span>}
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
                        <span className="col-count">{filteredOrders.filter((o) => o.status === "READY_FOR_PICKUP" || o.status === "OUT_FOR_DELIVERY").length}</span>
                    </div>

                    <div className="col-tickets-flow">
                        {filteredOrders
                            .filter((o) => o.status === "READY_FOR_PICKUP" || o.status === "OUT_FOR_DELIVERY")
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
                                            <span className="otp-pill">OTP: {order.otp}</span>
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
                    <strong className="b-val">Shadowfax / Borzo</strong>
                </div>
                <div className="bottom-time">
                    <span>Auto-Sync Active (SSE)</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;