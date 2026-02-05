import axiosClient from "./axiosClient";

export const adminNotificationApi = {
  getAll: () => axiosClient.get("/admin/notifications"),

  create: (data) =>
    axiosClient.post("/admin/notifications", data),

  update: (id, data) =>
    axiosClient.put(`/admin/notifications/${id}`, data),

  delete: (id) =>
    axiosClient.delete(`/admin/notifications/${id}`),
};
