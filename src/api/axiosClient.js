// src/api/axiosClient.js
import axios from "axios";

/* ================= AXIOS CLIENT ================= */
const axiosClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    console.error("API error:", error.response);

    if (status === 401 && message?.includes("expired")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
