const express = require('express');
const {renderHomePage} = require('../controllers/home.controller.js');
const { isAuthenticated } = require('../middelware/auth.js');


const router = express.Router();
router.use(isAuthenticated); 
router.get('/', renderHomePage) ;
 
module.exports = router;