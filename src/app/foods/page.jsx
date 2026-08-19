"use client";

import React, { useState } from "react";
import { FiSearch, FiFilter, FiSliders } from "react-icons/fi";
import { FaLeaf, FaDrumstickBite } from "react-icons/fa";
import ProCard from "@/components/shared/ProCard";
import ProductModal from "@/components/shared/ProductModal";
import { CATEGORIES, PRODUCTS } from "@/constant/product";

const Foods = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [dietFilter, setDietFilter] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredList = PRODUCTS.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch = searchQuery === "" ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiet = dietFilter === "all" ||
            (dietFilter === "veg" && item.isVeg) ||
            (dietFilter === "non-veg" && !item.isVeg);

        return matchesCategory && matchesSearch && matchesDiet;
    }).sort((a, b) => {
        if (sortBy === "price-low") return (a.rawPrice || 0) - (b.rawPrice || 0);
        if (sortBy === "price-high") return (b.rawPrice || 0) - (a.rawPrice || 0);
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
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
        <div className="inner-wrapper foods-page-wrapper">
            <div className="container">
                <div className="foods-header-banner">
                    <h1 className="foods-page-title">Explore Our Full Menu</h1>
                    <p className="foods-page-subtitle">
                        Handcrafted gourmet delicacies, royal dum biryanis, sizzling tandoori starters & artisanal desserts.
                    </p>
                </div>

                <div className="foods-control-bar">
                    <div className="foods-search-box">
                        <FiSearch size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search dishes, biryani, pizza, desserts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="foods-search-input"
                        />
                    </div>

                    <div className="foods-filter-actions">
                        <div className="diet-toggle-group">
                            <button
                                type="button"
                                className={`diet-pill-btn ${dietFilter === "all" ? "active" : ""}`}
                                onClick={() => setDietFilter("all")}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className={`diet-pill-btn veg ${dietFilter === "veg" ? "active" : ""}`}
                                onClick={() => setDietFilter("veg")}
                            >
                                <FaLeaf size={12} />
                                <span>Veg</span>
                            </button>
                            <button
                                type="button"
                                className={`diet-pill-btn non-veg ${dietFilter === "non-veg" ? "active" : ""}`}
                                onClick={() => setDietFilter("non-veg")}
                            >
                                <FaDrumstickBite size={12} />
                                <span>Non-Veg</span>
                            </button>
                        </div>

                        <div className="sort-select-box">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="foods-sort-select"
                            >
                                <option value="default">Default Sorting</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="foods-category-pills-row">
                    <button
                        type="button"
                        className={`cat-pill-btn ${selectedCategory === "all" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("all")}
                    >
                        <span>All Categories</span>
                        <span className="pill-count">{PRODUCTS.length}</span>
                    </button>
                    {CATEGORIES.map((cat) => {
                        const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                className={`cat-pill-btn ${selectedCategory === cat.slug ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat.slug)}
                            >
                                <span>{cat.title}</span>
                                {count > 0 && <span className="pill-count">{count}</span>}
                            </button>
                        );
                    })}
                </div>

                <div className="foods-results-meta">
                    <span className="results-count-text">
                        Showing <strong>{filteredList.length}</strong> delicious dishes
                    </span>
                    {(selectedCategory !== "all" || searchQuery !== "" || dietFilter !== "all") && (
                        <button
                            type="button"
                            className="clear-filters-btn"
                            onClick={() => {
                                setSelectedCategory("all");
                                setSearchQuery("");
                                setDietFilter("all");
                                setSortBy("default");
                            }}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                {filteredList.length > 0 ? (
                    <div className="products-grid foods-grid">
                        {filteredList.map((prod) => (
                            <ProCard key={prod.id} prod={prod} onOpenModal={handleOpenModal} />
                        ))}
                    </div>
                ) : (
                    <div className="no-foods-found">
                        <h3>No dishes matched your criteria</h3>
                        <p>Try clearing your search query or selecting another food category.</p>
                        <button
                            type="button"
                            className="reset-search-btn"
                            onClick={() => {
                                setSelectedCategory("all");
                                setSearchQuery("");
                                setDietFilter("all");
                            }}
                        >
                            Show All Dishes
                        </button>
                    </div>
                )}
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default Foods;
