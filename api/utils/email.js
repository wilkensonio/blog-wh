import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config(); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
const logErrorToFile = (error) => {
    fs.appendFile('error.log', `${new Date()} - ${error}\n`, (err) => {
        if (err) {
            console.log('Error writing to log file:', err);
        }
    });
};
export const sendVerificationEmail = async (to, subject, text) => { 
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            text: text 
        });
    } catch (error) {

        console.log("error sending email", error);
    }
};