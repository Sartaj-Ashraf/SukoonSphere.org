import customFetch from "@/utils/customFetch";

// POST "/register" - Register new user
// POST "/login" - User login
// DELETE "/logout" - User logout (requires authentication)
// POST "/verify-email" - Verify email
// POST "/change-password" - Change password (requires authentication)
// POST "/forget-password" - Forgot password request
// POST "/reset-password" - Reset password

const API_URL = '/auth';

export const authService = {
    // Authentication
    register: async (userData) => {
        const { data } = await customFetch.post(`${API_URL}/register`, userData);
        return data;
    },

    login: async (credentials) => {
        const { data } = await customFetch.post(`${API_URL}/login`, credentials);
        return data;
    },

    logout: async () => {
        const { data } = await customFetch.delete(`${API_URL}/logout`);
        return data;
    },

    // Email verification
    verifyEmail: async (verificationData) => {
        const { data } = await customFetch.post(`${API_URL}/verify-email`, verificationData);
        return data;
    },

    // Password management
    changePassword: async (passwordData) => {
        const { data } = await customFetch.post(`${API_URL}/change-password`, passwordData);
        return data;
    },

    forgotPassword: async (email) => {
        const { data } = await customFetch.post(`${API_URL}/forget-password`, { email });
        return data;
    },

    resetPassword: async (resetData) => {
        const { data } = await customFetch.post(`${API_URL}/reset-password`, resetData);
        return data;
    }
};
