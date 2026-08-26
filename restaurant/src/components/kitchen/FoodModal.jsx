"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { CATEGORIES } from "@/constant/product";

const FoodModal = ({ isOpen, onClose, foodToEdit, onSave, dbCategories = [] }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: dbCategories[0]?._id || "",
        description: "",
        image: "",
        isVeg: true,
        isFeatured: false,
        isPopular: false,
        allowInstructions: true,
        portions: [{ portionName: "Half", price: 0 }, { portionName: "Full", price: 0 }],
        addOns: []
    });

    useEffect(() => {
        if (foodToEdit) {
            setFormData({
                ...foodToEdit,
                portions: foodToEdit.portions || [{ portionName: "Half", price: foodToEdit.halfPrice || 0 }, { portionName: "Full", price: foodToEdit.fullPrice || 0 }],
                addOns: foodToEdit.addOns || []
            });
        } else {
            setFormData({
                title: "", category: dbCategories[0]?._id || "", description: "", image: "",
                isVeg: true, isFeatured: false, isPopular: false, allowInstructions: true,
                portions: [{ portionName: "Half", price: 0 }, { portionName: "Full", price: 0 }],
                addOns: []
            });
        }
    }, [foodToEdit, isOpen]);

    if (!isOpen) return null;

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("image", file);

        setIsUploading(true);
        try {
            const res = await api.post("/upload", uploadData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                setFormData({ ...formData, image: res.data.imageUrl });
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };
    

    const handlePortionChange = (index, field, value) => {
        const newPortions = [...formData.portions];
        newPortions[index][field] = value;
        setFormData({ ...formData, portions: newPortions });
    };

    const handleAddOnChange = (index, field, value) => {
        const newAddOns = [...formData.addOns];
        newAddOns[index][field] = value;
        setFormData({ ...formData, addOns: newAddOns });
    };

    const addAddOn = () => setFormData({ ...formData, addOns: [...formData.addOns, { name: "", price: 0 }] });
    const removeAddOn = (index) => {
        const newAddOns = formData.addOns.filter((_, i) => i !== index);
        setFormData({ ...formData, addOns: newAddOns });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large-modal">
                <div className="modal-header">
                    <h3>{foodToEdit ? "Edit Dish" : "Add New Dish"}</h3>
                    <button onClick={onClose} className="close-btn"><FiX size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Dish Title</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="e.g. Paneer Tikka" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="form-input">
                            {dbCategories.map(c => <option key={c.slug} value={c._id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="form-input" rows="3"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="form-input" placeholder="/choose1.png or https://..." />
                    </div>
                    
                    <div className="checkbox-group-row">
                        <label><input type="checkbox" checked={formData.isVeg} onChange={(e) => setFormData({...formData, isVeg: e.target.checked})} /> Veg</label>
                        <label><input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({...formData, isPopular: e.target.checked})} /> Popular</label>
                        <label><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} /> Featured</label>
                        <label><input type="checkbox" checked={formData.allowInstructions} onChange={(e) => setFormData({...formData, allowInstructions: e.target.checked})} /> Allow Cooking Instructions</label>
                    </div>

                    <div className="form-section">
                        <h4>Portions & Pricing</h4>
                        {formData.portions.map((portion, idx) => (
                            <div key={idx} className="dynamic-row">
                                <input type="text" value={portion.portionName} onChange={(e) => handlePortionChange(idx, "portionName", e.target.value)} className="form-input small-input" placeholder="Portion (Half/Full/Quarter)" />
                                <input type="number" value={portion.price} onChange={(e) => handlePortionChange(idx, "price", Number(e.target.value))} className="form-input small-input" placeholder="Price ₹" />
                                {idx > 0 && <button onClick={() => setFormData({...formData, portions: formData.portions.filter((_, i) => i !== idx)})} className="btn-icon danger"><FiTrash2 /></button>}
                            </div>
                        ))}
                        <button className="btn-secondary small" onClick={() => setFormData({...formData, portions: [...formData.portions, { portionName: "", price: 0 }]})}><FiPlus /> Add Portion</button>
                    </div>

                    <div className="form-section">
                        <h4>Add-ons & Extras</h4>
                        {formData.addOns.map((addon, idx) => (
                            <div key={idx} className="dynamic-row">
                                <input type="text" value={addon.name} onChange={(e) => handleAddOnChange(idx, "name", e.target.value)} className="form-input" placeholder="Add-on Name (e.g. Extra Mayo)" />
                                <input type="number" value={addon.price} onChange={(e) => handleAddOnChange(idx, "price", Number(e.target.value))} className="form-input small-input" placeholder="Price ₹" />
                                <button onClick={() => removeAddOn(idx)} className="btn-icon danger"><FiTrash2 /></button>
                            </div>
                        ))}
                        <button className="btn-secondary small" onClick={addAddOn}><FiPlus /> Add Add-on</button>
                    </div>

                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={() => { onSave(formData); onClose(); }} className="btn-primary">Save Dish</button>
                </div>
            </div>
            
        </div>
    );
};
export default FoodModal;
