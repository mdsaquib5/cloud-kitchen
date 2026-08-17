import React from "react";
import SectionTitle from "../layout/SectionTitle";
import CategoryCard from "../shared/CategoryCard";
import { CATEGORIES } from "@/constant/product";

const Categories = () => {
    return (
        <section>
            <div className="container">
                <SectionTitle
                    title="Top Categories"
                    description="Explore our carefully curated categories featuring fresh ingredients and signature flavors."
                />
                <div className="categories-grid">
                    {CATEGORIES.slice(0, 4).map((cat) => (
                        <CategoryCard key={cat.id} cat={cat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;