"use client";
import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { FiX } from "react-icons/fi";

const CategoryModal = ({ isOpen, onClose, onSave, categoryToEdit }) => {
    const [formData, setFormData] = useState({ title: "" });

    useEffect(() => {
        if (categoryToEdit) {
            setFormData({
                title: categoryToEdit.title || ""
            });
        } else if (!isOpen) {
            setFormData({ title: "" });
        }
    }, [isOpen, categoryToEdit]);

    if (!isOpen) return null;

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
                    </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={() => { 
                        if(!formData.title.trim()) return toast.error("Please enter a title");
                        onSave(formData); 
                        onClose(); 
                    }} className="btn-primary">Save</button>
                </div>
            </div>
            
        </div>
    );
};
export default CategoryModal;
