"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    FiShoppingBag,
    FiTag,
} from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils, FaStar } from "react-icons/fa";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

const Checkout = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [firstName, setFirstName] = useState("Mohammad");
    const [lastName, setLastName] = useState("Saquib");
    const [email, setEmail] = useState("saquib@example.com");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [specialRequest, setSpecialRequest] = useState("");
    const [couponInput, setCouponInput] = useState("");
    const [couponFeedback, setCouponFeedback] = useState(null);
    const [isCouponsOpen, setIsCouponsOpen] = useState(true);

    const cart = useStore((state) => state.cart);
    const orderType = useStore((state) => state.orderType);
    const setOrderType = useStore((state) => state.setOrderType);
    const pickupSlot = useStore((state) => state.pickupSlot);
    const setPickupSlot = useStore((state) => state.setPickupSlot);
    const tableNo = useStore((state) => state.tableNo);
    const setTableNo = useStore((state) => state.setTableNo);
    const selectedAddressId = useStore((state) => state.selectedAddressId);
    const setSelectedAddressId = useStore((state) => state.setSelectedAddressId);
    const paymentMethod = useStore((state) => state.paymentMethod);
    const setPaymentMethod = useStore((state) => state.setPaymentMethod);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const applyCoupon = useStore((state) => state.applyCoupon);
    const removeCoupon = useStore((state) => state.removeCoupon);
    const appliedCoupon = useStore((state) => state.appliedCoupon);
    const createOrder = useStore((state) => state.createOrder);
    const getCartTotals = useStore((state) => state.getCartTotals);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totals = getCartTotals();

    const handleApplyCouponCode = (code) => {
        const res = applyCoupon(code);
        setCouponFeedback(res);
        setCouponInput(code);
        if (res.success) {
            toast.success(res.message, { description: `Coupon ${code} applied successfully!` });
        } else {
            toast.error(res.message);
        }
    };

    const handleCustomApply = (e) => {
        e.preventDefault();
        if (!couponInput) return;
        const res = applyCoupon(couponInput);
        setCouponFeedback(res);
        if (res.success) {
            toast.success(res.message, { description: `Coupon ${couponInput.toUpperCase()} applied!` });
        } else {
            toast.error(res.message);
        }
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        const order = createOrder({
            firstName,
            lastName,
            email,
            phone,
            specialRequest,
        });
        toast.success(`Order Placed Successfully!`, {
            description: `Order #${order.id} is confirmed. Tracking live now.`,
        });
        router.push("/track-order");
    };

    if (!mounted) {
        return (
            <div className="inner-wrapper">
                <div className="container">
                    <div className="cart-header-strip">
                        <Link href="/cart" className="back-to-shop-link">
                            <FiArrowLeft size={16} />
                            <span>Back to Cart</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="inner-wrapper">
                <div className="container">
                    <div className="empty-cart-state">
                        <div className="empty-cart-icon-wrap">
                            <FiShoppingBag size={48} />
                        </div>
                        <h2>No Items in Checkout</h2>
                        <p>Please add dishes to your cart before proceeding to checkout.</p>
                        <Link href="/foods" className="explore-menu-btn">
                            <span>Explore Gourmet Menu</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="inner-wrapper">
            <div className="container">
                <div className="cart-header-strip">
                    <Link href="/cart" className="back-to-shop-link">
                        <FiArrowLeft size={16} />
                        <span>Back to Cart</span>
                    </Link>
                </div>

                <form className="checkout-layout-grid" onSubmit={handlePlaceOrder}>
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
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter Last Name"
                                        className="checkout-input"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Enter Email Address"
                                        className="checkout-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        placeholder="Enter Phone Number"
                                        className="checkout-input"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
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
                                        className={`address-item-card ${selectedAddressId === 1 ? "selected" : ""}`}
                                        onClick={() => setSelectedAddressId(1)}
                                    >
                                        <div className="address-card-radio">
                                            <span className={`custom-radio ${selectedAddressId === 1 ? "checked" : ""}`}></span>
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
                                        className={`address-item-card ${selectedAddressId === 2 ? "selected" : ""}`}
                                        onClick={() => setSelectedAddressId(2)}
                                    >
                                        <div className="address-card-radio">
                                            <span className={`custom-radio ${selectedAddressId === 2 ? "checked" : ""}`}></span>
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
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label-tag">Special Dining Request</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Extra cutlery, baby chair"
                                            value={specialRequest}
                                            onChange={(e) => setSpecialRequest(e.target.value)}
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
                                {cart.map((item) => {
                                    const itemKey = item.cartItemId || item.id;
                                    const itemUnit = item.unitPrice || item.rawPrice || 25;
                                    return (
                                        <div key={itemKey} className="preview-item-row">
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
                                                    <button
                                                        type="button"
                                                        className="mini-qty-btn"
                                                        onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                                    >
                                                        <FiMinus size={10} />
                                                    </button>
                                                    <span className="mini-qty-val">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        className="mini-qty-btn"
                                                        onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                                    >
                                                        <FiPlus size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="preview-price-col">
                                                <span className="preview-price">
                                                    ${(itemUnit * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="promo-input-card">
                                <div className="promo-input-row">
                                    <div className="promo-field-wrap">
                                        <FiTag className="promo-field-icon" size={15} />
                                        <input
                                            type="text"
                                            placeholder="Enter Promo Code"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            className="promo-input-field"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="promo-apply-btn"
                                        onClick={handleCustomApply}
                                    >
                                        <span>Apply</span>
                                    </button>
                                </div>
                                {couponFeedback && (
                                    <p className={`promo-feedback-msg ${couponFeedback.success ? "success" : "error"}`}>
                                        {couponFeedback.message}
                                    </p>
                                )}
                                {appliedCoupon && (
                                    <div className="applied-coupon-pill">
                                        <span>Applied: <strong>{appliedCoupon}</strong></span>
                                        <button type="button" onClick={removeCoupon} className="remove-pill-btn">
                                            Remove
                                        </button>
                                    </div>
                                )}
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
                                        <div className="coupon-card" onClick={() => handleApplyCouponCode("BIOFF10")}>
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

                                        <div className="coupon-card" onClick={() => handleApplyCouponCode("BURG05")}>
                                            <div className="coupon-icon-box orange">
                                                <span>🍔</span>
                                            </div>
                                            <div className="coupon-content">
                                                <div className="coupon-code-row">
                                                    <span className="coupon-tag">BURG05</span>
                                                    <FiCopy className="copy-icon" size={12} />
                                                    <span className="coupon-expiry">Valid until 25 May 2026</span>
                                                </div>
                                                <p className="coupon-desc">Get $5.00 off on your total order</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal</span>
                                    <span className="summary-val">${totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Delivery Fee</span>
                                    <span className="summary-val">
                                        {orderType === "delivery" ? `$${totals.deliveryFee.toFixed(2)}` : "FREE"}
                                    </span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Platform Fee</span>
                                    <span className="summary-val">${totals.platformFee.toFixed(2)}</span>
                                </div>
                                {totals.discount > 0 && (
                                    <div className="summary-row">
                                        <span className="summary-label">Discount</span>
                                        <span className="summary-val discount-val">-${totals.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-row">
                                    <span className="summary-label">Taxes (GST 5%)</span>
                                    <span className="summary-val">${totals.tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total-row">
                                <span className="total-label">Total</span>
                                <span className="total-val">${totals.grandTotal.toFixed(2)}</span>
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

                            <button type="submit" className="checkout-btn">
                                <span>Place Order & Track Live (${totals.grandTotal.toFixed(2)})</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
