"use client";

import React, { useState } from "react";
import {
    FiSearch,
    FiUser,
    FiPhone,
    FiMapPin,
    FiShoppingBag,
    FiCalendar,
    FiMessageCircle,
    FiAward,
    FiSend,
} from "react-icons/fi";
import { FaWhatsapp, FaStar } from "react-icons/fa";
import { toast } from "sonner";

const mockCustomers = [
    {
        id: "CUST-101",
        name: "Rahul Sharma",
        phone: "9876543210",
        address: "Flat 402, Royal Palms, Cyber City",
        totalOrders: 14,
        totalSpend: 4250,
        lastOrderDate: "Yesterday",
        favoriteDish: "Paneer Kurkure Momos",
        tag: "VIP Loyal",
    },
    {
        id: "CUST-102",
        name: "Sneha Patel",
        phone: "9822233445",
        address: "Sector 56, Huda Colony, Gurgaon",
        totalOrders: 8,
        totalSpend: 2180,
        lastOrderDate: "2 days ago",
        favoriteDish: "₹179 Mega Feast Combo",
        tag: "Regular",
    },
    {
        id: "CUST-103",
        name: "Amit Kumar",
        phone: "9811122334",
        address: "Tower B, Sector 29, Gurgaon",
        totalOrders: 5,
        totalSpend: 1420,
        lastOrderDate: "Today",
        favoriteDish: "White Sauce Pasta",
        tag: "Frequent",
    },
    {
        id: "CUST-104",
        name: "Vikram Singh",
        phone: "9765432109",
        address: "House 12, Block C, Sushant Lok",
        totalOrders: 3,
        totalSpend: 890,
        lastOrderDate: "5 days ago",
        favoriteDish: "Butter Malai Chaap",
        tag: "New Customer",
    },
    {
        id: "CUST-105",
        name: "Simran Kaur",
        phone: "9877012345",
        address: "DLF Phase 4, Galleria Market Area",
        totalOrders: 11,
        totalSpend: 3600,
        lastOrderDate: "3 days ago",
        favoriteDish: "Paneer Samosa",
        tag: "VIP Loyal",
    },
    {
        id: "CUST-106",
        name: "Kunal Bansal",
        phone: "9811099887",
        address: "Sector 45, Greenwood City",
        totalOrders: 2,
        totalSpend: 540,
        lastOrderDate: "1 week ago",
        favoriteDish: "Cheese Burger",
        tag: "Occasional",
    },
];

const Customers = () => {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/orders/admin/all");
            const data = await res.json();
            if (data.success) {
                const customerMap = {};

                data.orders.forEach(o => {
                    const phone = o.customer?.phone;
                    if (!phone) return;

                    if (!customerMap[phone]) {
                        customerMap[phone] = {
                            id: "CUST-" + phone.substring(phone.length - 4),
                            name: o.customer.name || "Unknown",
                            phone: phone,
                            address: o.customer.address || "No Address Provided",
                            totalOrders: 0,
                            totalSpend: 0,
                            lastOrderDate: new Date(o.createdAt),
                            itemCounts: {}
                        };
                    }

                    // Update stats
                    customerMap[phone].totalOrders += 1;
                    customerMap[phone].totalSpend += (o.totals?.grandTotal || 0);
                    
                    const orderDate = new Date(o.createdAt);
                    if (orderDate > customerMap[phone].lastOrderDate) {
                        customerMap[phone].lastOrderDate = orderDate;
                    }

                    // Track favorite dishes
                    o.items.forEach(item => {
                        customerMap[phone].itemCounts[item.title] = (customerMap[phone].itemCounts[item.title] || 0) + item.quantity;
                    });
                });

                const formattedCustomers = Object.values(customerMap).map(cust => {
                    // Find favorite dish
                    let favDish = "None";
                    let maxCount = 0;
                    for (const [dish, count] of Object.entries(cust.itemCounts)) {
                        if (count > maxCount) {
                            maxCount = count;
                            favDish = dish;
                        }
                    }

                    // Determine Tag
                    let tag = "New Customer";
                    if (cust.totalOrders > 10) tag = "VIP Loyal";
                    else if (cust.totalOrders > 4) tag = "Frequent";
                    else if (cust.totalOrders > 1) tag = "Regular";

                    // Format date
                    const diffDays = Math.floor((new Date() - cust.lastOrderDate) / (1000 * 60 * 60 * 24));
                    let dateStr = "Today";
                    if (diffDays === 1) dateStr = "Yesterday";
                    else if (diffDays > 1) dateStr = `${diffDays} days ago`;

                    return {
                        id: cust.id,
                        name: cust.name,
                        phone: cust.phone,
                        address: cust.address,
                        totalOrders: cust.totalOrders,
                        totalSpend: cust.totalSpend,
                        lastOrderDate: dateStr,
                        favoriteDish: favDish,
                        tag: tag
                    };
                });

                // Sort by total spend descending
                formattedCustomers.sort((a, b) => b.totalSpend - a.totalSpend);
                
                setCustomers(formattedCustomers);
            }
        } catch (error) {
            console.error("Failed to fetch customers", error);
            toast.error("Failed to load customer CRM");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [tagFilter, setTagFilter] = useState("all");

    const sendWhatsAppPromo = (cust) => {
        const message = encodeURIComponent(
            `Hi ${cust.name}! 🥟\nSpecial craving for ${cust.favoriteDish}? Order directly from Shree Shyam Fast Food and get 15% OFF today!\n👉 Order Link: https://shreeshyam.com/foods`
        );
        window.open(`https://wa.me/91${cust.phone}?text=${message}`, "_blank");
        toast.success(`WhatsApp reorder loop opened for ${cust.name}!`);
    };

    const filteredCustomers = customers.filter((cust) => {
        const matchesTag = tagFilter === "all" || cust.tag.toLowerCase().includes(tagFilter.toLowerCase());
        const matchesSearch =
            searchQuery === "" ||
            cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cust.phone.includes(searchQuery) ||
            cust.favoriteDish.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTag && matchesSearch;
    });

    const totalCustomers = customers.length;
    const vipCount = customers.filter((c) => c.tag === "VIP Loyal").length;
    const avgOrderVal = customers.length === 0 ? 0 : Math.round(
        customers.reduce((sum, c) => sum + c.totalSpend, 0) /
            customers.reduce((sum, c) => sum + c.totalOrders, 0)
    );

    return (
        <div className="cust-screen">
            <div className="cust-top-header">
                <div className="cust-title-wrap">
                    <h2>Customers Directory</h2>
                    <p>Customer retention, lifetime spend profiles &amp; direct WhatsApp re-order loops.</p>
                </div>

                <div className="cust-kpi-row">
                    <div className="cust-kpi">
                        <span className="c-kpi-lbl">Total Profiles</span>
                        <span className="c-kpi-val">{totalCustomers}</span>
                    </div>
                    <div className="cust-kpi vip">
                        <span className="c-kpi-lbl">VIP Customers</span>
                        <span className="c-kpi-val">{vipCount}</span>
                    </div>
                    <div className="cust-kpi">
                        <span className="c-kpi-lbl">Avg Order Ticket</span>
                        <span className="c-kpi-val">₹{avgOrderVal}</span>
                    </div>
                </div>
            </div>

            <div className="cust-controls-bar">
                <div className="cust-search-field">
                    <FiSearch className="search-ico" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Customer Name, Phone number or Favorite Dish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="cust-input"
                    />
                </div>

                <div className="cust-filter-pills">
                    <button
                        type="button"
                        className={`cust-f-btn ${tagFilter === "all" ? "active" : ""}`}
                        onClick={() => setTagFilter("all")}
                    >
                        All ({customers.length})
                    </button>
                    <button
                        type="button"
                        className={`cust-f-btn vip ${tagFilter === "vip" ? "active" : ""}`}
                        onClick={() => setTagFilter("vip")}
                    >
                        <FaStar size={11} />
                        <span>VIP Loyal ({vipCount})</span>
                    </button>
                    <button
                        type="button"
                        className={`cust-f-btn ${tagFilter === "regular" ? "active" : ""}`}
                        onClick={() => setTagFilter("regular")}
                    >
                        Regular
                    </button>
                    <button
                        type="button"
                        className={`cust-f-btn ${tagFilter === "new" ? "active" : ""}`}
                        onClick={() => setTagFilter("new")}
                    >
                        New Customer
                    </button>
                </div>
            </div>

            <div className="cust-cards-grid">
                {filteredCustomers.map((cust) => (
                    <div key={cust.id} className="cust-profile-card">
                        <div className="c-card-top">
                            <div className="c-avatar-block">
                                <div className="c-avatar">
                                    <FiUser size={18} />
                                </div>
                                <div className="c-name-box">
                                    <span className="c-name">{cust.name}</span>
                                    <span className="c-phone">
                                        <FiPhone size={11} /> +91 {cust.phone}
                                    </span>
                                </div>
                            </div>

                            <span className={`c-tag-pill ${cust.tag.toLowerCase().replace(" ", "-")}`}>
                                {cust.tag === "VIP Loyal" && <FaStar size={10} />}
                                <span>{cust.tag}</span>
                            </span>
                        </div>

                        <div className="c-fav-dish-box">
                            <span className="fav-lbl">Most Ordered Dish:</span>
                            <strong className="fav-val">{cust.favoriteDish}</strong>
                        </div>

                        <div className="c-stats-grid">
                            <div className="c-stat-box">
                                <span className="stat-num">{cust.totalOrders}</span>
                                <span className="stat-lbl">Orders Placed</span>
                            </div>
                            <div className="c-stat-box">
                                <span className="stat-num">₹{cust.totalSpend}</span>
                                <span className="stat-lbl">Total Spend</span>
                            </div>
                            <div className="c-stat-box">
                                <span className="stat-num">{cust.lastOrderDate}</span>
                                <span className="stat-lbl">Last Active</span>
                            </div>
                        </div>

                        <div className="c-card-footer">
                            <span className="c-addr" title={cust.address}>
                                <FiMapPin size={12} /> {cust.address}
                            </span>

                            <button
                                type="button"
                                className="whatsapp-reorder-btn"
                                onClick={() => sendWhatsAppPromo(cust)}
                                title="Send WhatsApp Reorder Message"
                            >
                                <FaWhatsapp size={15} />
                                <span>WhatsApp Reorder</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;
