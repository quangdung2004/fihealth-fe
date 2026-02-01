import axiosClient from "./axiosClient";

const foodApi = {
    // Public endpoints
    search: (params) => {
        return axiosClient.get("/api/foods/search", { params });
    },

    getById: (id) => {
        return axiosClient.get(`/api/foods/${id}`);
    },

    // Admin endpoints
    adminCreate: (data) => {
        return axiosClient.post("/api/admin/foods", data);
    },

    adminUpdate: (id, data) => {
        return axiosClient.put(`/api/admin/foods/${id}`, data);
    },

    adminDelete: (id) => {
        return axiosClient.delete(`/api/admin/foods/${id}`);
    },
};

export default foodApi;
