import customFetch from "@/utils/customFetch";

// POST "/create-article" - Create new article
// GET "/get-pending-articles" - Get pending articles
// GET "/get-published-articles" - Get published articles
// GET "/get-published-articles-by-user/:id" - Get published articles by user
// POST "/upload-image" - Upload image
// DELETE "/delete-image" - Delete image
// POST "/upload-pdf" - Upload PDF
// POST "/create-article-page/:id" - Create article page
// GET "/get-article-with-pages/:id" - Get article with pages
// PATCH "/publish-article/:id" - Publish article
// DELETE "/delete-article/:id" - Delete article
// PATCH "/edit-article/:id" - Edit article
// GET "/get-article-cover-page/:id" - Get article cover page
// GET "/get-article-page/:id" - Get article page
// DELETE "/delete-article-page/:id" - Delete article page
// PATCH "/edit-article-page/:id" - Edit article page
export const articleService = {
    // Article management
    createArticle: async (articleData) => {
        const { data } = await customFetch.post("/articles/create-article", articleData);
        return data;
    },

    getPendingArticles: async () => {
        const { data } = await customFetch.get("/articles/get-pending-articles");
        return data.articles;
    },

    getPublishedArticles: async () => {
        const { data } = await customFetch.get("/articles/get-published-articles");
        return data;
    },

    getPublishedArticlesByUser: async (userId) => {
        const { data } = await customFetch.get(`/articles/get-published-articles-by-user/${userId}`);
        return data;
    },

    publishArticle: async (articleId) => {
        const { data } = await customFetch.patch(`/articles/publish-article/${articleId}`);
        return data;
    },

    deleteArticle: async (articleId) => {
        const { data } = await customFetch.delete(`/articles/delete-article/${articleId}`);
        return data;
    },

    getArticleWithPages: async (articleId) => {
        const { data } = await customFetch.get(`/articles/get-article-with-pages/${articleId}`);
        return data;
    },

    // Article pages
    createPage: async (articleId, content, pageNumber) => {
        const { data } = await customFetch.post(
            `/articles/create-article-page/${articleId}`,
            { content, pageNumber }
        );
        return data;
    },

    getPage: async (pageId) => {
        const { data } = await customFetch.get(`/articles/get-article-page/${pageId}`);
        return data;
    },

    editArticlePage: async (pageId, content, title) => {
        const { data } = await customFetch.patch(
            `/articles/edit-article-page/${pageId}`,
            { content, title }
        );
        return data;
    },

    deletePage: async (pageId) => {
        const { data } = await customFetch.delete(`/articles/delete-article-page/${pageId}`);
        return data;
    },

    // Media handling
    uploadImage: async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        const { data } = await customFetch.post('/articles/upload-image', formData);
        return data;
    },

    deleteImage: async (imageData) => {
        const { data } = await customFetch.delete('/articles/delete-image', { data: imageData });
        return data;
    },

    uploadPdf: async (pdfFile) => {
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        const { data } = await customFetch.post('/articles/upload-pdf', formData);
        return data;
    },

    // Cover page
    getArticleCoverPage: async (articleId) => {
        const { data } = await customFetch.get(`/articles/get-article-cover-page/${articleId}`);
        return data;
    }
};