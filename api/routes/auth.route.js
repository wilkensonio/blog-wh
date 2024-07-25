import express from 'express';
import { signup, signin } from '../controllers/auth.controller.js';
 

const router = express.Router();

router.get('/signup', async (req, res) => {
    res.render('dash/index', { partial: 'signup' });
});

router.post('/signup', signup)

router.get('/login', async (req, res) => {
    res.render('dash/index', { partial: 'login' });
});


export default router;