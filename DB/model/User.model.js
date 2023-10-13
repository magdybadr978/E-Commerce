import mongoose from "mongoose";
import { Schema, model } from "mongoose";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
        required : [true , 'phone is required']
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },

    status: {
        type: Boolean,
        default: false,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    image: {
      type : Object
    },
    DOB:{
      type : Date
    },
    code : {
      type : String,
      min : [6 , "code must be 6 digits"],
      max : [6 , "code must be 6 digits"]
    }
}, {
    timestamps: true
})


export const userModel = mongoose.model.User ||  model('User', userSchema)
