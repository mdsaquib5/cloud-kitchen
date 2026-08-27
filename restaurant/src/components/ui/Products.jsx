"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiGrid, FiArrowRight } from "react-icons/fi";
import SectionTitle from "../layout/SectionTitle";
import ProCard from "../shared/ProCard";
import ProductModal from "../shared/ProductModal";

const Products = ({ initialCategories = [], initialProducts = [] }) => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredProducts = initialProducts.filter((item) => {
        if (activeFilter === "all") return true;
        return item.category?._id === activeFilter || item.category?.slug === activeFilter;
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
        <section id="popular-foods" className="product-bg">
            <div className="container">
                <SectionTitle
                    title="Popular Food Items"
                    description="Crispy, savory & signature delicacies prepared fresh on every order."
                />

                <div className="product-filter-tabs">
                    <button
                        type="button"
                        className={`filter-tab-btn ${activeFilter === "all" ? "active" : ""}`}
                        onClick={() => setActiveFilter("all")}
                    >
                        <span className="tab-icon"><FiGrid size={20} /></span>
                        <span className="tab-label">All Items</span>
                    </button>
                    {initialCategories.slice(0, 5).map((cat) => (
                        <button
                            key={cat._id}
                            type="button"
                            className={`filter-tab-btn ${activeFilter === cat._id ? "active" : ""}`}
                            onClick={() => setActiveFilter(cat._id)}
                        >
                            <span className="tab-label">{cat.title}</span>
                        </button>
                    ))}
                </div>

                <div className="products-grid">
                    {filteredProducts.slice(0, 10).map((item, index) => (
                        <ProCard key={item._id || index} item={item} onOpenModal={handleOpenModal} />
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
