 
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

export const searchArticles = async (req, res) => {
    // const query = req.query.query ? req.query.query.toLowerCase() : ''; // Ensure the query is lowercase
    // console.log('Search query:', query); // Debug: Check the query value

    try {
        const articles = await Article.find(); // Fetch articles from the database
        console.log('Fetched articles:', articles); // Debug: Check fetched articles

        // Filter articles based on the search query
        const filteredArticles = articles.filter(article => {
            if (!article) return false; // Ensure article is not null
            return (
                (article.title && article.title.toLowerCase().includes(query)) ||
                (article.description && article.description.toLowerCase().includes(query)) ||
                (article.markdown && article.markdown.toLowerCase().includes(query)) ||
                (article.sanitizedHtml && article.sanitizedHtml.toLowerCase().includes(query))
            );
        });

 

        const noMatch = filteredArticles.length === 0; 
        const isAdmin = req.user && req.user.isAdmin === true;
        const isWriter = req.user && req.user.isWriter === true;

        res.render('articles/index', { articles: filteredArticles, isAdmin: isAdmin, isWriter: isWriter, noMatch: noMatch });
    } catch (error) {
        console.error('Search error:', error); // Log error details for debugging
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
    if (article == null) res.redirect('/articles');
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
        article.published = false;
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

export const publishArticle = async (req, res) => {
    try {        
        
        const article = await Article.findById(req.params.id);
        if (!article) {
            console.log('Article not found');
            return;
            // return res.status(404).send('Article not found');
        }
        
        article.published = true; 
        await article.save();
        
        res.redirect(`/articles`);
    } catch (error) {
        console.error('Error publishing article:', error);
        res.status(500).send('Error publishing article');
    }
}

export const unpublishArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            console.log('Article not found');
            return;
            // return res.status(404).send('Article not found');
        }
        article.published = false;
        await article.save();
        res.redirect(`/articles`);
    } catch (error) {
        console.error('Error unpublishing article:', error);
        res.status(500).send('Error unpublishing article');
    }
}


 
 