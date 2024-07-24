 
import Article from '../models/article.js';


export const renderArticles = async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles: articles}); 
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
    res.render('articles/show', { article: article});
   
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

 
 