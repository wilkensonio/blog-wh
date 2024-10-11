const dotenv = require("dotenv");
const User = require("../models/user.js");
const bcryptjs = require("bcryptjs");
const  errorHandler  = require("../utils/error.js");
const jwt = require("jsonwebtoken");

dotenv.config(); 
/**
 * This function handles the user signup process. It creates a new user with the provided
 * name, email, and password, and saves the user to the database.
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 * @returns next error
 */
 
const signup = async (req, res, next) => {
    const {name, email, password, confirm_password} = req.body;
    
    if (!name||!email || !password) {
        return next(errorHandler(400, "All fields are required."));
    }
    if (password !== confirm_password) {
       return next(errorHandler(400, "Passwords do not match."));
    }
    try {
        const hashPassword = bcryptjs.hashSync(password, 10);
        if (!hashPassword) {
            return next(errorHandler(500, "Error hashing password.")); 
        }
        const newUser = new User({ 
            name,
            email,  
            password: hashPassword,
        });
        await newUser.save();
        res.redirect('/admin/login');
        
    } catch (error) {
        if (error.code === 11000) {
            return next(errorHandler(400, "Email already exists."));
        } 
       return next(error);
    }
}


/**
 * Signin Controller
 * This function handles the user signin process. It finds a user with the provided
 *  email, and password, and retreive the user from the database.
 *
 * @param {Object} req - The request object, containing user details in the body.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(errorHandler(400, "All fields are required."));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "Invalid credentials."));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
 
        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials."));
        } 
        const token = jwt.sign({ 
            id: validUser._id, 
            isAdmin: validUser.isAdmin,
            isWriter: validUser.isWriter
        },  process.env.JWT_SECRET);

        const { password: userPassword, ...user } = validUser._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
            maxAge: 3600000 // 1 hour
        });
        return res.redirect('/admin');
       
    } catch (error) { 
        return next(error);
    }
}

const logout = (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/admin/login');
}


const resetPassword =   (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(errorHandler(400, "Email is required."));
    }
    // send email with reset link
    res.redirect('/admin/login');
}

module.exports = { signup, signin, logout, resetPassword };