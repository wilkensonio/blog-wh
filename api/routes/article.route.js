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
router.get('/algorithms/arrays', (req, res) =>  renderArticles(req, res,  'algorithm-post', 'array'));
router.get('/algorithms/sorting',  (req, res) =>  renderArticles(req, res, 'algorithm-post', 'sorting'));
router.get('/algorithms/searching',  (req, res) =>  renderArticles(req, res, 'algorithm-post', 'searching'));

router.get('/blog', (req, res) =>  renderArticles(req, res, 'blog-post'));
router.get('/blog/ai', (req, res) =>  renderArticles(req, res, 'blog-post' , 'ai'));
router.get('/blog/others', (req, res) =>  renderArticles(req, res, 'blog-post', 'other'));
router.get('/:slug',  renderShowArticle); 

router.get('/edit/:id', renderEditArticle);

router.post('/', createArticle, saveArticleAndRedirect('new'));

router.put('/:id', updateArticle, saveArticleAndRedirect('edit'));
router.put('/:id/publish', publishArticle);
router.put('/:id/unpublish', unpublishArticle);
router.delete('/:id', deleteArticle); 
 


module.exports =  router;
