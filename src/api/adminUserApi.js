import axiosClient from "./axiosClient";

export const adminUserApi = {
  getUsers: (page = 0, size = 10) =>
    axiosClient.get("/admin/users", {
      params: { page, size },
    }),

  banUser: (userId, reason) =>
    axiosClient.post(`/admin/users/${userId}/ban`, {
      reason,
    }),

  unbanUser: (userId) =>
    axiosClient.post(`/admin/users/${userId}/unban`),
};
