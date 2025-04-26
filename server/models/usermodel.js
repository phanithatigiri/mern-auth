import mongoose from "mongoose";

const newschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name : {
        type:String,
        required:true
    },

    password : {
        type:String,
        required:true,
    },
    
    lastLogin : {
        type:Date,
        default:Date.now()
    },
    isVerified: {
        type:Boolean,
        default:false
    },
   
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationOtp: String,
    verificationOtpExpiresAt: Date,

},{timestamps:true});


const User = mongoose.models.User ||  mongoose.model('User',newschema)

export default User 