import api from "./api";

export const createPayment = (payload) => api.post("/payment/create", payload);
export const verifyPayment = (orderId) => api.post("/payment/verify", { orderId });

const paymentService = {
    createPayment,
    verifyPayment,
};

export default paymentService;
