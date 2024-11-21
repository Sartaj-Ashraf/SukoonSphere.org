import customFetch from "@/utils/customFetch";

export const articleService = {
    getPendingArticles: async () => {
        const { data } = await customFetch.get("/articles/get-pending-articles");
        return data.articles;
    },

    createPage: async (articleId, content, pageNumber) => {
        const { data } = await customFetch.post(
            `/articles/create-article-page/${articleId}`,
            { content, pageNumber }
        );
        return data;
    },

    publishArticle: async (articleId) => {
        const { data } = await customFetch.patch(
            `/articles/publish-article/${articleId}`
        );
        return data;
    },

    deletePage: async (pageId) => {
        const { data } = await customFetch.delete(
            `/articles/delete-article-page/${pageId}`
        );
        return data;
    },
    deleteArticle: async (articleId) => {
        const { data } = await customFetch.delete(
            `/articles/delete-article/${articleId}`
        );
        return data;
    },
    updatePage: async (pageId, content, title) => {
        const { data } = await customFetch.patch(
            `/articles/edit-article/${pageId}`,
            { content, title }
        );
        console.log({ data });
        return data;
    },
    editArticlePage: async (pageId, content, title) => {
        const { data } = await customFetch.patch(
            `/articles/edit-article-page/${pageId}`,
            { content, title }
        );
        return data;
    },
    getPage: async (pageId) => {
        const { data } = await customFetch.get(
            `/articles/get-article-page/${pageId}`
        );
        return data;
    },
    viewCoverPage: async (articleId) => {
        const { data } = await customFetch.get(
            `/articles/get-article-cover-page/${articleId}`
        );
        console.log({ coverPage: data });
        return data;
    },
};