const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./api/routes/article.route'); 
const subscribeRoutes = require('./api/routes/subscribe.route'); 
const adminRoutes = require('./api/routes/admin.route');
const resumeRoutes = require('./api/routes/resume.route');
const methodOverride = require('method-override'); 
const path = require('path');
const cookieParser = require('cookie-parser'); 

const dotenv = require('dotenv');

dotenv.config();

const app = express(); 
app.use(cookieParser());
mongoose.connect(process.env.MONGO).then(() => console.log('Connected to MongoDB'));

// const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, './api/public'))); 

app.use(methodOverride('_method')); 

app.set('views', [
    path.join(__dirname, './client/views'),
    path.join(__dirname, './client/admin')
]);  

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/resume', (req, res) => {
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true; 
    res.render('resume/index', { isAdmin: isAdmin, isWriter: isWriter, resume: true });
});

app.use('/posts', articleRoutes); 
app.use('/subscribe', subscribeRoutes);
app.use('/', subscribeRoutes);
app.use('/admin', adminRoutes);

app.use('/resume', resumeRoutes);



app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    res.send('Wrong URL');
}); 

 
app.listen(8000, () => {
    console.log('Server is running on port 8000'); 
});
