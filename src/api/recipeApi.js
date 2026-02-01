import axiosClient from "./axiosClient";

const recipeApi = {
    getAll: (params) => {
        return axiosClient.get("/api/admin/recipes", { params });
    },

    getById: (id) => {
        return axiosClient.get(`/api/admin/recipes/${id}`);
    },

    create: (data) => {
        return axiosClient.post("/api/admin/recipes", data);
    },

    update: (id, data) => {
        return axiosClient.put(`/api/admin/recipes/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/api/admin/recipes/${id}`);
    },
};

export default recipeApi;
