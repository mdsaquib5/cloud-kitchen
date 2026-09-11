import api from "./api";

// Admin / Kitchen
export const getAllOrders = () => api.get("/orders/admin/all");
export const updateOrderStatus = (orderId, status) => api.put(`/orders/admin/status/${orderId}`, { status });
export const getOrderQuotes = (orderId) => api.get(`/orders/admin/quotes/${orderId}`);
export const dispatchOrder = (orderId, payload) => api.post(`/orders/admin/dispatch/${orderId}`, payload);
export const cancelOrderRider = (orderId, payload = {}) => api.post(`/orders/admin/cancel/${orderId}`, payload);

// Customer
export const getUserOrders = () => api.get("/orders/user");
export const createOrder = (orderData) => api.post("/orders", orderData);
export const trackOrder = (orderId) => api.get(`/orders/track/${orderId}`, { hideErrorToast: true });
export const getLiveTracking = (orderId) => api.get(`/orders/track/${orderId}/live-location`, { hideErrorToast: true });

const orderService = {
    getAllOrders,
    updateOrderStatus,
    getOrderQuotes,
    dispatchOrder,
    cancelOrderRider,
    getUserOrders,
    createOrder,
    trackOrder,
    getLiveTracking,
};

export default orderService;
