"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { FiX } from "react-icons/fi";

const CategoryModal = ({ isOpen, onClose, onSave }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", image: "" });

    useEffect(() => {
        if (!isOpen) setFormData({ title: "", description: "", image: "" });
    }, [isOpen]);

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
                    <h3>Add New Category</h3>
                    <button onClick={onClose} className="close-btn"><FiX size={20} /></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Category Title</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-input" placeholder="e.g. Fried Momos" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="form-input" rows="3"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="form-input" placeholder="/choose1.png" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={() => { onSave(formData); onClose(); }} className="btn-primary">Save</button>
                </div>
            </div>
            
        </div>
    );
};
export default CategoryModal;
