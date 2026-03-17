import axiosClient from "./axiosClient";

/**
 * Meal Plan API Module
 * IMPORTANT: Validate và parse ApiResponse<T> theo backend spec
 * ApiResponse = { success: boolean; message: string; timestamp: string; data: T }
 */

const mealPlanApi = {
    /**
     * Generate meal plan from assessment
     * POST /api/meal-plans/generate?assessmentId={UUID}&period={DAY|WEEK|MONTH}
     * @param {string} assessmentId - UUID of assessment
     * @param {string} period - DAY | WEEK | MONTH
     * @returns {Promise<MealPlanGenerateResponse>}
     * @throws {Error} if response.data.success === false or network error
     */
    generateMealPlan: async (assessmentId, period) => {
        const res = await axiosClient.post("/meal-plans/generate", null, {
            params: { assessmentId, period },
            // ⏰ Increase timeout to 90s for AI processing (default is 10s)
            // This only affects this specific request, not the global axiosClient
            timeout: 90000, // 90 seconds
        });

        // Parse ApiResponse wrapper
        if (res.data && res.data.success === false) {
            throw new Error(res.data.message || "Generate meal plan failed");
        }

        // Return data field only
        return res.data.data;
    },

    /**
     * Get meal plan detail by ID
     * GET /api/meal-plans/ai/{id}
     * @param {string} id - UUID of meal plan
     * @returns {Promise<MealPlanDetailResponse>}
     * @throws {Error} if response.data.success === false or network error
     */
    getMealPlanDetail: async (id) => {
        const res = await axiosClient.get(`/meal-plans/ai/${id}`);

        // Parse ApiResponse wrapper
        if (res.data && res.data.success === false) {
            throw new Error(res.data.message || "Get meal plan detail failed");
        }

        // Return data field only
        return res.data.data;
    },
};

export default mealPlanApi;

// Named exports for convenience
export const { generateMealPlan, getMealPlanDetail } = mealPlanApi;
