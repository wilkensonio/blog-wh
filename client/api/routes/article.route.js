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

 

const router = express.Router();
router.use(isAuthenticated);


router.get('/', (req, res) =>  renderArticles(req, res));
router.get('/new', renderNewArticle);
router.get('/algorithms', (req, res) =>  renderArticles(req, res, 'algorithm-post'));
router.get('/algorithms/dfs', (req, res) =>  renderArticles(req, res,  'algorithm-post', 'dfs'));
router.get('/algorithms/bfs',  (req, res) =>  renderArticles(req, res, 'algorithm-post', 'bfs'));
router.get('/algorithms/two-pointers',  (req, res) =>  renderArticles(req, res, 'algorithm-post', 'two-pointers'));
router.get('/algorithms/fast-slow-pointers',  (req, res) =>  renderArticles(req, res, 'algorithm-post', 'fast-slow-pointers'));

router.get('/ai', (req, res) =>  renderArticles(req, res, 'ai-post'));
router.get('/ai/linear-regression', (req, res) =>  renderArticles(req, res, 'ai-post' , 'linear-regression'));
router.get('/ai/logistic-regression', (req, res) =>  renderArticles(req, res, 'ai-post', 'logistic-regression')); 
router.get('/ai/random-forests', (req, res) =>  renderArticles(req, res, 'ai-post', 'random-forests')); 

router.post('/', createArticle, saveArticleAndRedirect('new'));

router.get('/edit/:id', renderEditArticle);
router.get('/:slug',  renderShowArticle); 
router.put('/:id', updateArticle, saveArticleAndRedirect('edit'));
router.put('/:id/publish', publishArticle);
router.put('/:id/unpublish', unpublishArticle);
router.delete('/:id', deleteArticle); 
 


module.exports =  router;

 