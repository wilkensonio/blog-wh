import express from 'express';
import mongoose from 'mongoose';
import articleRoutes from './routes/article.route.js'; 
import subscribeRoutes from './routes/subscribe.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import methodOverride from 'method-override';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express(); 
mongoose.connect('mongodb://localhost/blog');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

 
app.set('views', [
    path.join(__dirname, '../client/views'),
    path.join(__dirname, '../client/admin')
]);   

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => { 
    res.render('subscribe/index');
}); 

app.use('/articles', articleRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', authRoutes);
 

app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});