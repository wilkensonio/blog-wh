import mongoose from "mongoose";
import {marked} from "marked";
import slugify from "slugify";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom"; 



const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window); 


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String, 
    },
    markdown: {
        type: String,
        required: true
    },
    pusblished: {
        type: Boolean,
        default: false 
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

    // Replace `language-mermaid` with `mermaid`
    processedHtml = processedHtml.replace(/class="language-mermaid"/g, 'class="mermaid"');
    processedHtml = processedHtml.replace(/<table>/g, '<table class="table table-borderless text-white">');

    return processedHtml;
};
articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    if (this.markdown) {
        const sanitizedHtml = sanitizeWithMermaidSupport(this.markdown);
        this.sanitizedHtml = postProcessHtml(sanitizedHtml); 
    }
    next();
});

const Article = mongoose.model('Article', articleSchema);
export default Article;