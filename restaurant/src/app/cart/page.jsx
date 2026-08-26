"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiTruck, FiBriefcase } from "react-icons/fi";
import EmptyState from "@/components/shared/EmptyState";
import { useStore } from "@/store/useStore";

const Cart = () => {
    const [mounted, setMounted] = useState(false);

    const cart = useStore((state) => state.cart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const clearCart = useStore((state) => state.clearCart);
    const getCartTotals = useStore((state) => state.getCartTotals);
    const orderType = useStore((state) => state.orderType);
    const setOrderType = useStore((state) => state.setOrderType);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totals = getCartTotals();

    if (!mounted) {
        return (
            <div className="inner-wrapper">
                <div className="container">
                    <div className="cart-header-strip">
                        <Link href="/foods" className="back-to-shop-link">
                            <FiArrowLeft size={16} />
                            <span>Continue Shopping</span>
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
                    <Link href="/foods" className="back-to-shop-link">
                        <FiArrowLeft size={16} />
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                {cart.length > 0 ? (
                    <div className="cart-layout-grid">
                        <div className="cart-items-card">
                            <div className="cart-card-header">
                                <h2 className="cart-card-title">
                                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Orders
                                </h2>
                                <button type="button" className="clear-cart-btn" onClick={clearCart}>
                                    <FiTrash2 size={15} />
                                    <span>Clear Cart</span>
                                </button>
                            </div>

                            <div className="cart-table-wrap">
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <th className="th-product">Product</th>
                                            <th className="th-price">Price</th>
                                            <th className="th-qty">Quantity</th>
                                            <th className="th-subtotal">Subtotal</th>
                                            <th className="th-action"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item) => {
                                            const itemKey = item.cartItemId || item.id || item._id;
                                            const itemUnitPrice = item.unitPrice || (item.portions && item.portions.length > 0 ? item.portions[0].price : 50);
                                            const subtotal = (itemUnitPrice * item.quantity).toFixed(2);

                                            return (
                                                <tr key={itemKey} className="cart-row">
                                                    <td className="td-product">
                                                        <div className="cart-prod-info">
                                                            <div className="cart-prod-img-wrap">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    width={50}
                                                                    height={50}
                                                                    className="cart-prod-img"
                                                                />
                                                            </div>
                                                            <div>
                                                                <span className="cart-prod-title">{item.title}</span>
                                                                {item.portionLabel && (
                                                                    <div className="cart-item-portion-tag">
                                                                        {item.portionLabel}
                                                                    </div>
                                                                )}
                                                                {item.addons && item.addons.length > 0 && (
                                                                    <div className="cart-item-addons" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                                        + {item.addons.map(a => a.name).join(', ')}
                                                                    </div>
                                                                )}
                                                                {item.cookingNote && (
                                                                    <div className="cart-item-note" style={{ fontSize: '11px', color: '#ff7e67', fontStyle: 'italic', marginTop: '4px' }}>
                                                                        Note: {item.cookingNote}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="td-price">
                                                        <span className="cart-price-val">₹{itemUnitPrice.toFixed(2)}</span>
                                                    </td>
                                                    <td className="td-qty">
                                                        <div className="qty-control-pill">
                                                            <button
                                                                type="button"
                                                                className="qty-btn"
                                                                onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <FiMinus size={13} />
                                                            </button>
                                                            <span className="qty-number">{item.quantity}</span>
                                                            <button
                                                                type="button"
                                                                className="qty-btn"
                                                                onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                                                aria-label="Increase quantity"
                                                            >
                                                                <FiPlus size={13} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="td-subtotal">
                                                        <span className="cart-subtotal-val">₹{subtotal}</span>
                                                    </td>
                                                    <td className="td-action">
                                                        <button
                                                            type="button"
                                                            className="remove-item-btn"
                                                            onClick={() => removeFromCart(itemKey)}
                                                            aria-label="Remove item"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="cart-summary-card">
                            <h3 className="summary-title">Order Summary</h3>

                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span className="summary-label">Items Total ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
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
                                {totals.discount > 0 && (
                                    <div className="summary-row">
                                        <span className="summary-label">Discount</span>
                                        <span className="summary-val discount-val">-₹{totals.discount.toFixed(2)}</span>
                                    </div>
                                )}
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

                            <Link href="/checkout" className="checkout-btn">
                                <span>Proceed to Checkout</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        title="Your Cart is Empty"
                        description="Looks like you haven't added any authentic dishes to your cart yet."
                        buttonText="Explore Gourmet Menu"
                        buttonHref="/foods"
                    />
                )}
            </div>
        </div>
    );
};

export default Cart;
