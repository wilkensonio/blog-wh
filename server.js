const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./api/routes/article.route'); 
const subscribeRoutes = require('./api/routes/subscribe.route'); 
const adminRoutes = require('./api/routes/admin.route');
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

app.use('/articles', articleRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/home', subscribeRoutes);
app.use('/admin', adminRoutes);

app.use(express.static(path.join(__dirname, '/client/build')));

// app.get('*', (req, res) => {
//     res.render('client/views/articles/index');
// });
 
app.listen(8000, () => {
    console.log('Server is running on port 8000'); 
});
