import axiosClient from "../api/axiosClient";

const ADMIN_FOODS_API_URL = "/api/admin/foods";
const PUBLIC_FOODS_API_URL = "/api/foods";
const ADMIN_TAGS_API_URL = "/api/admin/catalog-tags";

const searchFoods = async (params) => {
  const response = await axiosClient.get(`${PUBLIC_FOODS_API_URL}/search`, { params });
  return response.data.data;
};

const getFoodById = async (id) => {
  const response = await axiosClient.get(`${PUBLIC_FOODS_API_URL}/${id}`);
  return response.data.data;
};

const createFood = async (data) => {
  const response = await axiosClient.post(ADMIN_FOODS_API_URL, data);
  return response.data.data;
};

const updateFood = async (id, data) => {
  const response = await axiosClient.put(`${ADMIN_FOODS_API_URL}/${id}`, data);
  return response.data.data;
};

const deleteFood = async (id) => {
  const response = await axiosClient.delete(`${ADMIN_FOODS_API_URL}/${id}`);
  return response.data.data;
};

const importFoods = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosClient.post(`${ADMIN_FOODS_API_URL}/import`, formData);
  return response.data.data;
};

const getCatalogTags = async () => {
  const response = await axiosClient.get(ADMIN_TAGS_API_URL);
  return response.data.data;
};

export default {
  searchFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  importFoods,
  getCatalogTags,
};
