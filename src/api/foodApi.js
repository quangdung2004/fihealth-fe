import axiosClient from "./axiosClient";

const foodApi = {
    // Public endpoints
    search: (params) => {
        return axiosClient.get("/foods/search", { params });
    },

    getById: (id) => {
        return axiosClient.get(`/foods/${id}`);
    },

    // Admin endpoints
    adminCreate: (data) => {
        return axiosClient.post("/admin/foods", data);
    },

    adminUpdate: (id, data) => {
        return axiosClient.put(`/admin/foods/${id}`, data);
    },

    adminDelete: (id) => {
        return axiosClient.delete(`/admin/foods/${id}`);
    },

    adminGetById: (id) => {
        return axiosClient.get(`/admin/foods/${id}`);
    },
    adminImport: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/admin/foods/import", formData);
  },
  import: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosClient.post("/admin/foods/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Chú ý: Content-Type phải là multipart/form-data
      },
    });
  }
};


export default foodApi;
