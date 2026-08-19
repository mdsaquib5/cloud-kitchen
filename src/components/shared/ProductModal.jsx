"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiCheck } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import { useStore } from "@/store/useStore";

const ProductModal = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedPortion, setSelectedPortion] = useState("regular");
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [cookingNote, setCookingNote] = useState("");
    const [isAdded, setIsAdded] = useState(false);

    const addToCart = useStore((state) => state.addToCart);

    if (!isOpen || !product) return null;

    const portionOptions = [
        { id: "regular", name: "Regular / Half", extra: 0 },
        { id: "large", name: "Large / Full", extra: 8.00 },
    ];

    const addonOptions = [
        { id: "addon-1", name: "Extra Spiced Dip / Chutney", price: 2.50 },
        { id: "addon-2", name: "Grated Cheddar / Cheese", price: 3.50 },
        { id: "addon-3", name: "Fresh Butter Naan (1 pc)", price: 3.00 },
    ];

    const toggleAddon = (addonId) => {
        if (selectedAddons.includes(addonId)) {
            setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
        } else {
            setSelectedAddons([...selectedAddons, addonId]);
        }
    };

    const selectedPortionObj = portionOptions.find((p) => p.id === selectedPortion);
    const portionExtra = selectedPortionObj ? selectedPortionObj.extra : 0;
    const selectedAddonsObjs = addonOptions.filter((a) => selectedAddons.includes(a.id));
    const addonsTotal = selectedAddonsObjs.reduce((sum, item) => sum + item.price, 0);

    const unitPrice = (product.rawPrice || 25.00) + portionExtra + addonsTotal;
    const totalPrice = (unitPrice * quantity).toFixed(2);

    const handleAddToCart = () => {
        addToCart(product, {
            portion: selectedPortion,
            portionLabel: selectedPortionObj?.name || "Regular / Half",
            portionExtra,
            addons: selectedAddonsObjs,
            cookingNote,
            quantity,
        });

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose();
        }, 600);
    };

    return (
        <div className="product-modal-backdrop" onClick={onClose}>
            <div className="product-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
                    <FiX size={20} />
                </button>

                <div className="modal-product-grid">
                    <div className="modal-media-col">
                        <div className="modal-img-wrap">
                            <Image
                                src={product.image}
                                alt={product.title}
                                width={400}
                                height={400}
                                className="modal-product-img"
                            />
                            <div className="modal-dietary-badge">
                                <span className={product.isVeg ? "diet-dot veg" : "diet-dot non-veg"}></span>
                                <span>{product.isVeg ? "Pure Veg" : "Non-Veg"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-details-col">
                        <div className="modal-header-info">
                            <div className="modal-category-tag">{product.categoryName || "Speciality"}</div>
                            <h2 className="modal-product-title">{product.title}</h2>
                            
                            <div className="modal-rating-row">
                                <div className="stars-pill">
                                    <FaStar size={13} className="star-gold" />
                                    <span>{product.rating || 5}.0</span>
                                </div>
                                <span className="reviews-count">({product.ratingCount || 100}+ reviews)</span>
                            </div>

                            <p className="modal-product-desc">{product.description}</p>
                            
                            <div className="modal-price-box">
                                <span className="modal-current-price">${unitPrice.toFixed(2)}</span>
                                {product.totalDiscount && (
                                    <span className="modal-original-price">{product.totalDiscount}</span>
                                )}
                                {product.discount && (
                                    <span className="modal-discount-pill">{product.discount}</span>
                                )}
                            </div>
                        </div>

                        <div className="modal-options-scroll">
                            <div className="modal-option-section">
                                <h4 className="option-section-title">Select Portion</h4>
                                <div className="portion-chips-group">
                                    {portionOptions.map((portion) => (
                                        <button
                                            key={portion.id}
                                            type="button"
                                            className={`portion-chip-btn ${selectedPortion === portion.id ? "active" : ""}`}
                                            onClick={() => setSelectedPortion(portion.id)}
                                        >
                                            <span>{portion.name}</span>
                                            {portion.extra > 0 && <span className="chip-extra-tag">+${portion.extra.toFixed(2)}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-option-section">
                                <h4 className="option-section-title">Add-ons & Extras</h4>
                                <div className="addons-list-group">
                                    {addonOptions.map((addon) => {
                                        const isSelected = selectedAddons.includes(addon.id);
                                        return (
                                            <label
                                                key={addon.id}
                                                className={`addon-item-label ${isSelected ? "selected" : ""}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleAddon(addon.id)}
                                                    className="addon-checkbox"
                                                />
                                                <span className="addon-name">{addon.name}</span>
                                                <span className="addon-price">+${addon.price.toFixed(2)}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="modal-option-section">
                                <h4 className="option-section-title">Cooking Instructions (Optional)</h4>
                                <input
                                    type="text"
                                    placeholder="e.g. Less spicy, extra lemon, no onions..."
                                    value={cookingNote}
                                    onChange={(e) => setCookingNote(e.target.value)}
                                    className="cooking-note-input"
                                />
                            </div>
                        </div>

                        <div className="modal-footer-action">
                            <div className="modal-qty-selector">
                                <button
                                    type="button"
                                    className="qty-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    aria-label="Decrease quantity"
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="qty-val">{quantity}</span>
                                <button
                                    type="button"
                                    className="qty-btn"
                                    onClick={() => setQuantity(quantity + 1)}
                                    aria-label="Increase quantity"
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>

                            <button
                                type="button"
                                className={`modal-add-cart-btn ${isAdded ? "added" : ""}`}
                                onClick={handleAddToCart}
                            >
                                {isAdded ? (
                                    <>
                                        <FiCheck size={18} />
                                        <span>Added to Cart!</span>
                                    </>
                                ) : (
                                    <>
                                        <FiShoppingBag size={18} />
                                        <span>Add to Cart (${totalPrice})</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
