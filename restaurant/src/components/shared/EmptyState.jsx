import Link from "next/link";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";

const EmptyState = ({
    title = "Your Cart is Empty",
    description = "Looks like you haven't added any authentic dishes yet.",
    buttonText = "Explore Gourmet Menu",
    buttonHref = "/foods",
    icon = <FiShoppingBag size={48} />,
}) => {
    return (
        <div className="empty-cart-state">
            <div className="empty-cart-icon-wrap">
                {icon}
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
            <Link href={buttonHref} className="explore-menu-btn">
                <span>{buttonText}</span>
                <FiArrowRight size={16} />
            </Link>
        </div>
    );
};

export default EmptyState;
