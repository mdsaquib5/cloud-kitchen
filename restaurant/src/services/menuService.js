import api from "./api";

// Food Endpoints
export const getFoods = () => api.get("/food");
export const createFood = (data) => api.post("/food", data);
export const updateFood = (id, data) => api.put(`/food/${id}`, data);
export const deleteFood = (id) => api.delete(`/food/${id}`);
export const updateFoodStock = (id, inStock) => api.put(`/food/${id}`, { inStock });

// Category Endpoints
export const getCategories = () => api.get("/category");
export const createCategory = (data) => api.post("/category", data);
export const updateCategory = (id, data) => api.put(`/category/${id}`, data);
export const deleteCategory = (id) => api.delete(`/category/${id}`);

// Upload Endpoint
export const uploadImage = (formData) =>
    api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

const menuService = {
    getFoods,
    createFood,
    updateFood,
    deleteFood,
    updateFoodStock,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
};

export default menuService;
