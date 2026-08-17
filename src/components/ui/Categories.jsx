import React from "react";
import SectionTitle from "../layout/SectionTitle";
import CategoryCard from "../shared/CategoryCard";

const Categories = () => {
    const categories = [
        {
            id: 1,
            title: "Starters",
            description: "Light, flavorful beginnings to awaken your appetite.",
            image: "/cat-image.png",
            href: "/menu/starters",
            isActive: false,
        },
        {
            id: 2,
            title: "Vegetarian Specials",
            description: "Delicious plant-based recipes full of flavor and balance.",
            image: "/cat-image.png",
            href: "/menu/vegetarian",
            isActive: true,
        },
        {
            id: 3,
            title: "Seafood",
            description: "Fresh catch prepared with authentic coastal flavors.",
            image: "/cat-image.png",
            href: "/menu/seafood",
            isActive: false,
        },
        {
            id: 4,
            title: "Non Vegetarian Specials",
            description: "Succulent meat dishes cooked with signature spices.",
            image: "/cat-image.png",
            href: "/menu/non-veg",
            isActive: false,
        },
    ];

    return (
        <section>
            <div className="container">
                <SectionTitle
                    title="Top Categories"
                    description="Explore our carefully curated categories featuring fresh ingredients and signature flavors."
                />
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            title={cat.title}
                            description={cat.description}
                            image={cat.image}
                            href={cat.href}
                            isActive={cat.isActive}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;