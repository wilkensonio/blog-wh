const Project = require('../models/project.js');
const slugify = require('slugify');

const projects = async (req, res) => { 
    const projects = await Project.find();  
    res.render('projects/index', {projects }); 
}

const formProject = (req, res) => {
    res.render('projects/new');
} 

const deleteProject = async (req, res) => { 
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.redirect('/projects');
}

const createProject = async (req, res) => {
    try {

        const { title, techStack, deployedWith, codeUrl, projectUrl, description } = req.body;
        const imageUrl = req.file.path.split('public')[1];  

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
        console.log(error, "Error creating project");
        res.status(400).json({error: error.message});
    } 
}   

module.exports = {
    projects,
    formProject,
    createProject,
    deleteProject
}