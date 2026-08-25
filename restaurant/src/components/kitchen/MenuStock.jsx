"use client";

import React, { useState } from "react";
import { FiSearch, FiCheckCircle, FiXCircle, FiFilter, FiAlertCircle, FiPower } from "react-icons/fi";
import { toast } from "sonner";
import { CATEGORIES, PRODUCTS } from "@/constant/product";
import FoodModal from "./FoodModal";
import CategoryModal from "./CategoryModal";
import api from "@/services/api";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const MenuStock = () => {
    const [productsList, setProductsList] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);

    React.useEffect(() => {
        fetchFoods();
        fetchCategories();
    }, []);

    const fetchFoods = async () => {
        try {
            const res = await api.get("/food");
            if (res.data.success) {
                setProductsList(res.data.foods);
            }
        } catch (error) {
            toast.error("Failed to load foods from database");
        }
    };

    const handleSaveCategory = async (catData) => {
        try {
            const res = await api.post("/category", catData);
            if (res.data.success) {
                setDbCategories([...dbCategories, res.data.category]);
                toast.success("Category added successfully");
            }
        } catch (error) {
            toast.error("Failed to add category");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/category");
            if (res.data.success) {
                setDbCategories(res.data.categories);
            }
        } catch (error) {
            toast.error("Failed to load categories");
        }
    };
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState("all");
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState(null);

    const handleEditFood = (food) => {
        setEditingFood(food);
        setIsFoodModalOpen(true);
    };

    const handleDeleteFood = async (foodId) => {
        if(confirm("Are you sure you want to delete this dish?")) {
            try {
                const res = await api.delete(`/food/${foodId}`);
                if (res.data.success) {
                    setProductsList(productsList.filter(f => f._id !== foodId));
                    toast.success("Dish deleted successfully");
                }
            } catch (error) {
                toast.error("Failed to delete dish");
            }
        }
    };

    const handleSaveFood = async (foodData) => {
        try {
            if(editingFood) {
                const res = await api.put(`/food/${editingFood._id}`, foodData);
                if (res.data.success) {
                    setProductsList(productsList.map(f => f._id === editingFood._id ? res.data.food : f));
                    toast.success("Dish updated successfully");
                }
            } else {
                const res = await api.post("/food", foodData);
                if (res.data.success) {
                    setProductsList([res.data.food, ...productsList]);
                    toast.success("New dish added successfully");
                }
            }
        } catch (error) {
            toast.error("Failed to save dish");
        }
    };

    const toggleItemStock = async (dish) => {
        try {
            const newStatus = !dish.inStock;
            const res = await api.put(`/food/${dish._id}`, { inStock: newStatus });
            if (res.data.success) {
                setProductsList(productsList.map(p => p._id === dish._id ? { ...p, inStock: newStatus } : p));
                if (newStatus) toast.success(`${dish.title} is now IN STOCK (Available)`);
                else toast.error(`${dish.title} 86'd (Marked OUT OF STOCK)`);
            }
        } catch (error) {
            toast.error("Failed to update stock status");
        }
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        onClick={() => setIsCategoryModalOpen(true)}
                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <FiPlus size={18} /> Add Category
                    </button>
                    <button 
                        onClick={() => { setEditingFood(null); setIsFoodModalOpen(true); }}
                        style={{ background: '#e11d48', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <FiPlus size={18} /> Add New Dish
                    </button>
                    <div className="stock-kpi-row" style={{margin: 0}}>
                </div>
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
                {dbCategories.map((cat) => {
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
                    <span className="col-action" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>86 Toggle</span>
                </div>

                <div className="stock-items-rows">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((dish) => (
                            <div
                                key={dish._id || dish.id}
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
                                    {dish.portions && dish.portions.length > 0 ? (
                                        <div className="price-stack">
                                            {dish.portions.map(p => (
                                                <span key={p._id || p.portionName}>{p.portionName}: ₹{p.price}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <strong className="single-price">No Portions Set</strong>
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

                                <div className="col-action" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <button type="button" onClick={() => handleEditFood(dish)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '5px' }} title="Edit"><FiEdit2 size={16} /></button>
         <button type="button" onClick={() => handleDeleteFood(dish._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }} title="Delete"><FiTrash2 size={16} /></button>
         <label className="switch-toggle" title="Toggle 86 Stock Status">
                                        <input
                                            type="checkbox"
                                            checked={dish.inStock}
                                            onChange={() => toggleItemStock(dish)}
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
            <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSave={handleSaveCategory} />
        <FoodModal isOpen={isFoodModalOpen} onClose={() => setIsFoodModalOpen(false)} foodToEdit={editingFood} onSave={handleSaveFood} dbCategories={dbCategories} />
        </div>
    );
};

export default MenuStock;
