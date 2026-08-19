"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiGrid, FiArrowRight } from "react-icons/fi";
import { FaPepperHot, FaBreadSlice, FaIceCream } from "react-icons/fa";
import { FaBowlRice, FaBowlFood } from "react-icons/fa6";
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
        { id: "starters", label: "Starters", icon: <FaPepperHot size={20} /> },
        { id: "rice-bowls", label: "Rice & Bowls", icon: <FaBowlRice size={20} /> },
        { id: "breads", label: "Breads", icon: <FaBreadSlice size={20} /> },
        { id: "chinese", label: "Chinese", icon: <FaBowlFood size={20} /> },
        { id: "desserts", label: "Desserts", icon: <FaIceCream size={20} /> },
    ];

    const filteredProducts = PRODUCTS.filter((item) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "starters") return item.category === "starters" || item.category === "snacks";
        if (activeFilter === "rice-bowls") return item.category === "non-veg" || item.title.toLowerCase().includes("biryani") || item.title.toLowerCase().includes("rice");
        if (activeFilter === "breads") return item.category === "breads" || item.category === "breakfast" || item.title.toLowerCase().includes("bhature") || item.title.toLowerCase().includes("kulcha") || item.title.toLowerCase().includes("dosa");
        if (activeFilter === "chinese") return item.category === "chinese";
        if (activeFilter === "desserts") return item.category === "desserts";
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
                    {filteredProducts.map((prod) => (
                        <ProCard key={prod.id} prod={prod} onOpenModal={handleOpenModal} />
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