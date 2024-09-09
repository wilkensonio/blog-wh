const Project = require('../models/project.js');
const slugify = require('slugify');

const projects = async (req, res) => { 
    const projects = await Project.find();  
    const isAdmin = req.user && req.user.isAdmin === true; 
    res.render('projects/index', {projects, isAdmin, }); 
}

const formProject = (req, res) => {
    res.render('projects/new');
} 

const deleteProject = async (req, res) => { 
    try {
        const { id } = req.params;
        const imagePath = path.join(__dirname, `../public${project.imageUrl}`);
        fs.unlinkSync(imagePath); 
        await Project.findByIdAndDelete(id);
        res.redirect('/projects');
    } catch (error) {
        console.log(error, "Error deleting project");
        res.status(400).json({error: error.message});
    }
    
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