 
const Article = require('../models/article.js');

 const likeArticle = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
        return;
        // return res.status(404).send('Article not found');
    }
    article.likes++;
    await article.save();
    res.redirect(`/posts/${article.slug}`);
    } catch (error) {
        res.status(500).send('Internal server error');
    } 
};

 const commentOnArticle = async (req, res) => {
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

 const replyToComment = async (req, res) => {
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
        res.redirect(`/posts/${article.slug}`);
    } catch (error) {
        res.status(500).send('Internal server error');
    } 
}; 

 const renderArticles = async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    const resume = req.user && req.user.resume === true; 
    res.render('articles/index', { articles: articles, isAdmin: isAdmin, isWriter: isWriter, resume: resume}); 
}

const renderNewArticle = async (req, res) => { 
    res.render('articles/new', {article: new Article()});
};

const renderEditArticle = async (req, res) => {
    const article = await Article.findById(req.params.id);
    const resume = req.user && req.user.resume === true; 
    res.render('articles/edit', {article: article, resume: resume});
};

const renderShowArticle = async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect('/articles');
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    const resume = req.user && req.user.resume === true; 
    res.render('articles/show', { article: article, isAdmin: isAdmin, isWriter: isWriter, resume: resume });   
} 

const createArticle = async (req, res,next) => {
    req.article = new Article();
    next();  
}

 const updateArticle = async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next(); 
}

 const saveArticleAndRedirect = path => {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        article.published = false;
        try {
            article = await article.save();
            res.redirect(`/posts/${article.slug}`);
        } catch (e) {
            res.render(`posts/${path}`, { article: article });
            console.log(e);
        }
    }
}

 const deleteArticle = async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/posts'); 
}

 const publishArticle = async (req, res) => {
    try {        
        
        const article = await Article.findById(req.params.id);
        if (!article) {
            console.log('Post not found');
            return;
            // return res.status(404).send('Article not found');
        }
        
        article.published = true; 
        await article.save();
        
        res.redirect(`/posts`);
    } catch (error) {
        console.error('Error publishing article:', error);
        res.status(500).send('Error publishing article');
    }
}

 const unpublishArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            console.log('Article not found');
            return;
            // return res.status(404).send('Article not found');
        }
        article.published = false;
        await article.save();
        res.redirect(`/posts`);
    } catch (error) {
        console.error('Error unpublishing article:', error);
        res.status(500).send('Error unpublishing article');
    }
}

module.exports = {
    likeArticle,
    commentOnArticle,
    replyToComment,
    renderArticles,
    renderNewArticle,
    renderEditArticle,
    renderShowArticle,
    createArticle,
    updateArticle,
    saveArticleAndRedirect,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    // renderShowResume
};
 
 