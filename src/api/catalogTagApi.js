import axiosClient from "./axiosClient";

const catalogTagApi = {
  getAll: () => axiosClient.get("/admin/catalog-tags"),
};

export default catalogTagApi;
