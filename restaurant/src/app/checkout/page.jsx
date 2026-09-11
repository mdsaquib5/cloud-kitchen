"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
    FiUser,
    FiMapPin,
    FiPlus,
    FiMinus,
    FiArrowLeft,
    FiShoppingBag,
    FiNavigation,
} from "react-icons/fi";
import { FaMotorcycle, FaStoreAlt, FaUtensils } from "react-icons/fa";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRouter } from "next/navigation";
import orderService from "@/services/orderService";
import paymentService from "@/services/paymentService";
import { load } from "@cashfreepayments/cashfree-js";

const Checkout = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isKitchenOpen = useSettingsStore((state) => state.isKitchenOpen);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [landmark, setLandmark] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryLat, setDeliveryLat] = useState(null);
    const [deliveryLng, setDeliveryLng] = useState(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cashfreeInstance, setCashfreeInstance] = useState(null);
    const cart = useStore((state) => state.cart);
    const orderType = useStore((state) => state.orderType);
    const setOrderType = useStore((state) => state.setOrderType);
    const selectedAddressId = useStore((state) => state.selectedAddressId);
    const setSelectedAddressId = useStore((state) => state.setSelectedAddressId);
    const paymentMethod = useStore((state) => state.paymentMethod);
    const setPaymentMethod = useStore((state) => state.setPaymentMethod);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const clearCart = useStore((state) => state.clearCart);
    const getCartTotals = useStore((state) => state.getCartTotals);
    const addPastOrder = useStore((state) => state.addPastOrder);

    useEffect(() => {
        setMounted(true);
        setPaymentMethod("online");
        load({ mode: "production" })
            .then((cf) => setCashfreeInstance(cf))
            .catch((err) => console.error("Cashfree SDK pre-load failed:", err));
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/login");
        }
    }, [mounted, isAuthenticated, router]);

    const totals = getCartTotals();

    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }
        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setDeliveryLat(latitude);
                setDeliveryLng(longitude);
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const address = data.display_name || `${latitude}, ${longitude}`;
                    setDeliveryAddress(address);
                    toast.success("Location fetched successfully!");
                } catch {
                    setDeliveryAddress(`${latitude}, ${longitude}`);
                    toast.success("Location coordinates saved!");
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                setIsFetchingLocation(false);
                if (error.code === error.PERMISSION_DENIED) {
                    toast.error("Location permission denied. Please allow location access.");
                } else {
                    toast.error("Unable to fetch location. Please try again.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!isKitchenOpen) {
            toast.error("Sorry, the kitchen is currently closed. You cannot place an order right now.");
            return;
        }

        if (orderType === "delivery" && !deliveryAddress) {
            toast.error("Please fetch your location first for Home Delivery.");
            return;
        }

        setIsSubmitting(true);
        try {
            const orderPayload = {
                customer: {
                    name: `${firstName} ${lastName}`.trim(),
                    phone,
                    email,
                    address: orderType === "delivery" ? deliveryAddress : "",
                    addressLine: orderType === "delivery" ? addressLine : "",
                    landmark: orderType === "delivery" ? landmark : "",
                    latitude: orderType === "delivery" ? deliveryLat : null,
                    longitude: orderType === "delivery" ? deliveryLng : null,
                },
                items: cart.map((item) => ({
                    productId: item._id,
                    title: item.title,
                    image: item.image,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    portionLabel: item.portionLabel,
                    addons: item.addons || [],
                    cookingNote: item.cookingNote || "",
                })),
                orderType,
                paymentMethod,
                totals,
            };

            const res = await orderService.createOrder(orderPayload);

            if (res.data.success) {
                const newOrder = res.data.order;

                if (paymentMethod === "online") {
                    toast.loading("Initializing secure payment gateway...", { id: "cf-init" });

                    try {
                        const paymentRes = await paymentService.createPayment({
                            orderId: newOrder.orderId,
                            amount: totals.grandTotal,
                            customerPhone: phone,
                            customerName: `${firstName} ${lastName}`.trim(),
                            customerEmail: email,
                        });

                        if (paymentRes.data.success) {
                            toast.dismiss("cf-init");
                            const cfInstance = cashfreeInstance || (await load({ mode: "sandbox" }));
                            cfInstance.checkout({
                                paymentSessionId: paymentRes.data.payment_session_id,
                                redirectTarget: "_self",
                            });
                        } else {
                            toast.error("Failed to initiate payment. Please try again.", { id: "cf-init" });
                        }
                    } catch (error) {
                        console.error("Payment error:", error);
                        toast.error("Payment gateway error. Please try again.", { id: "cf-init" });
                    }
                } else {
                    toast.success(`Order #${newOrder.orderId} Placed Successfully! Tracking live now.`);
                    clearCart();
                    useStore.getState().addActiveOrder(newOrder);
                    addPastOrder(newOrder);
                    router.push(`/track-order?id=${newOrder.orderId}`);
                }
            }
        } catch (error) {
            console.error("Order placement failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) return null;

    if (!mounted) {
        return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;
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
                        {/* Order Type */}
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

                        {/* Basic Information */}
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

                            {orderType === "delivery" && (
                                <>
                                    <div className="checkout-form-grid delivery-extra-fields">
                                        <div className="form-group checkout-full-span">
                                            <input
                                                type="text"
                                                placeholder="Enter Full Address (House No, Street, Area)"
                                                className="checkout-input"
                                                value={addressLine}
                                                onChange={(e) => setAddressLine(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group checkout-full-span">
                                            <input
                                                type="text"
                                                placeholder="Landmark (e.g. Near Metro Station, Opposite Park)"
                                                className="checkout-input"
                                                value={landmark}
                                                onChange={(e) => setLandmark(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="fetch-location-row">
                                        <button
                                            type="button"
                                            id="fetch-location-btn"
                                            className={`fetch-location-btn${deliveryAddress ? " location-success" : ""}`}
                                            disabled={isFetchingLocation}
                                            onClick={handleFetchLocation}
                                        >
                                            <FiNavigation size={15} />
                                            <span>
                                                {isFetchingLocation
                                                    ? "Fetching Location..."
                                                    : deliveryAddress
                                                    ? "Update My Location"
                                                    : "Fetch My Location"}
                                            </span>
                                        </button>

                                        {deliveryAddress && (
                                            <p className="fetched-address-preview">
                                                <FiMapPin size={13} />
                                                <span>{deliveryAddress}</span>
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
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
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="preview-info-col">
                                                <h5 className="preview-dish-name">{item.title}</h5>
                                                <div className="preview-qty-pill" style={{ marginTop: "5px" }}>
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
                                                    Rs.{(itemUnit * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="summary-rows" style={{ marginTop: "20px" }}>
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal</span>
                                    <span className="summary-val">Rs.{totals.subtotal.toFixed(2)}</span>
                                </div>
                                {orderType === "delivery" && (
                                    <div className="summary-row">
                                        <span className="summary-label">Delivery Fee</span>
                                        <span className="summary-val">Rs.{totals.deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total-row">
                                <span className="total-label">Total Amount</span>
                                <span className="total-val">Rs.{totals.grandTotal.toFixed(2)}</span>
                            </div>

                            <div className="payment-method-selector">
                                <label
                                    className={`payment-option-label ${paymentMethod === "online" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("online")}
                                >
                                    <span className={`custom-radio ${paymentMethod === "online" ? "checked" : ""}`}></span>
                                    <FiShoppingBag className="payment-icon" size={16} />
                                    <span className="payment-name">Online Payment (UPI/Card)</span>
                                </label>

                                <label
                                    className={`payment-option-label ${paymentMethod === "cash" ? "selected" : ""}`}
                                    onClick={() => setPaymentMethod("cash")}
                                >
                                    <span className={`custom-radio ${paymentMethod === "cash" ? "checked" : ""}`}></span>
                                    <FiShoppingBag className="payment-icon" size={16} />
                                    <span className="payment-name">Cash on Delivery (COD)</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="checkout-btn"
                                disabled={isSubmitting || !isKitchenOpen}
                                style={
                                    !isKitchenOpen
                                        ? { background: "#d1d5db", cursor: "not-allowed", color: "#6b7280" }
                                        : {}
                                }
                            >
                                <span>
                                    {!isKitchenOpen
                                        ? "Kitchen Closed"
                                        : isSubmitting
                                        ? "Placing Order..."
                                        : `Place Order (Rs.${totals.grandTotal.toFixed(2)})`}
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
