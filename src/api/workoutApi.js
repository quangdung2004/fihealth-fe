import axiosClient from "./axiosClient";

const workoutApi = {
    // Admin endpoints (giống Food admin)
    search: (params) => {
        return axiosClient.get("/workouts/search", { params });
    },

    adminGetById: (id) => {
        return axiosClient.get(`/admin/workouts/${id}`);
    },

    adminCreate: (data) => {
        return axiosClient.post("/admin/workouts", data);
    },

    adminUpdate: (id, data) => {
        return axiosClient.put(`/admin/workouts/${id}`, data);
    },

    adminDelete: (id) => {
        return axiosClient.delete(`/admin/workouts/${id}`);
    },
};

export default workoutApi;
