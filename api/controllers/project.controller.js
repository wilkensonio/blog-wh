const Project = require('../models/project.js');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');


const projects = async (req, res) => { 
    const projects = await Project.find();  
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    const resume = req.user && req.user.resume === true; 
    res.render('projects/index', {projects, isAdmin, isWriter, resume}); 
}

const formProject = (req, res) => {
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    const resume = req.user && req.user.resume === true; 
    res.render('projects/new', {isAdmin, isWriter, resume});
} 

const deleteProject = async (req, res) => { 
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        } 
        defualtImageUrl = '/projectUploads/default.jpg'; 
        if(project.imageUrl !== defualtImageUrl) {
            try { 
                const imagePath = path.join(__dirname, `../public${project.imageUrl}`); 
                fs.promises.unlink(imagePath); 
            } catch (error) { 
               
            }
        }
        await Project.findByIdAndDelete(id);
        res.redirect('/projects');
    } catch (error) {
      
        res.status(400).json({error: error.message});
    }
    
}

const createProject = async (req, res) => {
    try {

        const { title, techStack, deployedWith, codeUrl, projectUrl, description } = req.body;
        let imageUrl;
          
        if (req.file) {
            imageUrl = req.file.path.split('public')[1]; 
        } else {
            imageUrl = '/projectUploads/default.jpg';
        }
        const project = new Project({
            title,
            markdown:description,
            imageUrl,
            codeUrl,
            projectUrl,
            techStack: techStack.split(','),
            deployedWith,
            slug: slugify(title, {lower: true, strict: true}), 
        });

        await project.save();
         
        res.redirect(`/projects`); 
    } catch (error) {
       
        res.status(400).json({error: error.message});
    } 
}   
// edit project
const editProjectForm = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        } 
        const isAdmin = req.user && req.user.isAdmin === true;
        const isWriter = req.user && req.user.isWriter === true; 
        res.render('projects/edit', {project, isAdmin, isWriter});
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }  
}

const updateProject = async (req, res) => {

    try { 
        const { id } = req.params; 
        const project = await Project
            .findById(id)
            .exec();
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }

        const { title, techStack, deployedWith, codeUrl, projectUrl, description } = req.body;
        
        let imageUrl;
        if (req.file) {
            imageUrl = req.file.path.split('public')[1]; 
        } else {
            imageUrl = project.imageUrl;
        }
        project.title = title.trim();
        project.markdown = description.trim();
        project.imageUrl = imageUrl.trim();
        project.codeUrl = codeUrl.trim();
        project.projectUrl = projectUrl.trim();
        project.techStack = techStack.trim().split(',');
        project.deployedWith = deployedWith.trim();
        project.slug = slugify(title, {lower: true, strict: true}); 
     
        if (!title || !techStack || !deployedWith || !codeUrl || !projectUrl || !description) {
           return res.redirect(`/projects/edit/${id}`);
        }
        await project.save();
        res.redirect('/projects');
    }
    catch (error) { 
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    projects,
    formProject,
    createProject,
    deleteProject,
    editProjectForm,
    updateProject
}