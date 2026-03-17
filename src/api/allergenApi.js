import axiosClient from "./axiosClient";

const allergenApi = {
  adminGetAll: (params) => {
    return axiosClient.get("/admin/allergens", { params });
  },

  adminGetById: (id) => {
    return axiosClient.get(`/admin/allergens/${id}`);
  },

  adminCreate: (data) => {
    return axiosClient.post("/admin/allergens", data);
  },

  adminUpdate: (id, data) => {
    return axiosClient.put(`/admin/allergens/${id}`, data);
  },

  adminDelete: (id) => {
    return axiosClient.delete(`/admin/allergens/${id}`);
  },
};

export default allergenApi;
