"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";

const FoodModal = ({ isOpen, onClose, foodToEdit, onSave, dbCategories = [] }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        image: "",

        portions: [{ portionName: "Half", price: "" }, { portionName: "Full", price: "" }],
        addOns: []
    });

    useEffect(() => {
        if (foodToEdit) {
            setFormData({
                ...foodToEdit,
                portions: foodToEdit.portions || [{ portionName: "Half", price: foodToEdit.halfPrice !== undefined ? foodToEdit.halfPrice : "" }, { portionName: "Full", price: foodToEdit.fullPrice !== undefined ? foodToEdit.fullPrice : "" }],
                addOns: foodToEdit.addOns || []
            });
        } else {
            setFormData({
                title: "", category: "", description: "", image: "",

                portions: [{ portionName: "Half", price: "" }, { portionName: "Full", price: "" }],
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

    const addAddOn = () => setFormData({ ...formData, addOns: [...formData.addOns, { name: "", price: "" }] });
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
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" placeholder="e.g. Paneer Tikka" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-input">
                            <option value="">Select a Category</option>
                            {dbCategories.map(c => <option key={c.slug} value={c._id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-input" rows="3"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" style={{ padding: '8px' }} />
                        {isUploading && <span style={{ fontSize: '12px', color: '#3b82f6' }}>Uploading to Cloudflare R2...</span>}
                        {formData.image && (
                            <div style={{ marginTop: '10px' }}>
                                <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <p style={{ fontSize: '11px', color: '#666', marginTop: '4px', wordBreak: 'break-all' }}>{formData.image}</p>
                            </div>
                        )}
                    </div>



                    <div className="form-section">
                        <h4>Portions & Pricing</h4>
                        {formData.portions.map((portion, idx) => (
                            <div key={idx} className="dynamic-row">
                                <input type="text" value={portion.portionName} onChange={(e) => handlePortionChange(idx, "portionName", e.target.value)} className="form-input small-input" placeholder="Portion (Half/Full/Quarter)" />
                                <input type="number" value={portion.price} onChange={(e) => handlePortionChange(idx, "price", e.target.value === "" ? "" : Number(e.target.value))} className="form-input small-input" placeholder="Price ₹" />
                                {idx > 0 && <button onClick={() => setFormData({ ...formData, portions: formData.portions.filter((_, i) => i !== idx) })} className="btn-icon danger"><FiTrash2 /></button>}
                            </div>
                        ))}
                        <button className="btn-secondary small" onClick={() => setFormData({ ...formData, portions: [...formData.portions, { portionName: "", price: "" }] })}><FiPlus /> Add Portion</button>
                    </div>

                    <div className="form-section">
                        <h4>Add-ons & Extras</h4>
                        {formData.addOns.map((addon, idx) => (
                            <div key={idx} className="dynamic-row">
                                <input type="text" value={addon.name} onChange={(e) => handleAddOnChange(idx, "name", e.target.value)} className="form-input" placeholder="Add-on Name (e.g. Extra Mayo)" />
                                <input type="number" value={addon.price} onChange={(e) => handleAddOnChange(idx, "price", e.target.value === "" ? "" : Number(e.target.value))} className="form-input small-input" placeholder="Price ₹" />
                                <button onClick={() => removeAddOn(idx)} className="btn-icon danger"><FiTrash2 /></button>
                            </div>
                        ))}
                        <button className="btn-secondary small" onClick={addAddOn}><FiPlus /> Add Add-on</button>
                    </div>

                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={() => {
                        if (!formData.title.trim()) return toast.error("Please enter a dish title");
                        if (!formData.image) return toast.error("Please upload an image first");
                        onSave(formData);
                        onClose();
                    }} className="btn-primary">Save Dish</button>
                </div>
            </div>

        </div>
    );
};
export default FoodModal;
