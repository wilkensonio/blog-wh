 
const Article = require('../models/article.js'); 

const renderArticles = async (req, res, category) => {
    let query = {};
    if (category) 
        query.category = category; 

    const articles = await Article.find(query).sort({ createdAt: 'desc' }); 

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
        article.category = req.body.category;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        article.published = false; 
        try {
            article = await article.save();
            res.redirect(`/posts/${article.slug}`);
        } catch (e) {
            console.log(e, "Error saving article");
            res.render(`posts/${path}`, { article: article });
            
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
   
};
 
 