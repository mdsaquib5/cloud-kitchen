import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const CategoryCard = ({ item }) => {
    return (
        <Link href={item.href || `/foods?category=${item.slug}`} className={`category-card ${item.isActive ? "active" : ""}`}>
            <div className="cat-card-img">
                <Image src={item.image || "/placeholder-category.jpg"} alt={item.title} width={300} height={200} className="cat-img" style={{ objectFit: "cover" }} />
            </div>
            <div className="cat-card-body">
                <div className="cat-card-title">{item.title}</div>
                <div className="cat-card-arrow">
                    <FiArrowRight size={18} />
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;