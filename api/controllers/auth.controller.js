import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

 
export const signup = async (req, res, next) => {
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
        console.error('creating user error ', error);
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
export const signin = async (req, res, next) => {
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
            id: validUser._id, isAdmin: validUser.isAdmin }, 
            process.env.JWT_SECRET
        );

        const { password: userPassword, ...user } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(user);
       
    } catch (error) { 
        return next(error);
    }
}

// /**
//  * OAuth Signin Controller
//  * This function handles the user signin process using OAuth. It finds a user with the provided
//  * email, and profilePicture, and retreive the user from the database.
//  * If the user does not exist, it creates a new user with the provided details.
//  * 
//  * @param {Object} req - The request object, containing user details in the body.
//  * @param {Object} res - The response object.
//  * @param {Function} next - The next middleware function in the stack.
//  */

// export const oauthSignin = async (req, res, next) => { 
//     const {firstname, lastname, email, profilePicture} = req.body; 
 
//     try { 
//         const user = await User.findOne({ email });
 
//         if (user){
//             // If user exists, generate a JWT token for the user
//             const token = jwt.sign({ 
//                 id: user._id, isAdmin: user.isAdmin}, 
//                 process.env.JWT_SECRET
//             );
//             const { password, ...userData } = user._doc;
//             // Respond with the user data and set a cookie with the JWT token
//             res.status(200).cookie('access_token', token, {
//                 httpOnly: true
//             }).json(userData);
//         } else {
//             const generatedPassword = Math.random().toString(36).slice(-8) 
//             + Math.random().toString(36).slice(-8);
//             const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
//             const newUser = new User({ 
//                 firstname,
//                 lastname, 
//                 email, 
//                 password: hashPassword,
//                 profilePicture
//             });
//             await newUser.save();
//             const token = jwt.sign({ 
//                 id: newUser._id, isAdmin: newUser.isAdmin}, 
//                 process.env.JWT_SECRET
//             );
//             const { password, ...userData } = newUser._doc;
//             res.status(200).cookie('access_token', token, {
//                 httpOnly: true
//             }).json(userData);
//         }
//     } catch (error) {
//         return next(error)
//     }
// }

 