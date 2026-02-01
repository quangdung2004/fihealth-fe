import axios from "axios";

/* ================= AXIOS CLIENT ================= */
const axiosClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Không set Content-Type cho FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= REFRESH CLIENT ================= */
const refreshClient = axios.create({
  baseURL: "/api",
});

/* ================= RESPONSE INTERCEPTOR ================= */
axiosClient.interceptors.response.use(
  (response) => {
    // Tự lưu token nếu backend trả về
    if (
      response.data?.data?.accessToken &&
      response.data?.data?.refreshToken
    ) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    if (!originalConfig || originalConfig._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      try {
        originalConfig._retry = true;

        const result = await refreshClient.post("/auth/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        const { accessToken, refreshToken } = result.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        originalConfig.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalConfig);
      } catch (err) {
        // Refresh thất bại → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
