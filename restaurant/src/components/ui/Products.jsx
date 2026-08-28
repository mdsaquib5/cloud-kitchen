"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import SectionTitle from "../layout/SectionTitle";
import ProCard from "../shared/ProCard";
import ProductModal from "../shared/ProductModal";

const Products = ({ initialCategories = [], initialProducts = [] }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

                

                <div className="products-grid">
                    {initialProducts.slice(0, 10).map((item, index) => (
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
