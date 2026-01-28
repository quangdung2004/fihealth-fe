import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082",
  timeout: 10000,
});

export default axiosClient;
