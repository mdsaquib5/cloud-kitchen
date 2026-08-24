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
                <div className="prod-holder">
                    <Image
                        src={product.image}
                        width={280}
                        height={280}
                        alt={product.title}
                        className="prod-img"
                    />
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
                    <div className="discount-percent">{product.discount}</div>
                    <div className="price">₹{product.price}</div>
                </div>

                <h3 className="prod-title">{product.title}</h3>
            </div>
        </div>
    );
};

export default ProCard;