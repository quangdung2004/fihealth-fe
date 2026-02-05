import axiosClient from "./axiosClient";

/**
 * Body Analysis API Module
 * Parse ApiResponse<T> theo backend spec
 * ApiResponse = { success: boolean; message: string; timestamp: string; data: T }
 */

/**
 * Upload body image for analysis
 * POST /api/assessments/{id}/body-image
 * @param {string} assessmentId - UUID of assessment
 * @param {File} file - Image file
 * @returns {Promise<BodyAnalysisResponse>}
 * @throws {Error} if response.data.success === false or network error
 */
export const uploadBodyImage = async (assessmentId, file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosClient.post(
        `/assessments/${assessmentId}/body-image`,
        formData,
        {
            // ⏰ Increase timeout to 60s for image processing
            timeout: 60000,
            // ❌ KHÔNG set Content-Type thủ công - axios tự động set với boundary
        }
    );

    // Parse ApiResponse wrapper
    if (res.data && res.data.success === false) {
        throw new Error(res.data.message || "Upload body image failed");
    }

    // Return data field only
    return res.data.data;
};

/**
 * Get body analysis result
 * GET /api/assessments/{id}/body-analysis
 * @param {string} assessmentId - UUID of assessment
 * @returns {Promise<BodyAnalysisResponse>}
 * @throws {Error} if response.data.success === false or network error
 */
export const getBodyAnalysis = async (assessmentId) => {
    const res = await axiosClient.get(`/assessments/${assessmentId}/body-analysis`);

    // Parse ApiResponse wrapper
    if (res.data && res.data.success === false) {
        throw new Error(res.data.message || "Get body analysis failed");
    }

    // Return data field only
    return res.data.data;
};
