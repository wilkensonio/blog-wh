const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        trim : true
    }, 

    isAdmin: {
        type: Boolean,
        default: false
    },
    isWriter: {
        type: Boolean,
        default: false 
    },

    createdAt: {
        type: Date,
        default: new Date()
    },  

});    

const User = mongoose.model('User', userSchema);
module.exports = User;