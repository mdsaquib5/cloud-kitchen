"use client";

import React, { useState } from "react";
import {
    FiSearch,
    FiPrinter,
    FiDownloadCloud,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiFileText,
} from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils } from "react-icons/fa";
import { toast } from "sonner";

const mockHistoryOrders = [
    {
        id: "YK-84910",
        customerName: "Rohan Kapoor",
        phone: "+91 98101 23456",
        orderType: "delivery",
        dateTime: "Today, 02:45 PM",
        itemsSummary: "2x Paneer Kurkure Momos (Full), 1x Cold Coffee",
        itemsCount: 3,
        paymentMode: "UPI / QR",
        paymentStatus: "PAID",
        orderStatus: "COMPLETED",
        total: 290,
    },
    {
        id: "YK-84909",
        customerName: "Aakash Mehta",
        phone: "+91 98223 34455",
        orderType: "takeaway",
        dateTime: "Today, 02:15 PM",
        itemsSummary: "1x ₹179 Mega Feast Combo, 1x Veg Spring Roll",
        itemsCount: 2,
        paymentMode: "CASH",
        paymentStatus: "PAID",
        orderStatus: "COMPLETED",
        total: 229,
    },
    {
        id: "YK-84908",
        customerName: "Table 02 (Dining)",
        phone: "+91 99112 23344",
        orderType: "dine-in",
        dateTime: "Today, 01:30 PM",
        itemsSummary: "1x Butter Malai Chaap, 1x Singapuri Chowmein",
        itemsCount: 2,
        paymentMode: "CARD / POS",
        paymentStatus: "PAID",
        orderStatus: "COMPLETED",
        total: 200,
    },
    {
        id: "YK-84907",
        customerName: "Simran Kaur",
        phone: "+91 98770 12345",
        orderType: "delivery",
        dateTime: "Today, 01:05 PM",
        itemsSummary: "2x Paneer Samosa, 1x Red Sauce Pasta",
        itemsCount: 3,
        paymentMode: "ONLINE / RAZORPAY",
        paymentStatus: "PAID",
        orderStatus: "COMPLETED",
        total: 180,
    },
    {
        id: "YK-84906",
        customerName: "Kunal Bansal",
        phone: "+91 98110 99887",
        orderType: "delivery",
        dateTime: "Today, 12:40 PM",
        itemsSummary: "1x Honey Chilli Potato, 1x Cheese Burger",
        itemsCount: 2,
        paymentMode: "UPI / QR",
        paymentStatus: "REFUNDED",
        orderStatus: "CANCELLED",
        total: 170,
    },
    {
        id: "YK-84905",
        customerName: "Meenakshi Das",
        phone: "+91 98450 67890",
        orderType: "takeaway",
        dateTime: "Today, 12:10 PM",
        itemsSummary: "1x ₹150 Super Saver Combo",
        itemsCount: 1,
        paymentMode: "CASH",
        paymentStatus: "PAID",
        orderStatus: "COMPLETED",
        total: 150,
    },
];

const History = () => {
    const [ordersList, setOrdersList] = useState(mockHistoryOrders);
    const [searchQuery, setSearchQuery] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const handlePrintReceipt = (orderId) => {
        toast.success(`Printing Tax Invoice Receipt for #${orderId}`);
    };

    const handleExportCSV = () => {
        toast.info("Exporting Daily Billing Log to CSV...");
    };

    const filteredOrders = ordersList.filter((order) => {
        const matchesPayment =
            paymentFilter === "all" ||
            (paymentFilter === "paid" && order.paymentStatus === "PAID") ||
            (paymentFilter === "refunded" && order.paymentStatus === "REFUNDED");
        const matchesType = typeFilter === "all" || order.orderType === typeFilter;
        const matchesSearch =
            searchQuery === "" ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone.includes(searchQuery) ||
            order.paymentMode.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesPayment && matchesType && matchesSearch;
    });

    const totalRevenue = ordersList
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="history-screen">
            <div className="history-top-header">
                <div className="history-title-wrap">
                    <h2>Order History &amp; Billing Logs</h2>
                    <p>Daily completed orders, settlement receipts, payment modes &amp; invoices.</p>
                </div>

                <div className="history-kpi-row">
                    <div className="kpi-card revenue">
                        <span className="kpi-title">Settled Revenue</span>
                        <span className="kpi-amount">₹{totalRevenue}</span>
                    </div>
                    <div className="kpi-card count">
                        <span className="kpi-title">Total Orders</span>
                        <span className="kpi-amount">{ordersList.length} Orders</span>
                    </div>
                    <button type="button" className="export-btn" onClick={handleExportCSV}>
                        <FiDownloadCloud size={16} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="history-controls-bar">
                <div className="history-search-field">
                    <FiSearch className="search-ico" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Order #ID, Customer Name, Phone, UPI..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="history-input"
                    />
                </div>

                <div className="history-filters-cluster">
                    <div className="filter-group">
                        <button
                            type="button"
                            className={`f-pill ${typeFilter === "all" ? "active" : ""}`}
                            onClick={() => setTypeFilter("all")}
                        >
                            All ({ordersList.length})
                        </button>
                        <button
                            type="button"
                            className={`f-pill ${typeFilter === "delivery" ? "active" : ""}`}
                            onClick={() => setTypeFilter("delivery")}
                        >
                            <FaMotorcycle size={12} />
                            <span>Delivery</span>
                        </button>
                        <button
                            type="button"
                            className={`f-pill ${typeFilter === "takeaway" ? "active" : ""}`}
                            onClick={() => setTypeFilter("takeaway")}
                        >
                            <FaStoreAlt size={12} />
                            <span>Takeaway</span>
                        </button>
                        <button
                            type="button"
                            className={`f-pill ${typeFilter === "dine-in" ? "active" : ""}`}
                            onClick={() => setTypeFilter("dine-in")}
                        >
                            <FaUtensils size={12} />
                            <span>Dine-In</span>
                        </button>
                    </div>

                    <div className="filter-group">
                        <button
                            type="button"
                            className={`f-pill ${paymentFilter === "all" ? "active" : ""}`}
                            onClick={() => setPaymentFilter("all")}
                        >
                            All Status
                        </button>
                        <button
                            type="button"
                            className={`f-pill paid ${paymentFilter === "paid" ? "active" : ""}`}
                            onClick={() => setPaymentFilter("paid")}
                        >
                            Paid
                        </button>
                        <button
                            type="button"
                            className={`f-pill refunded ${paymentFilter === "refunded" ? "active" : ""}`}
                            onClick={() => setPaymentFilter("refunded")}
                        >
                            Refunded
                        </button>
                    </div>
                </div>
            </div>

            <div className="history-table-card">
                <div className="history-table-header">
                    <span className="col-id">Order ID</span>
                    <span className="col-cust">Customer &amp; Phone</span>
                    <span className="col-items">Dishes Ordered</span>
                    <span className="col-time">Date &amp; Time</span>
                    <span className="col-pay">Payment Mode</span>
                    <span className="col-total">Total Amount</span>
                    <span className="col-receipt">Invoice</span>
                </div>

                <div className="history-items-rows">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="history-item-row">
                                <div className="col-id">
                                    <span className="order-id-tag">#{order.id}</span>
                                    <span className={`type-badge ${order.orderType}`}>
                                        {order.orderType === "delivery" && <FaMotorcycle size={10} />}
                                        {order.orderType === "takeaway" && <FaStoreAlt size={10} />}
                                        {order.orderType === "dine-in" && <FaUtensils size={10} />}
                                        <span>{order.orderType.toUpperCase()}</span>
                                    </span>
                                </div>

                                <div className="col-cust">
                                    <strong className="cust-name">{order.customerName}</strong>
                                    <span className="cust-phone">{order.phone}</span>
                                </div>

                                <div className="col-items">
                                    <span className="items-summary" title={order.itemsSummary}>
                                        {order.itemsSummary}
                                    </span>
                                    <span className="count-pill">{order.itemsCount} items</span>
                                </div>

                                <div className="col-time">
                                    <span className="time-text">
                                        <FiClock size={12} /> {order.dateTime}
                                    </span>
                                </div>

                                <div className="col-pay">
                                    <span className="pay-mode">{order.paymentMode}</span>
                                    <span className={`pay-status ${order.paymentStatus.toLowerCase()}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                <div className="col-total">
                                    <strong className="total-amount">₹{order.total}</strong>
                                    <span className={`order-status-badge ${order.orderStatus.toLowerCase()}`}>
                                        {order.orderStatus === "COMPLETED" ? <FiCheckCircle size={10} /> : <FiXCircle size={10} />}
                                        <span>{order.orderStatus}</span>
                                    </span>
                                </div>

                                <div className="col-receipt">
                                    <button
                                        type="button"
                                        className="print-receipt-btn"
                                        onClick={() => handlePrintReceipt(order.id)}
                                        title="Print Bill / Invoice"
                                    >
                                        <FiPrinter size={15} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="history-empty-state">
                            <FiFileText size={28} />
                            <span>No orders matched your search or filters.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
