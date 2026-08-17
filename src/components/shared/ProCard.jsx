import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";

const ProCard = ({ prod }) => {
    const { image, title, price, totalDiscount, discount, href } = prod;

    return (
        <div className="product-card">
            <Link href={href} className="cart-icon" aria-label={`Add ${title} to cart`}>
                <FiShoppingBag size={18} />
            </Link>

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
                <Link href={href} className="pd-cart-btn">
                    <FiShoppingBag size={15} />
                    <span>Add to cart</span>
                </Link>

                <div className="pricing">
                    <div className="discount-percent">{discount}</div>
                    <div className="price">{price}</div>
                    <div className="total-discount">{totalDiscount}</div>
                </div>

                <Link href={href} className="prod-title">{title}</Link>
            </div>
        </div>
    );
};

export default ProCard;