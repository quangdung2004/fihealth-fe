import axiosClient from "../api/axiosClient";

const RECIPES_API_URL = "/api/admin/recipes";

const getAllRecipes = async (params) => {
    const response = await axiosClient.get(RECIPES_API_URL, { params });
    return response.data;
};

const getRecipeById = async (id) => {
    const response = await axiosClient.get(`${RECIPES_API_URL}/${id}`);
    return response.data;
};

const createRecipe = async (data) => {
    const response = await axiosClient.post(RECIPES_API_URL, data);
    return response.data;
};

const updateRecipe = async (id, data) => {
    const response = await axiosClient.put(`${RECIPES_API_URL}/${id}`, data);
    return response.data;
};

const deleteRecipe = async (id) => {
    await axiosClient.delete(`${RECIPES_API_URL}/${id}`);
};

export default {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
};
