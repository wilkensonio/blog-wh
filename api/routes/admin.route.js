 
import express from 'express';  


const router = express.Router();

router.get('/', async (req, res) => {
    res.render('dash/index', { partial: 'dashboard' });
});

router.get('/subscribe', async (req, res) => {
    res.render('dash/index', { partial: 'subscriber' });
});

router.get('/activities', async (req, res) => {
    res.render('dash/index', { partial: 'activities' });
});

router.get('/posts', async (req, res) => {
    res.render('dash/index', { partial: 'articles' });
}); 



export default router;