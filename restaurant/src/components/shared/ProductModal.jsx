"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiCheck } from "react-icons/fi";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const ProductModal = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedPortionId, setSelectedPortionId] = useState("");
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [cookingNote, setCookingNote] = useState("");
    const [isAdded, setIsAdded] = useState(false);

    const addToCart = useStore((state) => state.addToCart);

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            if (product.portions && product.portions.length > 0) {
                setSelectedPortionId(product.portions[0]._id || product.portions[0].portionName);
            }
            setSelectedAddons([]);
            setCookingNote("");
            setIsAdded(false);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const portionOptions = product.portions || [{ portionName: "Standard", price: 50, _id: "standard" }];
    const addonOptions = product.addOns || [];

    const toggleAddon = (addon) => {
        const id = addon._id || addon.name;
        if (selectedAddons.some(a => (a._id || a.name) === id)) {
            setSelectedAddons(selectedAddons.filter((a) => (a._id || a.name) !== id));
        } else {
            setSelectedAddons([...selectedAddons, addon]);
        }
    };

    const selectedPortionObj = portionOptions.find((p) => (p._id || p.portionName) === selectedPortionId) || portionOptions[0];
    const baseItemPrice = selectedPortionObj ? selectedPortionObj.price : 50.00;

    const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    const unitPrice = baseItemPrice + addonsTotal;
    const totalPrice = (unitPrice * quantity).toFixed(2);

    const handleAddToCart = () => {
        addToCart(product, {
            portion: selectedPortionId,
            portionLabel: selectedPortionObj?.portionName || "Standard",
            portionExtra: 0,
            addons: selectedAddons,
            cookingNote,
            quantity,
        });

        toast.success(`Added ${quantity} x "${product.title}" (${selectedPortionObj?.portionName || "Regular"}) to bag! 🛍️`);

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose();
        }, 500);
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
                            <Image src={product.image} alt={product.title} width={400} height={400} className="modal-product-img" />
                        </div>
                    </div>

                    <div className="modal-details-col">
                        <div className="modal-header-info">
                            <div className="modal-category-tag">{product.category?.title || product.categoryName || "Speciality"}</div>
                            <h2 className="modal-product-title">{product.title}</h2>
                            <p className="modal-product-desc">{product.description}</p>
                            <div className="modal-price-box">
                                <span className="modal-current-price">₹{unitPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="modal-options-scroll">
                            {portionOptions.length > 0 && (
                                <div className="modal-option-section">
                                    <h4 className="option-section-title">Select Portion</h4>
                                    <div className="portion-chips-group">
                                        {portionOptions.map((portion) => {
                                            const pid = portion._id || portion.portionName;
                                            return (
                                                <button
                                                    key={pid}
                                                    type="button"
                                                    className={`portion-chip-btn ${selectedPortionId === pid ? "active" : ""}`}
                                                    onClick={() => setSelectedPortionId(pid)}
                                                >
                                                    <span>{portion.portionName}</span>
                                                    <span className="chip-extra-tag">₹{portion.price.toFixed(2)}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {addonOptions.length > 0 && (
                                <div className="modal-option-section">
                                    <h4 className="option-section-title">Add-ons & Extras</h4>
                                    <div className="addons-list-group">
                                        {addonOptions.map((addon) => {
                                            const id = addon._id || addon.name;
                                            const isSelected = selectedAddons.some(a => (a._id || a.name) === id);
                                            return (
                                                <label
                                                    key={id}
                                                    className={`addon-item-label ${isSelected ? "selected" : ""}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleAddon(addon)}
                                                        className="addon-checkbox"
                                                    />
                                                    <span className="addon-name">{addon.name}</span>
                                                    <span className="addon-price">+₹{addon.price.toFixed(2)}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

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
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="qty-val">{quantity}</span>
                                <button
                                    type="button"
                                    className="qty-btn"
                                    onClick={() => setQuantity(quantity + 1)}
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
                                        <span>Add to Cart (₹{totalPrice})</span>
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