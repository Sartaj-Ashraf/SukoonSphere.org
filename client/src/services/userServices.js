import customFetch from "@/utils/customFetch";

// Profile Routes:
// PATCH "/change-profile" - Change user profile (with avatar upload)
// GET "/profile" - Get user profile
// GET "/user-details/:id" - Get user details by ID

// Follow/Following Routes:
// PATCH "/follow/:id" - Follow or unfollow user
// GET "/followers/:id" - Get all followers
// GET "/following/:id" - Get all following

// Contributor Management Routes:
// POST "/verify-contributor" - Verify contributor
// POST "/request-contributor" - Request to be contributor
// GET "/contributor-requests" - Get all contributor requests
// DELETE "/contributor-request/:id" - Delete contributor request
// PATCH "/accept-contributor/:id" - Accept contributor request
// GET "/all-contributors" - Get all contributors

// Content Routes:
// GET "/get-most-liked-content" - Get most liked content

// Suggestion Routes:
// GET "/suggestions" - Get user suggestions (admin only)
// POST "/suggestions" - Create suggestion
// DELETE "/suggestions/:suggestionId" - Delete suggestion (admin only)
// PATCH "/suggestions/:suggestionId/status" - Update suggestion status (admin only)

const API_URL = '/users';

export const userService = {
    // Profile management
    changeProfile: async (profileData) => {
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            formData.append(key, profileData[key]);
        });
        const { data } = await customFetch.patch(`${API_URL}/change-profile`, formData);
        return data;
    },

    getUserProfile: async () => {
        const { data } = await customFetch.get(`${API_URL}/profile`);
        return data;
    },

    getUserDetailsById: async (userId) => {
        const { data } = await customFetch.get(`${API_URL}/user-details/${userId}`);
        return data;
    },

    // Follow system
    followOrUnfollow: async (userId) => {
        const { data } = await customFetch.patch(`${API_URL}/follow/${userId}`);
        return data;
    },

    getFollowers: async (userId) => {
        const { data } = await customFetch.get(`${API_URL}/followers/${userId}`);
        return data;
    },

    getFollowing: async (userId) => {
        const { data } = await customFetch.get(`${API_URL}/following/${userId}`);
        return data;
    },

    // Contributor management
    verifyContributor: async () => {
        const { data } = await customFetch.post(`${API_URL}/verify-contributor`);
        return data;
    },

    requestContributor: async () => {
        const { data } = await customFetch.post(`${API_URL}/request-contributor`);
        return data;
    },

    getContributorRequests: async () => {
        const { data } = await customFetch.get(`${API_URL}/contributor-requests`);
        return data;
    },

    deleteContributorRequest: async (requestId) => {
        const { data } = await customFetch.delete(`${API_URL}/contributor-request/${requestId}`);
        return data;
    },

    acceptContributorRequest: async (requestId) => {
        const { data } = await customFetch.patch(`${API_URL}/accept-contributor/${requestId}`);
        return data;
    },

    getAllContributors: async () => {
        const { data } = await customFetch.get(`${API_URL}/all-contributors`);
        return data;
    },

    // Content
    getMostLikedContent: async () => {
        const { data } = await customFetch.get(`${API_URL}/get-most-liked-content`);
        return data;
    },

    // Suggestions
    getUserSuggestions: async () => {
        const { data } = await customFetch.get(`${API_URL}/suggestions`);
        return data;
    }
};
