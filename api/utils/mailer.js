const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();  

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
 
const sendEmail = async (to, subject, text, verificationLink) => { 
    try {
        await transporter.sendMail({
            from: `"KadeenoPost" <${process.env.EMAIL}>`,
            to: to,
            subject: subject,
            text: text,
            html: `<p>${text}</p><p><a href="${verificationLink}">Verify your email</a></p>`, 
        });
    } catch (error) { 
       console.error("error sending email", error);
    }
};

 
module.exports = sendEmail;