import api from "./api";

export const googleAuth = (token) => api.post("/user/google", { token });
export const signup = (formData) => api.post("/user/signup", formData);
export const login = (credentials) => api.post("/user/login", credentials);
export const adminLogin = (credentials) => api.post("/user/admin-login", credentials);

const authService = {
    googleAuth,
    signup,
    login,
    adminLogin,
};

export default authService;
