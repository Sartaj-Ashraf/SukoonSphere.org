import customFetch from "@/utils/customFetch";

// POST "/" - Create new post
// GET "/" - Get all posts
// GET "/:id" - Get post by ID
// PATCH "/:id" - Update post
// PATCH "/:id/like" - Like a post
// PATCH "/comments/:id/like" - Like a comment
// PATCH "/comments/replies/:id/like" - Like a reply
// POST "/:id/comments" - Create comment on a post
// PATCH "/comments/:id" - Update a comment
// PATCH "/comments/replies/:id" - Update a reply
// GET "/user/:id" - Get all posts by user ID
// GET "/:id/comments" - Get all comments for a post
// POST "/comments/:id/replies" - Create a reply to a comment
// GET "/comments/:id/replies" - Get all replies for a comment
// DELETE "/:id" - Delete a post
// DELETE "/comments/:id" - Delete a comment
// DELETE "/comments/replies/:id" - Delete a reply

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