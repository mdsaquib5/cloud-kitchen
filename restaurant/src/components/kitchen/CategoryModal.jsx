"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { FiX } from "react-icons/fi";

const CategoryModal = ({ isOpen, onClose, onSave, categoryToEdit }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({ title: "", image: "" });

    useEffect(() => {
        if (categoryToEdit) {
            setFormData({
                title: categoryToEdit.title || "",
                image: categoryToEdit.image || ""
            });
        } else if (!isOpen) {
            setFormData({ title: "", image: "" });
        }
    }, [isOpen, categoryToEdit]);

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

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{categoryToEdit ? "Edit Category" : "Add New Category"}</h3>
                    <button onClick={onClose} className="close-btn"><FiX size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Category Title</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="e.g. Fried Momos" />
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
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={() => { 
                        if(!formData.title.trim()) return toast.error("Please enter a title");
                        if(!formData.image) return toast.error("Please upload an image first");
                        onSave(formData); 
                        onClose(); 
                    }} className="btn-primary">Save</button>
                </div>
            </div>
            
        </div>
    );
};
export default CategoryModal;
