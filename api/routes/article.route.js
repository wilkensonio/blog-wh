import express from 'express';

import { 
    renderArticles,
    renderNewArticle,
    renderEditArticle,
    renderShowArticle,
    createArticle,
    updateArticle,
    saveArticleAndRedirect,
    deleteArticle 
} 
from '../controllers/post.controller.js'; 
import { isAuthenticated } from '../middelware/auth.js';

const router = express.Router();
router.use(isAuthenticated);

router.get('/', renderArticles);    
router.get('/new', renderNewArticle);
router.get('/edit/:id', renderEditArticle);
router.get('/:slug', renderShowArticle);
router.post('/', createArticle, saveArticleAndRedirect('new'));
router.put('/:id', updateArticle, saveArticleAndRedirect('edit'));
router.delete('/:id', deleteArticle);

export default router;
