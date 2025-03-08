const express = require('express');
const { isAdminOrWriter, isAuthenticated } = require('../middelware/auth.js');
const { signup, signin, logout } = require('../controllers/auth.controller.js');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

 
router.get('/login', (req, res) => { 
    if (req.user) {
        return res.redirect('/projects'); 
    } 
    res.render('dash/index', { partial: 'login' });
});

router.get('/signup', (req, res) => {
    if (req.user) {
        return res.redirect('/admin'); 
    }
    res.render('dash/index', { partial: 'signup' });
});

router.post('/signup', signup);
router.post('/login', signin);

router.get('/logout', logout);

router.get('/', isAdminOrWriter, (req, res) => {
    res.redirect('/admin/login');
    return
});

router.get('/subscribe', isAdminOrWriter, (req, res) => {
    res.render('dash/index', { partial: 'subscriber' });
});

router.get('/activities', isAdminOrWriter, (req, res) => {
    res.render('dash/index', { partial: 'activities' });
});

router.get('/posts', isAdminOrWriter, (req, res) => {
    res.render('dash/index', { partial: 'articles' });
});

module.exports = router;
