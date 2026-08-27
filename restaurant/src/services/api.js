import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Send cookies with every request
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
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

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to silent refresh using the HttpOnly cookie
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.accessToken;

                // Update Zustand store
                useAuthStore.getState().setAccessToken(newAccessToken);

                // Update original request header and retry
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, session is completely invalid -> Logout
                useAuthStore.getState().clearAuth();
                window.location.href = "/login";
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
