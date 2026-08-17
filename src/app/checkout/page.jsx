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
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { PRODUCTS } from "@/constant/product";

const Checkout = () => {
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [isCouponsOpen, setIsCouponsOpen] = useState(true);

    const orderItems = PRODUCTS.slice(0, 2);

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

                            <div className="address-cards-list">
                                <div
                                    className={`address-item-card ${selectedAddress === 1 ? "active" : ""}`}
                                    onClick={() => setSelectedAddress(1)}
                                >
                                    <div className="address-radio-col">
                                        <span className={`custom-radio ${selectedAddress === 1 ? "checked" : ""}`}></span>
                                    </div>
                                    <div className="address-detail-col">
                                        <h4 className="address-type-title">Home Address</h4>
                                        <p className="address-text">14, Maple Street, Los Angeles 21</p>
                                    </div>
                                    <div className="address-actions-col">
                                        <button type="button" className="addr-action-btn" aria-label="Edit address">
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button type="button" className="addr-action-btn" aria-label="Delete address">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className={`address-item-card ${selectedAddress === 2 ? "active" : ""}`}
                                    onClick={() => setSelectedAddress(2)}
                                >
                                    <div className="address-radio-col">
                                        <span className={`custom-radio ${selectedAddress === 2 ? "checked" : ""}`}></span>
                                    </div>
                                    <div className="address-detail-col">
                                        <h4 className="address-type-title">Office Address</h4>
                                        <p className="address-text">45, Lakeview Street, Seattle 29</p>
                                    </div>
                                    <div className="address-actions-col">
                                        <button type="button" className="addr-action-btn" aria-label="Edit address">
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button type="button" className="addr-action-btn" aria-label="Delete address">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-summary-col">
                        <div className="cart-summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="checkout-items-list">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="checkout-order-item">
                                        <div className="co-item-img-wrap">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={55}
                                                height={55}
                                                className="co-item-img"
                                            />
                                        </div>
                                        <div className="co-item-info">
                                            <h4 className="co-item-title">{item.title}</h4>
                                            <div className="co-item-rating">
                                                <FaStar className="star-icon" size={12} />
                                                <span>{item.rating || 5} ({item.ratingCount || 100})</span>
                                            </div>
                                            <div className="co-item-controls">
                                                <div className="qty-control-pill mini">
                                                    <button type="button" className="qty-btn" aria-label="Decrease quantity">
                                                        <FiMinus size={11} />
                                                    </button>
                                                    <span className="qty-number">1</span>
                                                    <button type="button" className="qty-btn" aria-label="Increase quantity">
                                                        <FiPlus size={11} />
                                                    </button>
                                                </div>
                                                <span className="co-item-price">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="promo-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter Promo Code"
                                    className="promo-input"
                                    readOnly
                                />
                                <button type="button" className="promo-apply-btn">
                                    Apply
                                </button>
                            </div>

                            <div className="coupons-accordion">
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
                                    <span className="summary-val">$48.00</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Delivery Fee</span>
                                    <span className="summary-val">$10.00</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Platform Fee</span>
                                    <span className="summary-val">$10.00</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Discount</span>
                                    <span className="summary-val discount-val">-$0.00</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total-row">
                                <span className="total-label">Total</span>
                                <span className="total-val">$68.00</span>
                            </div>

                            <div className="payment-method-selector">
                                <label
                                    className={`payment-option-label ${paymentMethod === "cash" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("cash")}
                                >
                                    <span className={`custom-radio ${paymentMethod === "cash" ? "checked" : ""}`}></span>
                                    <FiDollarSign className="payment-icon" size={16} />
                                    <span className="payment-name">Cash</span>
                                </label>

                                {paymentMethod === "cash" && (
                                    <div className="payment-info-box">
                                        <p>Pay with cash when your order is delivered.</p>
                                    </div>
                                )}

                                <label
                                    className={`payment-option-label ${paymentMethod === "online" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("online")}
                                >
                                    <span className={`custom-radio ${paymentMethod === "online" ? "checked" : ""}`}></span>
                                    <FiCreditCard className="payment-icon" size={16} />
                                    <span className="payment-name">Credit / Debit Card</span>
                                </label>
                            </div>

                            <button type="button" className="checkout-btn">
                                <span>Proceed to Checkout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
