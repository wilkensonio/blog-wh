import express from 'express';
import Subscriber from '../models/subscribe.js';
import { sendVerificationEmail } from '../utils/email.js'; 
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
 
const router = express.Router();

router.post('/', async (req, res) => { 
    try {
        const email = req.body.email.trim().toLowerCase();
        
        if (!email) {
            return;
        }

        let subscriber = await Subscriber.findOne({email});

        if (!subscriber) { 
            const verifyToken = uuidv4();
            console.log("verifyToken", verifyToken);
            let subject = 'Welcome to our newsletter';

           const text = `Thank you for subscribing to our newsletter. Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify/${verifyToken}`;

            await sendVerificationEmail(email, subject, text);
            const subscriber = new Subscriber({ email, verificationToken: verifyToken });
            await subscriber.save(); 
            return res.redirect('/articles');
        }
        else if (!subscriber.isVerified) {
            const subject = 'Verify your email';
            const text = `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify/${subscriber.verificationToken}`;
            await sendVerificationEmail(email, subject, text);
        }
        return res.redirect('/articles');
    } catch (error) {
        if (error.code === 11000)  
            return res.redirect('/articles');
        else
            return res.status(500).json({ message: error.message });
    }
});

export default router;