import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { PRODUCTS } from "@/constant/product";

const Cart = () => {
    const cartItems = PRODUCTS.slice(0, 5);

    return (
        <div className="inner-wrapper">
            <div className="container">
                <div className="cart-header-strip">
                    <Link href="/" className="back-to-shop-link">
                        <FiArrowLeft size={16} />
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                <div className="cart-layout-grid">
                    <div className="cart-items-card">
                        <div className="cart-card-header">
                            <h2 className="cart-card-title">{cartItems.length} Orders</h2>
                            <button type="button" className="clear-cart-btn">
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
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="cart-row">
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
                                                    <span className="cart-prod-title">{item.title}</span>
                                                </div>
                                            </td>
                                            <td className="td-price">
                                                <span className="cart-price-val">{item.price}</span>
                                            </td>
                                            <td className="td-qty">
                                                <div className="qty-control-pill">
                                                    <button type="button" className="qty-btn" aria-label="Decrease quantity">
                                                        <FiMinus size={13} />
                                                    </button>
                                                    <span className="qty-number">1</span>
                                                    <button type="button" className="qty-btn" aria-label="Increase quantity">
                                                        <FiPlus size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="td-subtotal">
                                                <span className="cart-subtotal-val">{item.price}</span>
                                            </td>
                                            <td className="td-action">
                                                <button type="button" className="remove-item-btn" aria-label="Remove item">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="cart-summary-card">
                        <h2 className="summary-title">Order Summary</h2>

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

                        <div className="summary-rows">
                            <div className="summary-row">
                                <span className="summary-label">Subtotal</span>
                                <span className="summary-val">$118.46</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Delivery Fee</span>
                                <span className="summary-val">$5.00</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Tax</span>
                                <span className="summary-val">$5.92</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Shipping</span>
                                <span className="summary-val free-shipping">$0.00</span>
                            </div>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total-row">
                            <span className="total-label">Total</span>
                            <span className="total-val">$129.38</span>
                        </div>

                        <Link href="/checkout" className="checkout-btn">
                            <span>Proceed to Checkout</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;