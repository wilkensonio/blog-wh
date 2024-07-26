 
import Article from '../models/article.js';

export const likeArticle = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
        return;
        // return res.status(404).send('Article not found');
    }
    article.likes++;
    await article.save();
    res.redirect(`/articles/${article.slug}`);
    } catch (error) {
        res.status(500).send('Internal server error');
    } 
};

export const commentOnArticle = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            return;
            // return res.status(404).send('Article not found');
        }
        article.comments.push({
            user: req.body.name,
            comment: req.body.comment
        });
        await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (error) {
            res.status(500).send('Internal server error');
    } 
};

export const replyToComment = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            return;
            // return res.status(404).send('Article not found');
        }
        const comment = article.comments.id(req.params.commentId);
        if (!comment) {
            return;
            // return res.status(404).send('Comment not found');
        }
        comment.replies.push({
            user: req.body.name,
            content: req.body.content
        });
        await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (error) {
        res.status(500).send('Internal server error');
    } 
};

export const renderArticles = async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;

    res.render('articles/index', { articles: articles, isAdmin: isAdmin, isWriter: isWriter }); 
}

export const renderNewArticle = async (req, res) => { 
    res.render('articles/new', {article: new Article()});
};

export const renderEditArticle = async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', {article: article});
};

export const renderShowArticle = async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect('/');
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    res.render('articles/show', { article: article, isAdmin: isAdmin, isWriter: isWriter });
   
}
 

export const createArticle = async (req, res,next) => {
    req.article = new Article();
    next();  
}

export const updateArticle = async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next(); 
}

export const saveArticleAndRedirect = path => {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            res.render(`articles/${path}`, { article: article });
            console.log(e);
        }
    }
}

export const deleteArticle = async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/articles'); 
}

 
 