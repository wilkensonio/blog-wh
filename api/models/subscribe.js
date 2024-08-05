import mongoose from "mongoose";


const subscribeSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }, 
    
    verificationToken: {
        type: String, 
        required: true 
    },

    deviceId: { 
        type: String, 
        required: true, 
        unique: true 
    },

    createdAt: {
        type: Date,
        default: new Date()
    }, 

});

const Subscribe = mongoose.model('Subscribe', subscribeSchema);
export default Subscribe;