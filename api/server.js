const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/article.route'); 
const subscribeRoutes = require('./routes/subscribe.route'); 
const adminRoutes = require('./routes/admin.route');
const methodOverride = require('method-override'); 
const path = require('path');
const cookieParser = require('cookie-parser'); 
const dotenv = require('dotenv');

dotenv.config();

const app = express(); 
app.use(cookieParser());
mongoose.connect(process.env.MONGO).then(() => console.log('Connected to MongoDB'));

// const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/client/build')));

app.use(methodOverride('_method')); 

app.set('views', [
    path.join(__dirname, '../client/views'),
    path.join(__dirname, '../client/admin')
]);  

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use('/articles', articleRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/home', subscribeRoutes);
app.use('/admin', adminRoutes);
 
app.get('*', (req, res) => {
    res.render('articles/index');
});
 
app.listen(8000, () => {
    console.log('Server is running on port 8000'); //on http://localhost:8000'
});
