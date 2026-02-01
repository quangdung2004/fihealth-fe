import axiosClient from "./axiosClient";

const allergenApi = {
    getAll: (params) => {
        return axiosClient.get("/api/admin/allergens", { params });
    },

    getById: (id) => {
        return axiosClient.get(`/api/admin/allergens/${id}`);
    },

    create: (data) => {
        return axiosClient.post("/api/admin/allergens", data);
    },

    update: (id, data) => {
        return axiosClient.put(`/api/admin/allergens/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/api/admin/allergens/${id}`);
    },
};

export default allergenApi;
