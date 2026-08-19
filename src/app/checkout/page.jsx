"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FiUser,
    FiMapPin,
    FiPlus,
    FiMinus,
    FiEdit2,
    FiTrash2,
    FiCopy,
    FiChevronDown,
    FiArrowLeft,
    FiCheck,
    FiCreditCard,
    FiDollarSign,
    FiClock,
} from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils, FaStar } from "react-icons/fa";
import { PRODUCTS } from "@/constant/product";

const Checkout = () => {
    const [orderType, setOrderType] = useState("delivery");
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [pickupSlot, setPickupSlot] = useState("15");
    const [tableNo, setTableNo] = useState("T-04");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [isCouponsOpen, setIsCouponsOpen] = useState(true);

    const orderItems = PRODUCTS.slice(0, 2);

    const subtotal = 48.00;
    const deliveryFee = orderType === "delivery" ? 10.00 : 0.00;
    const platformFee = 2.00;
    const discount = 0.00;
    const grandTotal = (subtotal + deliveryFee + platformFee - discount).toFixed(2);

    return (
        <div className="inner-wrapper">
            <div className="container">
                <div className="cart-header-strip">
                    <Link href="/cart" className="back-to-shop-link">
                        <FiArrowLeft size={16} />
                        <span>Back to Cart</span>
                    </Link>
                </div>

                <div className="checkout-layout-grid">
                    <div className="checkout-main-col">
                        <div className="checkout-card order-type-card">
                            <div className="checkout-card-header">
                                <div className="checkout-header-title">
                                    <span className="checkout-title-icon">
                                        <FaMotorcycle size={18} />
                                    </span>
                                    <h3>Choose Order Type</h3>
                                </div>
                            </div>

                            <div className="order-type-selector-grid">
                                <button
                                    type="button"
                                    className={`order-type-btn ${orderType === "delivery" ? "active" : ""}`}
                                    onClick={() => setOrderType("delivery")}
                                >
                                    <div className="type-icon-circle">
                                        <FaMotorcycle size={20} />
                                    </div>
                                    <div className="type-info">
                                        <span className="type-title">Home Delivery</span>
                                        <span className="type-subtitle">At your doorstep (20-30 mins)</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`order-type-btn ${orderType === "takeaway" ? "active" : ""}`}
                                    onClick={() => setOrderType("takeaway")}
                                >
                                    <div className="type-icon-circle">
                                        <FaStoreAlt size={20} />
                                    </div>
                                    <div className="type-info">
                                        <span className="type-title">Takeaway / Pickup</span>
                                        <span className="type-subtitle">Self-collect from kitchen</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className={`order-type-btn ${orderType === "dine-in" ? "active" : ""}`}
                                    onClick={() => setOrderType("dine-in")}
                                >
                                    <div className="type-icon-circle">
                                        <FaUtensils size={20} />
                                    </div>
                                    <div className="type-info">
                                        <span className="type-title">Dine-In</span>
                                        <span className="type-subtitle">Eat at restaurant table</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="checkout-card">
                            <div className="checkout-card-header">
                                <div className="checkout-header-title">
                                    <span className="checkout-title-icon">
                                        <FiUser size={18} />
                                    </span>
                                    <h3>Basic Information</h3>
                                </div>
                            </div>

                            <div className="checkout-form-grid">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter First Name"
                                        className="checkout-input"
                                        defaultValue="Mohammad"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter Last Name"
                                        className="checkout-input"
                                        defaultValue="Saquib"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Enter Email Address"
                                        className="checkout-input"
                                        defaultValue="saquib@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        placeholder="Enter Phone Number"
                                        className="checkout-input"
                                        defaultValue="+91 98765 43210"
                                    />
                                </div>
                            </div>
                        </div>

                        {orderType === "delivery" && (
                            <div className="checkout-card">
                                <div className="checkout-card-header">
                                    <div className="checkout-header-title">
                                        <span className="checkout-title-icon">
                                            <FiMapPin size={18} />
                                        </span>
                                        <h3>Delivery Address</h3>
                                    </div>
                                    <button type="button" className="add-address-btn">
                                        <span>Add New Address</span>
                                    </button>
                                </div>

                                <div className="saved-addresses-list">
                                    <div
                                        className={`address-item-card ${selectedAddress === 1 ? "selected" : ""}`}
                                        onClick={() => setSelectedAddress(1)}
                                    >
                                        <div className="address-card-radio">
                                            <span className={`custom-radio ${selectedAddress === 1 ? "checked" : ""}`}></span>
                                        </div>
                                        <div className="address-card-content">
                                            <div className="address-type-tag">Home Address</div>
                                            <p className="address-text">
                                                Flat 402, Royal Palms Residency, DLF Phase 3, Cyber City, Gurugram, Haryana 122002
                                            </p>
                                        </div>
                                        <div className="address-actions-col">
                                            <button type="button" className="addr-action-btn" aria-label="Edit address">
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button type="button" className="addr-action-btn delete" aria-label="Delete address">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className={`address-item-card ${selectedAddress === 2 ? "selected" : ""}`}
                                        onClick={() => setSelectedAddress(2)}
                                    >
                                        <div className="address-card-radio">
                                            <span className={`custom-radio ${selectedAddress === 2 ? "checked" : ""}`}></span>
                                        </div>
                                        <div className="address-card-content">
                                            <div className="address-type-tag">Office Address</div>
                                            <p className="address-text">
                                                Tower B, 7th Floor, DLF Cyber City, Sector 24, Gurugram, Haryana 122002
                                            </p>
                                        </div>
                                        <div className="address-actions-col">
                                            <button type="button" className="addr-action-btn" aria-label="Edit address">
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button type="button" className="addr-action-btn delete" aria-label="Delete address">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {orderType === "takeaway" && (
                            <div className="checkout-card">
                                <div className="checkout-card-header">
                                    <div className="checkout-header-title">
                                        <span className="checkout-title-icon">
                                            <FiClock size={18} />
                                        </span>
                                        <h3>Estimated Pickup Time</h3>
                                    </div>
                                </div>

                                <div className="slot-selection-grid">
                                    <button
                                        type="button"
                                        className={`slot-chip-btn ${pickupSlot === "15" ? "active" : ""}`}
                                        onClick={() => setPickupSlot("15")}
                                    >
                                        <FiClock size={14} />
                                        <span>In 15 Minutes (Express)</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`slot-chip-btn ${pickupSlot === "30" ? "active" : ""}`}
                                        onClick={() => setPickupSlot("30")}
                                    >
                                        <FiClock size={14} />
                                        <span>In 30 Minutes</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`slot-chip-btn ${pickupSlot === "45" ? "active" : ""}`}
                                        onClick={() => setPickupSlot("45")}
                                    >
                                        <FiClock size={14} />
                                        <span>In 45 Minutes</span>
                                    </button>
                                </div>

                                <div className="kitchen-pickup-info-box">
                                    <FiMapPin size={18} className="pickup-pin-icon" />
                                    <div>
                                        <strong>Kitchen Location:</strong>
                                        <p>Your's Kitchen Counter, Sector 29 Cyber Hub, Gurugram (Near Gate 3)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {orderType === "dine-in" && (
                            <div className="checkout-card">
                                <div className="checkout-card-header">
                                    <div className="checkout-header-title">
                                        <span className="checkout-title-icon">
                                            <FaUtensils size={18} />
                                        </span>
                                        <h3>Table Details</h3>
                                    </div>
                                </div>

                                <div className="dine-in-form-grid">
                                    <div className="form-group">
                                        <label className="input-label-tag">Table Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Table 04"
                                            value={tableNo}
                                            onChange={(e) => setTableNo(e.target.value)}
                                            className="checkout-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label-tag">Special Dining Request</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Extra cutlery, baby chair"
                                            className="checkout-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="checkout-sidebar-col">
                        <div className="checkout-summary-card">
                            <h3 className="summary-card-title">Order Summary</h3>

                            <div className="checkout-items-preview">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="preview-item-row">
                                        <div className="preview-img-wrap">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={55}
                                                height={55}
                                                className="preview-dish-img"
                                            />
                                        </div>
                                        <div className="preview-info-col">
                                            <div className="preview-rating-pill">
                                                <FaStar className="star-gold" size={10} />
                                                <span>5.0</span>
                                            </div>
                                            <h5 className="preview-dish-name">{item.title}</h5>
                                            <div className="preview-qty-pill">
                                                <button type="button" className="mini-qty-btn">
                                                    <FiMinus size={10} />
                                                </button>
                                                <span className="mini-qty-val">1</span>
                                                <button type="button" className="mini-qty-btn">
                                                    <FiPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="preview-price-col">
                                            <span className="preview-price">{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="promo-input-row">
                                <input
                                    type="text"
                                    placeholder="Enter Promo Code"
                                    className="promo-input-field"
                                />
                                <button type="button" className="promo-apply-btn">
                                    <span>Apply</span>
                                </button>
                            </div>

                            <div className="available-coupons-accordion">
                                <div
                                    className="coupons-header"
                                    onClick={() => setIsCouponsOpen(!isCouponsOpen)}
                                >
                                    <span className="coupons-heading-text">Available Coupons</span>
                                    <FiChevronDown className={`accordion-chevron ${isCouponsOpen ? "open" : ""}`} size={16} />
                                </div>

                                {isCouponsOpen && (
                                    <div className="coupons-list">
                                        <div className="coupon-card">
                                            <div className="coupon-icon-box green">
                                                <span>🛒</span>
                                            </div>
                                            <div className="coupon-content">
                                                <div className="coupon-code-row">
                                                    <span className="coupon-tag">BIOFF10</span>
                                                    <FiCopy className="copy-icon" size={12} />
                                                    <span className="coupon-expiry">Valid until 20 May 2026</span>
                                                </div>
                                                <p className="coupon-desc">Get 10% off on your total order</p>
                                            </div>
                                        </div>

                                        <div className="coupon-card">
                                            <div className="coupon-icon-box orange">
                                                <span>🍔</span>
                                            </div>
                                            <div className="coupon-content">
                                                <div className="coupon-code-row">
                                                    <span className="coupon-tag">BURG05</span>
                                                    <FiCopy className="copy-icon" size={12} />
                                                    <span className="coupon-expiry">Valid until 25 May 2026</span>
                                                </div>
                                                <p className="coupon-desc">Get 10% off on your total order</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal</span>
                                    <span className="summary-val">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Delivery Fee</span>
                                    <span className="summary-val">
                                        {orderType === "delivery" ? `$${deliveryFee.toFixed(2)}` : "FREE"}
                                    </span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Platform Fee</span>
                                    <span className="summary-val">${platformFee.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Discount</span>
                                    <span className="summary-val discount-val">-$0.00</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total-row">
                                <span className="total-label">Total</span>
                                <span className="total-val">${grandTotal}</span>
                            </div>

                            <div className="payment-method-selector">
                                <label
                                    className={`payment-option-label ${paymentMethod === "cash" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("cash")}
                                >
                                    <span className={`custom-radio ${paymentMethod === "cash" ? "checked" : ""}`}></span>
                                    <FiDollarSign className="payment-icon" size={16} />
                                    <span className="payment-name">
                                        {orderType === "delivery"
                                            ? "Cash on Delivery"
                                            : orderType === "takeaway"
                                            ? "Pay at Kitchen Counter"
                                            : "Pay at Table / Cash"}
                                    </span>
                                </label>

                                {paymentMethod === "cash" && (
                                    <div className="payment-info-box">
                                        <p>
                                            {orderType === "delivery"
                                                ? "Pay with cash when your delivery partner arrives."
                                                : orderType === "takeaway"
                                                ? "Pay with cash or UPI at the pickup counter."
                                                : "Pay with cash directly to your dining server."}
                                        </p>
                                    </div>
                                )}

                                <label
                                    className={`payment-option-label ${paymentMethod === "online" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("online")}
                                >
                                    <span className={`custom-radio ${paymentMethod === "online" ? "checked" : ""}`}></span>
                                    <FiCreditCard className="payment-icon" size={16} />
                                    <span className="payment-name">UPI / Credit / Debit Card</span>
                                </label>
                            </div>

                            <Link href="/track-order" className="checkout-btn">
                                <span>Place Order & Track Live (${grandTotal})</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
