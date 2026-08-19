"use client";

import Image from "next/image";
import { FiShoppingBag } from "react-icons/fi";

const ProCard = ({ prod, onOpenModal }) => {
    const { image, title, price, totalDiscount, discount } = prod;

    const handleCardClick = (e) => {
        e.preventDefault();
        if (onOpenModal) {
            onOpenModal(prod);
        }
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <button
                type="button"
                className="cart-icon"
                onClick={handleCardClick}
                aria-label={`Add ${title} to cart`}
            >
                <FiShoppingBag size={18} />
            </button>

            <div className="product-item">
                <div className="prod-holder">
                    <Image
                        src={image}
                        width={280}
                        height={280}
                        alt={title}
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
                    <div className="discount-percent">{discount}</div>
                    <div className="price">{price}</div>
                    <div className="total-discount">{totalDiscount}</div>
                </div>

                <h3 className="prod-title">{title}</h3>
            </div>
        </div>
    );
};

export default ProCard;