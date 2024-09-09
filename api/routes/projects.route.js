const express = require('express');
const upload = require('../utils/multerConfig.js');
const {projects, formProject, createProject, deleteProject} = require('../controllers/project.controller.js');

const router = express.Router();

router.get('/', projects);
router.get('/new', formProject);
router.post('/new', upload.single('image'), createProject);
router.delete('/delete/:id', deleteProject);

module.exports = router;