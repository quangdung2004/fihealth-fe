import axiosClient from "../api/axiosClient";

const ADMIN_FOODS_API_URL = "/api/admin/foods";
const PUBLIC_FOODS_API_URL = "/api/foods";

const searchFoods = async (params) => {
    const response = await axiosClient.get(`${PUBLIC_FOODS_API_URL}/search`, { params });
    return response.data;
};

const getFoodById = async (id) => {
    const response = await axiosClient.get(`${PUBLIC_FOODS_API_URL}/${id}`);
    return response.data;
};

const createFood = async (data) => {
    const response = await axiosClient.post(ADMIN_FOODS_API_URL, data);
    return response.data;
};

const updateFood = async (id, data) => {
    const response = await axiosClient.put(`${ADMIN_FOODS_API_URL}/${id}`, data);
    return response.data;
};

const deleteFood = async (id) => {
    await axiosClient.delete(`${ADMIN_FOODS_API_URL}/${id}`);
};

export default {
    searchFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood,
};
