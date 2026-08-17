import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const CategoryCard = ({ cat = {}, image, title, description, href, isActive }) => {
    const cardTitle = cat.title || title || "Category";
    const cardImg = cat.image || image || "/cat-image.png";
    const cardDesc = cat.description || description || "";
    const cardHref = cat.href || href || "/menu";
    const cardActive = cat.isActive || isActive || false;

    return (
        <Link href={cardHref} className={`category-card ${cardActive ? "active" : ""}`}>
            <div className="cat-card-img">
                <Image src={cardImg} alt={cardTitle} width={180} height={180} />
            </div>
            <div className="cat-card-body">
                <div className="cat-card-title">{cardTitle}</div>
                <p className="cat-card-desc">{cardDesc}</p>
                <div className="cat-card-arrow">
                    <FiArrowRight size={18} />
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;