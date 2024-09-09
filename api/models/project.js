const mongoose = require("mongoose");
const {marked} = require("marked");
const slugify = require("slugify");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom"); 



const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window); 

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
   
    imageUrl: {
        type: String,
        default: "/assets/img/projects/default.jpg"
    },
    codeUrl: {
        type: String,
        required: true
    },
    projectUrl: {
        type: String,
        required: true
    },
    techStack: {
        type: [String],  
        required: true,
    },
    deployedWith: {
        type: String,
        required: true,
    },
    markdown: {
        type: String,
        required: true
    },
    
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: new Date()
    },
    
}); 
 
const sanitizeWithMermaidSupport = (markdownContent) => {
    // Convert Markdown to HTML and sanitize it
    return DOMPurify.sanitize(marked(markdownContent));
};
const postProcessHtml = (html) => {
    // Replace HTML entities with their characters
    let processedHtml = html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // Replaced `language-mermaid` with `mermaid`
    processedHtml = processedHtml.replace(/class="language-mermaid"/g, 'class="mermaid"');
    processedHtml = processedHtml.replace(/<table>/g, '<table class="table text-white">');
    

    processedHtml = processedHtml.replace(/<pre><code class="language-(?!mermaid)(\S*)">/g, '<pre><code class="language-$1 bg-programming-code">');
   
    return processedHtml;
};

projectSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.markdown) {
        const sanitizedHtml = sanitizeWithMermaidSupport(this.markdown);
        this.sanitizedHtml = postProcessHtml(sanitizedHtml); 
    }
    next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;