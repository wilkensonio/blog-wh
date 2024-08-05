import User from "../models/user.js";

export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req   .params.id  , req.body, { new: true }); 

    } catch (error) {

    }
}

export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        const password = req.body.password;
         
        if(user && user.password === password) {
            res.redire
        }
    } catch (error) {
    }
}