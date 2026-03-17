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

    myCurrent: () => {
        return axiosClient.get("/workouts/my-current");
    },

    myHistory: (params) => {
        return axiosClient.get("/workouts/my-history", { params });
    },

    getDetail: (id) => {
        return axiosClient.get(`/workouts/${id}`);
    },

    toggleItemCompletion: (itemId) => {
        return axiosClient.put(`/workouts/items/${itemId}/toggle-complete`);
    }
};

export default workoutApi;
