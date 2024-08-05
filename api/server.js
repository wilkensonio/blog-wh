import express from 'express';
import mongoose from 'mongoose';
import articleRoutes from './routes/article.route.js'; 
import subscribeRoutes from './routes/subscribe.route.js'; 
import adminRoutes from './routes/admin.route.js';
import methodOverride from 'method-override'; 
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'; 
import dotenv  from 'dotenv';
import { use } from 'marked';
dotenv.config();

const app = express(); 
app.use(cookieParser());
mongoose.connect(process.env.MONGO).then(() => console.log('Connected to MongoDB'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
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
 
 

app.listen(8000, () => {
    console.log('Server is running on port 8000'); //on http://localhost:8000'
});