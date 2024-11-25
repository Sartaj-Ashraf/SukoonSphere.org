import customFetch from "@/utils/customFetch";

export const postServices = {
    // Post operations
    getAllPosts: async () => {
        const { data } = await customFetch.get('/posts');
        return data;
    },
    createPost: async (formData) => {
        const { data } = await customFetch.post('/posts', formData);
        return data;
    },
    deletePost: async (postId) => {
        const { data } = await customFetch.delete(`/posts/${postId}`);
        return data;
    },
    likePost: async (postId) => {
        const { data } = await customFetch.patch(`/posts/${postId}/like`);
        return data;
    },

    // Comment operations
    getComments: async (postId) => {
        const { data } = await customFetch.get(`/posts/${postId}/comments`);
        return data;
    },
    createComment: async (postId, content) => {
        const { data } = await customFetch.post(`/posts/${postId}/comments`, { content });
        return data;
    },
    deleteComment: async (commentId) => {
        const { data } = await customFetch.delete(`/posts/comments/${commentId}`);
        return data;
    },

    // Reply operations
    getReplies: async (commentId) => {
        const { data } = await customFetch.get(`/posts/comments/${commentId}/replies`);
        return data;
    },
    createReply: async (commentId, content) => {
        const { data } = await customFetch.post(`/posts/comments/${commentId}/replies`, { content });
        return data;
    },
    deleteReply: async (replyId) => {
        const { data } = await customFetch.delete(`/posts/comments/replies/${replyId}`);
        return data;
    }
}; 