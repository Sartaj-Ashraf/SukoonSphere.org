import customFetch from "@/utils/customFetch";

// Question Routes:
// POST "/qa-section" - Add new question
// GET "/qa-section/all-questions" - Get all questions
// GET "/qa-section/questions-with-answers" - Get all questions with answers
// GET "/qa-section/user-questions/:id" - Get user's questions
// DELETE "/qa-section/question/:id" - Delete question

// Answer Routes:
// POST "/qa-section/:id/answer" - Create answer
// GET "/qa-section/:id/answers" - Get answers by question ID
// GET "/qa-section/user-answers/:id" - Get user's answers
// GET "/qa-section/answer/:id" - Get answer by ID
// PATCH "/qa-section/answer/:id" - Edit answer
// DELETE "/qa-section/answer/:id" - Delete answer

// Comment Routes:
// POST "/qa-section/answer/:id/add-comment" - Create comment on answer
// GET "/qa-section/answer/:id/all-comments" - Get all comments for answer
// PATCH "/qa-section/comment/:id" - Edit comment
// DELETE "/qa-section/comment/:id" - Delete comment

// Reply Routes:
// POST "/qa-section/comment/:id/add-reply" - Create reply to comment
// GET "/qa-section/comment/:id/all-replies" - Get all replies for comment
// PATCH "/qa-section/reply/:id" - Edit reply
// DELETE "/qa-section/reply/:id" - Delete reply

// Like Routes:
// PATCH "/qa-section/answer/:id/like" - Like answer
// PATCH "/qa-section/comment/:id/like" - Like comment
// PATCH "/qa-section/reply/:id/like" - Like reply

export const qaService = {
    // Question operations
    addQuestion: async (questionData) => {
        const { data } = await customFetch.post('/qa-section', questionData);
        return data;
    },

    getAllQuestions: async () => {
        const { data } = await customFetch.get('/qa-section/all-questions');
        return data;
    },

    getAllQuestionsWithAnswer: async () => {
        const { data } = await customFetch.get('/qa-section/questions-with-answers');
        return data;
    },

    getUserQuestions: async (userId) => {
        const { data } = await customFetch.get(`/qa-section/user-questions/${userId}`);
        return data;
    },

    deleteQuestion: async (questionId) => {
        const { data } = await customFetch.delete(`/qa-section/question/${questionId}`);
        return data;
    },

    // Answer operations
    createAnswer: async (questionId, answerData) => {
        const { data } = await customFetch.post(`/qa-section/${questionId}/answer`, answerData);
        return data;
    },

    getAnswerById: async (answerId) => {
        const { data } = await customFetch.get(`/qa-section/answer/${answerId}`);
        return data;
    },

    getAnswersByQuestionId: async (questionId) => {
        const { data } = await customFetch.get(`/qa-section/${questionId}/answers`);
        return data;
    },

    getUserAnswers: async (userId) => {
        const { data } = await customFetch.get(`/qa-section/user-answers/${userId}`);
        return data;
    },

    editAnswer: async (answerId, answerData) => {
        const { data } = await customFetch.patch(`/qa-section/answer/${answerId}`, answerData);
        return data;
    },

    deleteAnswer: async (answerId) => {
        const { data } = await customFetch.delete(`/qa-section/answer/${answerId}`);
        return data;
    },

    likeAnswer: async (answerId) => {
        const { data } = await customFetch.patch(`/qa-section/answer/${answerId}/like`);
        return data;
    },

    // Comment operations
    createAnswerComment: async (answerId, commentData) => {
        const { data } = await customFetch.post(`/qa-section/answer/${answerId}/add-comment`, commentData);
        return data;
    },

    getAllCommentsByAnswerId: async (answerId) => {
        const { data } = await customFetch.get(`/qa-section/answer/${answerId}/all-comments`);
        return data;
    },

    editAnswerComment: async (commentId, commentData) => {
        const { data } = await customFetch.patch(`/qa-section/comment/${commentId}`, commentData);
        return data;
    },

    deleteAnswerComment: async (commentId) => {
        const { data } = await customFetch.delete(`/qa-section/comment/${commentId}`);
        return data;
    },

    likeAnswerComment: async (commentId) => {
        const { data } = await customFetch.patch(`/qa-section/comment/${commentId}/like`);
        return data;
    },

    // Reply operations
    createAnswerReply: async (commentId, replyData) => {
        const { data } = await customFetch.post(`/qa-section/comment/${commentId}/add-reply`, replyData);
        return data;
    },

    getAllAnswerRepliesByCommentId: async (commentId) => {
        const { data } = await customFetch.get(`/qa-section/comment/${commentId}/all-replies`);
        return data;
    },

    editAnswerReply: async (replyId, replyData) => {
        const { data } = await customFetch.patch(`/qa-section/reply/${replyId}`, replyData);
        return data;
    },

    deleteAnswerReply: async (replyId) => {
        const { data } = await customFetch.delete(`/qa-section/reply/${replyId}`);
        return data;
    },

    likeAnswerReply: async (replyId) => {
        const { data } = await customFetch.patch(`/qa-section/reply/${replyId}/like`);
        return data;
    }
};
