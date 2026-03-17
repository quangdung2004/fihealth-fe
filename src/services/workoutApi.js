// src/services/workoutApi.js
import axiosClient from "./axiosClient";

const ADMIN_WORKOUTS_API_URL = "/api/admin/workouts";

/**
 * Search workout catalog (ADMIN)
 * params: { q, page, size, active, level, type }
 */
const searchWorkouts = async (params) => {
    const response = await axiosClient.get(ADMIN_WORKOUTS_API_URL, {
        params,
    });
    return response.data.data; // Page<WorkoutCatalogResponse>
};

const getWorkoutById = async (id) => {
    const response = await axiosClient.get(`${ADMIN_WORKOUTS_API_URL}/${id}`);
    return response.data.data;
};

const createWorkout = async (data) => {
    const response = await axiosClient.post(ADMIN_WORKOUTS_API_URL, data);
    return response.data.data;
};

const updateWorkout = async (id, data) => {
    const response = await axiosClient.put(
        `${ADMIN_WORKOUTS_API_URL}/${id}`,
        data
    );
    return response.data.data;
};

const deleteWorkout = async (id) => {
    const response = await axiosClient.delete(
        `${ADMIN_WORKOUTS_API_URL}/${id}`
    );
    return response.data.data;
};

export default {
    searchWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
};
