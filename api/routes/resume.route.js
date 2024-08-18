const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');

router.get('/download', resumeController.downloadResume);

module.exports = router;