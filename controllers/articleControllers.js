import Article from "../models/articles/articleModel.js";

// Get all articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({ deleted: false })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single article
export const getSingleArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({ _id: id, deleted: false })
      .populate("author", "name email");
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new article
export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = new Article({
      title,
      content,
      author: req.user._id, // Assuming you have authentication middleware
    });
    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update article
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check if user is the author
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this article" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete article (soft delete)
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check if user is the author
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this article" });
    }

    await Article.findByIdAndUpdate(id, { deleted: true });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get articles by user ID
export const getArticlesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const articles = await Article.find({ 
      author: userId, 
      deleted: false 
    })
    .populate("author", "name email")
    .sort({ createdAt: -1 });

    if (!articles.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};