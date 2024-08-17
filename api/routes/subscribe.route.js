const express = require('express');
const {subscribe, renderSubscribePage} = require('../controllers/subscribe.controller.js');
const { isAuthenticated } = require('../middelware/auth.js');


const router = express.Router();
router.use(isAuthenticated);

router.post('/', subscribe);

router.get('/', (req, res) => {
    res.redirect('/posts');
});

router.get('/', renderSubscribePage) ;
 
module.exports = router;