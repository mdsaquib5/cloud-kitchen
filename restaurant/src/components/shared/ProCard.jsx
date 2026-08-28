"use client";

import Image from "next/image";
import { FiShoppingBag } from "react-icons/fi";

const ProCard = ({ item, prod, onOpenModal }) => {
    const product = item || prod;
    if (!product) return null;

    const handleCardClick = (e) => {
        e.preventDefault();
        if (onOpenModal) {
            onOpenModal(product);
        }
    };

    // Calculate price display
    const priceText = product.portions && product.portions.length > 0
        ? `₹${product.portions[0].price}`
        : "₹50"; // default

    return (
        <div className="product-card" onClick={handleCardClick}>
            <button
                type="button"
                className="cart-icon"
                onClick={handleCardClick}
                aria-label={`Add ${product.title} to cart`}
            >
                <FiShoppingBag size={18} />
            </button>

            <div className="product-item">
                {product.category && (
                    <span className="prod-cat-badge">
                        {typeof product.category === 'object' ? (product.category.title || product.category.name) : product.category}
                    </span>
                )}
                <div className="prod-holder" style={{ position: 'relative' }}>
                    {/* Using standard img for external URLs to avoid config issues */}
                    <Image src={product.image} alt={product.title} width={280} height={280} className="prod-img" sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" loading="lazy" style={{ borderRadius: "10px", objectFit: "cover" }} />
                </div>
            </div>

            <div className="product-body">
                <button
                    type="button"
                    className="pd-cart-btn"
                    onClick={handleCardClick}
                >
                    <FiShoppingBag size={15} />
                    <span>Add to cart</span>
                </button>

                <div className="pricing">
                    <div className="price">{priceText}</div>
                </div>

                <h3 className="prod-title">{product.title}</h3>
            </div>
        </div>
    );
};

export default ProCard;
