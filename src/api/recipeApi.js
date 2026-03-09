import axiosClient from "./axiosClient";

const recipeApi = {
    // Admin endpoints
    getAll: (params) => {
        return axiosClient.get("/admin/recipes", { params });
    },

    getById: (id) => {
        return axiosClient.get(`/admin/recipes/${id}`);
    },

    create: (data) => {
        return axiosClient.post("/admin/recipes", data);
    },

    update: (id, data) => {
        return axiosClient.put(`/admin/recipes/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/admin/recipes/${id}`);
    },
    importExcel: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/admin/recipes/import", formData);
  },
};

export default recipeApi;
