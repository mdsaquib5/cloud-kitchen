"use client";

import React, { useState } from "react";
import { FiSearch, FiCheckCircle, FiXCircle, FiFilter, FiAlertCircle, FiPower } from "react-icons/fi";
import { toast } from "sonner";
import { CATEGORIES, PRODUCTS } from "@/constant/product";

const MenuStock = () => {
    const [productsList, setProductsList] = useState(
        PRODUCTS.map((prod) => ({
            ...prod,
            inStock: true,
        }))
    );
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState("all");

    const toggleItemStock = (productId) => {
        setProductsList((prev) =>
            prev.map((item) => {
                if (item.id === productId) {
                    const newStatus = !item.inStock;
                    if (newStatus) {
                        toast.success(`${item.title} is now IN STOCK (Available)`);
                    } else {
                        toast.error(`${item.title} 86'd (Marked OUT OF STOCK)`);
                    }
                    return { ...item, inStock: newStatus };
                }
                return item;
            })
        );
    };

    const toggleCategoryStock = (categorySlug, makeAvailable) => {
        setProductsList((prev) =>
            prev.map((item) => {
                if (item.category === categorySlug) {
                    return { ...item, inStock: makeAvailable };
                }
                return item;
            })
        );
        const catName = CATEGORIES.find((c) => c.slug === categorySlug)?.title || categorySlug;
        if (makeAvailable) {
            toast.success(`All items in "${catName}" are now IN STOCK`);
        } else {
            toast.error(`All items in "${catName}" marked OUT OF STOCK`);
        }
    };

    const filteredItems = productsList.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch =
            searchQuery === "" ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock =
            stockFilter === "all" ||
            (stockFilter === "in-stock" && item.inStock) ||
            (stockFilter === "out-stock" && !item.inStock);

        return matchesCategory && matchesSearch && matchesStock;
    });

    const totalInStock = productsList.filter((p) => p.inStock).length;
    const totalOutOfStock = productsList.filter((p) => !p.inStock).length;

    return (
        <div className="stock-screen">
            <div className="stock-top-header">
                <div className="stock-title-wrap">
                    <h2>Menu &amp; 86 Stock Control</h2>
                    <p>Real-time item availability management for storefront ordering.</p>
                </div>

                <div className="stock-kpi-row">
                    <div className="stock-kpi in-stock">
                        <FiCheckCircle size={18} />
                        <div className="kpi-info">
                            <span className="kpi-val">{totalInStock}</span>
                            <span className="kpi-lbl">Active Dishes</span>
                        </div>
                    </div>
                    <div className="stock-kpi out-stock">
                        <FiXCircle size={18} />
                        <div className="kpi-info">
                            <span className="kpi-val">{totalOutOfStock}</span>
                            <span className="kpi-lbl">86&apos;d (Out of Stock)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stock-controls-bar">
                <div className="stock-search-field">
                    <FiSearch className="search-ico" size={16} />
                    <input
                        type="text"
                        placeholder="Search dishes to toggle stock (e.g. Kurkure Momos, Chaap)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="stock-input"
                    />
                </div>

                <div className="stock-filters-cluster">
                    <div className="stock-toggle-group">
                        <button
                            type="button"
                            className={`stock-filter-btn ${stockFilter === "all" ? "active" : ""}`}
                            onClick={() => setStockFilter("all")}
                        >
                            All ({productsList.length})
                        </button>
                        <button
                            type="button"
                            className={`stock-filter-btn in ${stockFilter === "in-stock" ? "active" : ""}`}
                            onClick={() => setStockFilter("in-stock")}
                        >
                            In Stock ({totalInStock})
                        </button>
                        <button
                            type="button"
                            className={`stock-filter-btn out ${stockFilter === "out-stock" ? "active" : ""}`}
                            onClick={() => setStockFilter("out-stock")}
                        >
                            86&apos;d ({totalOutOfStock})
                        </button>
                    </div>
                </div>
            </div>

            <div className="stock-cat-pills-row">
                <button
                    type="button"
                    className={`cat-tab-pill ${selectedCategory === "all" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                >
                    <span>All Categories</span>
                    <span className="pill-badge">{productsList.length}</span>
                </button>
                {CATEGORIES.map((cat) => {
                    const catCount = productsList.filter((p) => p.category === cat.slug).length;
                    const catOutCount = productsList.filter((p) => p.category === cat.slug && !p.inStock).length;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            className={`cat-tab-pill ${selectedCategory === cat.slug ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat.slug)}
                        >
                            <span>{cat.title}</span>
                            <span className={`pill-badge ${catOutCount > 0 ? "has-out" : ""}`}>
                                {catCount}
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedCategory !== "all" && (
                <div className="cat-bulk-action-bar">
                    <span>Quick Category Action for <strong>{CATEGORIES.find((c) => c.slug === selectedCategory)?.title}</strong>:</span>
                    <div className="bulk-btns">
                        <button
                            type="button"
                            className="bulk-btn in"
                            onClick={() => toggleCategoryStock(selectedCategory, true)}
                        >
                            <FiCheckCircle size={14} />
                            <span>Mark All In Stock</span>
                        </button>
                        <button
                            type="button"
                            className="bulk-btn out"
                            onClick={() => toggleCategoryStock(selectedCategory, false)}
                        >
                            <FiXCircle size={14} />
                            <span>86 All Category Dishes</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="stock-table-card">
                <div className="stock-table-header">
                    <span className="col-dish">Dish Name &amp; Description</span>
                    <span className="col-category">Category</span>
                    <span className="col-price">Pricing (Half / Full)</span>
                    <span className="col-status">Live Status</span>
                    <span className="col-action">86 Toggle</span>
                </div>

                <div className="stock-items-rows">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((dish) => (
                            <div
                                key={dish.id}
                                className={`stock-item-row ${dish.inStock ? "in-stock" : "out-of-stock"}`}
                            >
                                <div className="col-dish item-info-col">
                                    <span className="dish-title">{dish.title}</span>
                                    <span className="dish-desc">{dish.description}</span>
                                </div>

                                <div className="col-category">
                                    <span className="cat-chip">{dish.categoryName || dish.category}</span>
                                </div>

                                <div className="col-price">
                                    {dish.fullPrice && dish.fullPrice > dish.halfPrice ? (
                                        <div className="price-stack">
                                            <span>Half: ₹{dish.halfPrice}</span>
                                            <strong>Full: ₹{dish.fullPrice}</strong>
                                        </div>
                                    ) : (
                                        <strong className="single-price">₹{dish.rawPrice}</strong>
                                    )}
                                </div>

                                <div className="col-status">
                                    {dish.inStock ? (
                                        <span className="status-badge active">
                                            <span className="dot"></span>
                                            <span>Available</span>
                                        </span>
                                    ) : (
                                        <span className="status-badge inactive">
                                            <FiAlertCircle size={12} />
                                            <span>86&apos;d (Out of Stock)</span>
                                        </span>
                                    )}
                                </div>

                                <div className="col-action">
                                    <label className="switch-toggle" title="Toggle 86 Stock Status">
                                        <input
                                            type="checkbox"
                                            checked={dish.inStock}
                                            onChange={() => toggleItemStock(dish.id)}
                                        />
                                        <span className="slider-round"></span>
                                    </label>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="stock-empty-state">
                            <FiAlertCircle size={24} />
                            <span>No dishes matched your filter or search criteria.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuStock;
