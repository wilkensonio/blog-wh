const express = require('express');
const { isAdminOrWriter, isAuthenticated } = require('../middelware/auth.js');
const upload = require('../utils/certUploadConfig.js');
const {certs, formCert, deleteCert, createCert, editCertForm, updateCert} = require('../controllers/cert.contoller.js');

const router = express.Router();

router.get('/', certs);
router.get('/new', isAuthenticated, isAdminOrWriter, formCert);

router.post('/new', isAuthenticated, isAdminOrWriter,  upload.single('image'), createCert);
router.delete('/delete/:id', deleteCert); 
 

router.get('/edit/:id', isAuthenticated, isAdminOrWriter, editCertForm);
router.put('/edit/:id', isAuthenticated, isAdminOrWriter, upload.single('image'), updateCert);

module.exports = router;