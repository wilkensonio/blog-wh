const express = require('express');
const { isAdminOrWriter, isAuthenticated } = require('../middelware/auth.js');
const upload = require('../utils/multerConfig.js');
const {projects, formProject, createProject, deleteProject} = require('../controllers/project.controller.js');

const router = express.Router();

router.get('/', projects);
router.get('/new', isAuthenticated, isAdminOrWriter, formProject);
router.post('/new', isAuthenticated, isAdminOrWriter,  upload.single('image'), createProject);
router.delete('/delete/:id', deleteProject);

module.exports = router;