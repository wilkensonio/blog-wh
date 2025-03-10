const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./api/routes/article.route'); 
const homeRoutes = require('./api/routes/home.route'); 
const adminRoutes = require('./api/routes/admin.route');
const resumeRoutes = require('./api/routes/resume.route'); 
const projectsRoutes = require('./api/routes/projects.route'); 
const certsRoutes = require('./api/routes/cert.route'); 
const methodOverride = require('method-override'); 
const path = require('path');
const cookieParser = require('cookie-parser'); 
const compression = require('compression');  
const fs = require('fs');
 

const dotenv = require('dotenv'); 

dotenv.config();

const app = express();  

// Path to the uploads directory
const uploadDir = path.join(__dirname, './api/public', 'projectUploads');
const uploadCert = path.join(__dirname, './api/public', 'certsUploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(uploadCert)) {
    fs.mkdirSync(uploadCert);
}


app.set('views', [
    path.join(__dirname, './client/views'),
    path.join(__dirname, './client/admin')
]);  

app.set('view engine', 'ejs'); 

app.use((req, res, next) => {
    if (process.env.MAINTENANCE_MODE === 'true') {
        res.render('maintenance');
    } else {
        next();
    }
});

app.use(compression(
    {
        level: 6,
        threshold: 100 * 1000, // any files over 100kb will be compressed
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        }
    }
));

app.use(cookieParser());
mongoose.connect(process.env.MONGO)
.then(() => console.log('Connected to MongoDB'))
.catch(err => { console.error(err)
}); 

app.use(express.static(path.join(__dirname, './api/public')));  

app.use(methodOverride('_method')); 

app.use(express.urlencoded({ extended: false }));

app.use('/', homeRoutes); 
 
// resume
app.get('/about', (req, res) => { 
    res.render('resume/index', auth(req));
});

app.use('/projects', projectsRoutes);
app.use('/certs', certsRoutes);

app.use('/posts', articleRoutes); 
app.use('/admin', adminRoutes);

// resume download
app.use('/about', resumeRoutes);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    res.render('404');
}); 

 
app.listen(8000, () => {
    console.log('Server is running on port 8000'); 
});

// pass when page is loaded to check if user is admin or writer
const auth = (req) => {
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true; 
    return { isAdmin: isAdmin, isWriter: isWriter, resume: true }
}