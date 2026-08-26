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
import api from "@/services/api";

const Checkout = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [specialRequest, setSpecialRequest] = useState("");
    const [couponInput, setCouponInput] = useState("");
    const [couponFeedback, setCouponFeedback] = useState(null);
    const [isCouponsOpen, setIsCouponsOpen] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    const clearCart = useStore((state) => state.clearCart);
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

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if(paymentMethod === 'online') {
            toast.error("Online payment is not yet integrated. Please select Cash.");
            return;
        }

        setIsSubmitting(true);
        try {
            const orderPayload = {
                customer: {
                    name: `${firstName} ${lastName}`.trim(),
                    phone,
                    email,
                    address: orderType === "delivery" ? "Sample Address (DLF Phase 3)" : "",
                },
                items: cart.map(item => ({
                    productId: item._id,
                    title: item.title,
                    image: item.image,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    portionLabel: item.portionLabel,
                    addons: item.addons || [],
                    cookingNote: item.cookingNote || specialRequest
                })),
                orderType,
                paymentMethod,
                totals
            };

            const res = await api.post("/orders", orderPayload);
            
            if (res.data.success) {
                toast.success(`Order Placed Successfully!`, {
                    description: `Order #${res.data.order.orderId} is confirmed. Tracking live now.`,
                });
                clearCart();
                useStore.setState({ activeOrder: res.data.order });
                router.push(`/track-order?id=${res.data.order.orderId}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) {
        return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
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
                                            <div className="address-type-tag">Guest Address</div>
                                            <p className="address-text">
                                                For guest checkout, delivery defaults to our standard zone. (Add detailed address form later).
                                            </p>
                                        </div>
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
                                    const itemKey = item.cartItemId || item.id || item._id;
                                    const itemUnit = item.unitPrice || 50;
                                    return (
                                        <div key={itemKey} className="preview-item-row">
                                            <div className="preview-img-wrap">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={55}
                                                    height={55}
                                                    className="preview-dish-img"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="preview-info-col">
                                                <h5 className="preview-dish-name">{item.title}</h5>
                                                <div className="preview-qty-pill" style={{marginTop: '5px'}}>
                                                    <button type="button" className="mini-qty-btn" onClick={() => updateQuantity(itemKey, item.quantity - 1)}>
                                                        <FiMinus size={10} />
                                                    </button>
                                                    <span className="mini-qty-val">{item.quantity}</span>
                                                    <button type="button" className="mini-qty-btn" onClick={() => updateQuantity(itemKey, item.quantity + 1)}>
                                                        <FiPlus size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="preview-price-col">
                                                <span className="preview-price">
                                                    ₹{(itemUnit * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="summary-rows" style={{marginTop: '20px'}}>
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal</span>
                                    <span className="summary-val">₹{totals.subtotal.toFixed(2)}</span>
                                </div>
                                {orderType === "delivery" && (
                                    <div className="summary-row">
                                        <span className="summary-label">Delivery Fee</span>
                                        <span className="summary-val">₹{totals.deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-row">
                                    <span className="summary-label">Platform Fee</span>
                                    <span className="summary-val">₹{totals.platformFee.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Taxes (GST 5%)</span>
                                    <span className="summary-val">₹{totals.tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total-row">
                                <span className="total-label">Total Amount</span>
                                <span className="total-val">₹{totals.grandTotal.toFixed(2)}</span>
                            </div>

                            <div className="payment-method-selector">
                                <label
                                    className={`payment-option-label ${paymentMethod === "cash" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("cash")}
                                >
                                    <span className={`custom-radio ${paymentMethod === "cash" ? "checked" : ""}`}></span>
                                    <FiDollarSign className="payment-icon" size={16} />
                                    <span className="payment-name">Cash Payment (COD)</span>
                                </label>
                            </div>

                            <button type="submit" className="checkout-btn" disabled={isSubmitting}>
                                <span>{isSubmitting ? "Placing Order..." : `Place Order (₹${totals.grandTotal.toFixed(2)})`}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
