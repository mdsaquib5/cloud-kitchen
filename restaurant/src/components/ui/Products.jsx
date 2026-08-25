"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiGrid, FiArrowRight } from "react-icons/fi";
import { FaFire, FaHamburger } from "react-icons/fa";
import { FaBowlRice, FaBowlFood } from "react-icons/fa6";
import { GiDumpling } from "react-icons/gi";
import SectionTitle from "../layout/SectionTitle";
import ProCard from "../shared/ProCard";
import ProductModal from "../shared/ProductModal";
import { PRODUCTS } from "@/constant/product";

const Products = () => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterTabs = [
        { id: "all", label: "All Items", icon: <FiGrid size={20} /> },
        { id: "momos", label: "Momos", icon: <GiDumpling size={20} /> },
        { id: "chaap", label: "Chaap", icon: <FaFire size={20} /> },
        { id: "chowmein-pasta", label: "Chowmein & Pasta", icon: <FaBowlFood size={20} /> },
        { id: "burgers-sandwiches", label: "Burgers & Rolls", icon: <FaHamburger size={20} /> },
        { id: "combos", label: "Combos & Specials", icon: <FaBowlRice size={20} /> },
    ];

    const filteredProducts = PRODUCTS.filter((item) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "momos") {
            return (
                item.category === "fried-momos" ||
                item.category === "steam-momos" ||
                item.category === "creamy-momos" ||
                item.category === "gravy-momos" ||
                item.category === "kurkure-momos"
            );
        }
        if (activeFilter === "chaap") return item.category === "chaap";
        if (activeFilter === "chowmein-pasta") {
            return item.category === "chowmein" || item.category === "pasta" || item.category === "fried-rice" || item.category === "chilli-potato";
        }
        if (activeFilter === "burgers-sandwiches") {
            return item.category === "burgers-sandwiches" || item.category === "spring-rolls" || item.category === "french-fries";
        }
        if (activeFilter === "combos") {
            return item.category === "combos" || item.category === "special-items" || item.category === "samosa";
        }
        return item.category === activeFilter;
    });

    const handleOpenModal = (prod) => {
        setSelectedProduct(prod);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <section className="product-bg">
            <div className="container">
                <SectionTitle
                    title="Popular Food Items"
                    description="Crispy, savory & signature delicacies prepared fresh on every order."
                />

                <div className="product-filter-tabs">
                    {filterTabs.map((tab) => {
                        const isActive = activeFilter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className={`filter-tab-btn ${isActive ? "active" : ""}`}
                                onClick={() => setActiveFilter(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="products-grid">
                    {filteredProducts.slice(0, 10).map((item, index) => (
                        <ProCard key={index} item={item} onOpenModal={handleOpenModal} />
                    ))}
                </div>

                <div className="view-all-products-wrap">
                    <Link href="/foods" className="view-all-foods-btn">
                        <span>View All Foods</span>
                        <FiArrowRight size={18} />
                    </Link>
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </section>
    );
};

export default Products;