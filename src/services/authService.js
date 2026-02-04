import axiosClient from "../api/axiosClient";

const AUTH_API_URL = "/auth";

const login = async (data) => {
    const response = await axiosClient.post(`${AUTH_API_URL}/login`, data);
    return response.data;
};

const register = async (data) => {
    const response = await axiosClient.post(`${AUTH_API_URL}/register`, data);
    return response.data;
};

const verifyOtp = async (data) => {
    const response = await axiosClient.post(`${AUTH_API_URL}/verify-otp`, data);
    return response.data;
};

const forgotPassword = async (data) => {
    const response = await axiosClient.post(`${AUTH_API_URL}/forgot-password`, data);
    return response.data;
};

const resetPassword = async (data) => {
    const response = await axiosClient.post(`${AUTH_API_URL}/reset-password`, data);
    return response.data;
};

const refreshToken = async (data) => {
    const response = await axiosClient.post(`${AUTH_API_URL}/refresh-token`, data);
    return response.data;
};

const logout = async (data) => {
    const response = await axiosClient.post(`${AUTH_API_URL}/logout`, data);
    return response.data;
};

export default {
    login,
    register,
    verifyOtp,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout,
};
