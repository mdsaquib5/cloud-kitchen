import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const CategoryCard = ({ image, title, description, href = "/menu", isActive = false }) => {
    return (
        <Link href={href} className={`category-card ${isActive ? "active" : ""}`}>
            <div className="cat-card-img">
                <Image src={image || "/cat-image.png"} alt={title} width={180} height={180} />
            </div>
            <div className="cat-card-body">
                <div className="cat-card-title">{title}</div>
                <p className="cat-card-desc">{description}</p>
                <div className="cat-card-arrow">
                    <FiArrowRight size={18} />
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;