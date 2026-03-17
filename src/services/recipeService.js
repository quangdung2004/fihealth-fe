import axiosClient from "../api/axiosClient";

const RECIPES_API_URL = "/api/admin/recipes";
const TAGS_API_URL = "/api/admin/catalog-tags";

const getAllRecipes = async (params) => {
  const response = await axiosClient.get(RECIPES_API_URL, { params });
  return response.data.data;
};

const getRecipeById = async (id) => {
  const response = await axiosClient.get(`${RECIPES_API_URL}/${id}`);
  return response.data.data;
};

const createRecipe = async (data) => {
  const response = await axiosClient.post(RECIPES_API_URL, data);
  return response.data.data;
};

const updateRecipe = async (id, data) => {
  const response = await axiosClient.put(`${RECIPES_API_URL}/${id}`, data);
  return response.data.data;
};

const deleteRecipe = async (id) => {
  const response = await axiosClient.delete(`${RECIPES_API_URL}/${id}`);
  return response.data.data;
};

const importRecipes = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosClient.post(`${RECIPES_API_URL}/import`, formData);
  return response.data.data;
};

const getCatalogTags = async () => {
  const response = await axiosClient.get(TAGS_API_URL);
  return response.data.data;
};

export default {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  importRecipes,
  getCatalogTags,
};
