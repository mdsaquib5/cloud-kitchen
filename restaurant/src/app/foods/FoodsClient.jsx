"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import ProCard from "@/components/shared/ProCard";
import ProductModal from "@/components/shared/ProductModal";

const FoodsClient = ({ initialCategories = [], initialProducts = [] }) => {
    const searchParams = useSearchParams();
    const categoryParam = searchParams?.get("category");

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    const filteredList = initialProducts.filter((item) => {
        const itemCatSlug = item.category?.slug;
        const matchesCategory = selectedCategory === "all" || itemCatSlug === selectedCategory || item.category?._id === selectedCategory;

        const matchesSearch =
            searchQuery === "" ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.title?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        const aPrice = a.portions && a.portions.length > 0 ? a.portions[0].price : 0;
        const bPrice = b.portions && b.portions.length > 0 ? b.portions[0].price : 0;

        if (sortBy === "price-low") return aPrice - bPrice;
        if (sortBy === "price-high") return bPrice - aPrice;
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
                        Fresh, tasty & made with love — Hot Momos, Sizzling Chaap, Chowmein, Rolls, Burgers & Special Combos.
                    </p>
                </div>

                <div className="foods-control-bar">
                    <div className="foods-search-box">
                        <FiSearch size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="foods-search-input"
                        />
                    </div>

                    <div className="foods-filter-actions">
                        <div className="sort-select-box">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="foods-sort-select"
                            >
                                <option value="default">Default Sorting</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
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
                        <span>All Items</span>
                        <span className="pill-count">{initialProducts.length}</span>
                    </button>
                    {initialCategories.map((cat) => {
                        const count = initialProducts.filter((p) => p.category?._id === cat._id).length;
                        return (
                            <button
                                key={cat._id}
                                type="button"
                                className={`cat-pill-btn ${(selectedCategory === cat.slug || selectedCategory === cat._id) ? "active" : ""}`}
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
                        Showing <strong>{filteredList.length}</strong> fresh dishes
                    </span>
                    {(selectedCategory !== "all" || searchQuery !== "") && (
                        <button
                            type="button"
                            className="clear-filters-btn"
                            onClick={() => {
                                setSelectedCategory("all");
                                setSearchQuery("");
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
                            <ProCard key={prod._id} prod={prod} onOpenModal={handleOpenModal} />
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

export default FoodsClient;
