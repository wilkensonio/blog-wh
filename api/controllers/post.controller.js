const Article = require('../models/article.js'); 
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });    

const renderArticles = async (req, res, category, type) => {
    let query = {};
    if (category) 
        query.category = category; 
    if (type)
        query.type = type;

    const articles = await Article.find(query).sort({ createdAt: 'desc' });  

    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    const resume = req.user && req.user.resume === true;  
    const publish = articles.some(article => article.published); 
    
    let message = null;
    if (articles.length === 0 || publish===false) {
        if (category === 'algorithm-post' && type)
            message = `No ${type} algorithms found, Please check back later.`;
        else if (category === 'blog-post' && type){
            if (type == 'ai') 
                type = 'AI';
            else if (type == 'ml')
                type = 'ML';
            else if (type == 'dl')
                type = 'DL';
            message = `No ${type} blog found, Please check back later.`;
        }else 
            message = 'No articles found, Please check back later';
    }  

    res.render('articles/index', { 
        articles: articles, 
        isAdmin: isAdmin, 
        isWriter: isWriter, 
        resume: resume,
        message: message
    }); 
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
        article.type = req.body.type;
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

const sendDiscordMessage = async (msg) => {
    const payload = {
        content: msg, 
    };
    const discordWebhook = process.env.DISCORDWEBHOOK;

    try {
        const response = await axios.post(discordWebhook, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Message sent to Discord:', response.data);
    } catch (error) {
        console.error('Error sending message to Discord:', error);
    }
};

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

        const url = process.env.BASE_URL + '/posts/' + article.slug; 
        const msg = `New article: \n ${article.title} \n ${article.description} \n read it here\u00A0👉\u00A0${url}`;
        await sendDiscordMessage(msg, article.slug);
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
 
 