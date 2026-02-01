import axiosClient from "../api/axiosClient";

const ALLERGENS_API_URL = "/api/admin/allergens";

const getAllAllergens = async (params) => {
    const response = await axiosClient.get(ALLERGENS_API_URL, { params });
    return response.data.data;
};

const getAllergenById = async (id) => {
    const response = await axiosClient.get(`${ALLERGENS_API_URL}/${id}`);
    return response.data.data;
};

const createAllergen = async (data) => {
    const response = await axiosClient.post(ALLERGENS_API_URL, data);
    return response.data.data;
};

const updateAllergen = async (id, data) => {
    const response = await axiosClient.put(`${ALLERGENS_API_URL}/${id}`, data);
    return response.data.data;
};

const deleteAllergen = async (id) => {
    const response = await axiosClient.delete(`${ALLERGENS_API_URL}/${id}`);
    return response.data.data;
};

export default {
    getAllAllergens,
    getAllergenById,
    createAllergen,
    updateAllergen,
    deleteAllergen,
};
