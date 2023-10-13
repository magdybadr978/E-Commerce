import { StatusCodes } from "http-status-codes";
import { userModel } from "../../../../DB/model/User.model.js";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import bcryptjs from "bcryptjs"
import crypto from "crypto-js"
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import sendEmail, { createHTML } from "../../../utils/email.js";
import jwt from "jsonwebtoken";
import { cartModel } from "../../../../DB/model/cart.model.js";


export const signUp = async(req,res,next)=>{
  let {userName,email,password,phone,DOB,role} = req.body;
  //console.log({userName,email,password,phone,DOB});
  const emailExist = await userModel.findOne({email})
  if(emailExist){
    return next(new ErrorClass("email already exist",StatusCodes.BAD_REQUEST))
  }
  password = bcryptjs.hashSync(password ,parseInt(process.env.SALT_ROUND))
  phone = crypto.AES.encrypt(phone ,process.env.Encryption_key).toString()

 const code = nanoid(6)

 const html = createHTML(code)

sendEmail({to :email,subject : 'confirm your acoount',text : `code : ${code}`,html})

  const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder : "E-commerce/user"})
  const user = await userModel.create({userName,role,email,password,phone,DOB : new Date(DOB),image :{secure_url,public_id},code})
  // console.log({password});
  // console.log({phone});
  await cartModel.create({
    userId : user._id
  })
  res.status(StatusCodes.CREATED).json({
    message : "signUp successfully",
    user
  })
}


export const confirmEmail = async(req,res,next)=>{
  const {email ,code} = req.body;
  const emailExist = await userModel.findOne({email})
  if(!emailExist){
    return next(new ErrorClass("user not found",StatusCodes.NOT_FOUND))
  }
  if(emailExist.confirmEmail){
    return next(new ErrorClass("user already confirmed",StatusCodes.CONFLICT))
  }
  if(code != emailExist.code){
    return next(new ErrorClass("in-valid code",406))
  }
  const newCode = nanoid(6)
  await userModel.updateOne({_id : emailExist._id},{confirmEmail : true,code : newCode})
  res.status(200).json({
    message : "confirm email successfully",
  })
}

export const signIn = async(req,res,next)=>{
  const {email , password} = req.body;
  const emailExist = await userModel.findOne({email})
  if(!emailExist){
    return next(new ErrorClass("email not exist",StatusCodes.NOT_FOUND))
  }
  const match = bcryptjs.compareSync(password , emailExist.password)
  if(!match){
    return next(new ErrorClass("invalid password",StatusCodes.BAD_REQUEST))
  }
  const payload = {id : emailExist._id , email}
  const token = jwt.sign(payload,process.env.TOKEN_SIGNATURE)

  res.status(200).json({
    message : "welcome",
    token
  })
}



export const sendCode = async(req,res,next)=>{
  const {email} = req.body;
  const emailExist = await userModel.findOne({email})
  if(!emailExist){
    return next(new ErrorClass("email not exist",StatusCodes.NOT_FOUND))
  }
  //console.log({emailExist});
  const code = nanoid(6)

  const html = createHTML(code)
  sendEmail({to :email,subject : 'send code',text : `code : ${code}`,html})

  await userModel.updateOne({email : emailExist.email},{code})
  res.status(200).json({
    success : true,
    message : "check user email"
  })
}


export const resetPassword = async(req,res,next)=>{
  let {email,password,code} = req.body;
  //console.log({email,password,code});
  const emailExist = await userModel.findOne({email})
  if(!emailExist){
    return next(new ErrorClass("please enter valid email",StatusCodes.BAD_REQUEST))
  }
  if(code != emailExist.code){
    return next(new ErrorClass("invalid code",StatusCodes.BAD_REQUEST))
  }

  password = bcryptjs.hashSync(password , parseInt(process.env.SALT_ROUND))
  const newCode = nanoid(6)
  await userModel.updateOne({_id : emailExist._id},{password , code : newCode})
 
  res.status(200).json({
    message : "done"
  })
}
