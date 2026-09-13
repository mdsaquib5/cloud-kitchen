import axios from "axios";
import { useAuthStore, useKitchenAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Send cookies with every request
});

// Helper to identify kitchen/admin endpoints
const isKitchenRequestUrl = (url = "") => {
    return (
        url.includes("/orders/admin") ||
        url.includes("/settings") ||
        url.includes("/menu") ||
        url.includes("/food") ||
        url.includes("/categories") ||
        url.includes("/upload") ||
        url.includes("/user/admin-login")
    );
};

// Request Interceptor: Attach Access Token (Kitchen vs Customer)
api.interceptors.request.use(
    (config) => {
        const url = config.url || "";
        const isKitchen = isKitchenRequestUrl(url) || (typeof window !== "undefined" && window.location.pathname.startsWith("/kitchen"));

        const kitchenToken = useKitchenAuthStore.getState().kitchenToken;
        const customerToken = useAuthStore.getState().accessToken;

        if (isKitchen && kitchenToken) {
            config.headers.Authorization = `Bearer ${kitchenToken}`;
        } else if (customerToken) {
            config.headers.Authorization = `Bearer ${customerToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Silent Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";
        const isKitchen = isKitchenRequestUrl(url) || (typeof window !== "undefined" && window.location.pathname.startsWith("/kitchen"));

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isKitchen) {
                // Clear Kitchen Manager auth only without touching customer session
                useKitchenAuthStore.getState().clearKitchenAuth();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Try to silent refresh using the HttpOnly cookie for customer
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken;

                // Update Customer Zustand store
                useAuthStore.getState().setAccessToken(newAccessToken);

                // Update original request header and retry
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, session is completely invalid -> Logout Customer
                useAuthStore.getState().clearAuth();
                if (typeof window !== "undefined" && !window.location.pathname.startsWith("/kitchen")) {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        // Global API Error Handler (Industry Standard)
        if (error.response && error.response.status !== 401) {
            // Check if this request is explicitly ignoring global errors (e.g., config.hideErrorToast)
            if (!originalRequest.hideErrorToast) {
                const errorMsg = error.response.data?.message || "Something went wrong. Please try again.";
                toast.error(errorMsg);
            }
        } else if (!error.response) {
            // Network error
            if (!originalRequest.hideErrorToast) {
                toast.error("Network error. Please check your connection.");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
