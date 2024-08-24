const  express = require('express');
const apicache = require('apicache');


const { 
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
} = require('../controllers/post.controller.js'); 
const { isAuthenticated } = require('../middelware/auth.js');

const cache = apicache.middleware;
const cacheMiddleware = cache('120 minutes'); 

const router = express.Router();
router.use(isAuthenticated);

 
router.get('/', cacheMiddleware,  (req, res) =>  renderArticles(req, res));
router.get('/algorithms', cacheMiddleware, (req, res) =>  renderArticles(req, res, 'algorithm-post'));
router.get('/algorithms/arrays', cacheMiddleware, (req, res) =>  renderArticles(req, res,  'algorithm-post', 'array'));
router.get('/algorithms/sorting', cacheMiddleware,  (req, res) =>  renderArticles(req, res, 'algorithm-post', 'sorting'));
router.get('/algorithms/searching', cacheMiddleware,  (req, res) =>  renderArticles(req, res, 'algorithm-post', 'searching'));

router.get('/blog', cacheMiddleware, (req, res) =>  renderArticles(req, res, 'blog-post'));
router.get('/blog/ai', cacheMiddleware, (req, res) =>  renderArticles(req, res, 'blog-post' , 'ai'));
router.get('/blog/others', cacheMiddleware, (req, res) =>  renderArticles(req, res, 'blog-post', 'other'));
router.get('/:slug', cacheMiddleware,  renderShowArticle);

router.get('/new', renderNewArticle);
router.get('/edit/:id', renderEditArticle);

router.post('/', createArticle, saveArticleAndRedirect('new'));

router.put('/:id', updateArticle, saveArticleAndRedirect('edit'));
router.put('/:id/publish', publishArticle);
router.put('/:id/unpublish', unpublishArticle);
router.delete('/:id', deleteArticle); 
 


module.exports =  router;
