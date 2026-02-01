import axiosClient from "./axiosClient";

const allergenApi = {
  getAll: (params) => {
    return axiosClient.get("/admin/allergens", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/admin/allergens/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/admin/allergens", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/admin/allergens/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/admin/allergens/${id}`);
  },
};

export default allergenApi;
