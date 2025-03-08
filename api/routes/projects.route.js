const express = require('express');
const { isAdminOrWriter, isAuthenticated } = require('../middelware/auth.js');
const upload = require('../utils/multerConfig.js');
const {projects, formProject, createProject, deleteProject, editProjectForm, updateProject} = require('../controllers/project.controller.js');

const router = express.Router();

router.get('/', projects);
router.get('/new', isAuthenticated, isAdminOrWriter, formProject);
router.post('/new', isAuthenticated, isAdminOrWriter,  upload.single('image'), createProject);
router.delete('/delete/:id', deleteProject);

 

router.get('/edit/:id', isAuthenticated, isAdminOrWriter, editProjectForm);
router.put('/edit/:id', isAuthenticated, isAdminOrWriter, upload.single('image'), updateProject);

module.exports = router;