const  express = require('express');

const { 
    renderArticles,
    renderNewArticle,
    renderEditArticle,
    renderShowArticle,
    createArticle,
    updateArticle,
    saveArticleAndRedirect,
    deleteArticle,
    likeArticle,
    commentOnArticle,
    replyToComment,
    searchArticles,
    publishArticle,
    unpublishArticle
} = require('../controllers/post.controller.js'); 
const { isAuthenticated } = require('../middelware/auth.js');

const router = express.Router();
router.use(isAuthenticated);

router.get('/', renderArticles);   
router.get('/new', renderNewArticle);
router.get('/edit/:id', renderEditArticle);
router.get('/:slug', renderShowArticle);
router.get('/search', searchArticles);
router.post('/', createArticle, saveArticleAndRedirect('new'));
router.put('/:id', updateArticle, saveArticleAndRedirect('edit'));
router.put('/:id/publish', publishArticle);
router.put('/:id/unpublish', unpublishArticle);
router.delete('/:id', deleteArticle);

// like and comment routes
router.post('/:slug/like', likeArticle);
router.post('/:slug/comment', commentOnArticle);
router.post('/:slug/comment/:commentdId/reply', replyToComment);


module.exports =  router;
