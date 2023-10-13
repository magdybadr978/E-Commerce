import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const signUpSchema = {
  body : joi.object().required().keys({
    userName : generalFields.name.required(),
    email : generalFields.email.required(),
    password : generalFields.password.required(),
    phone : generalFields.phone.required(),
    DOB : joi.date().required(),
    role : joi.string(), 
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
}

export const signInSchema = {
  body : joi.object().required().keys({
    email : generalFields.email.required(),
    password : generalFields.password.required()
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
}

export const confirmEmailSchema = {
  body : joi.object().required().keys({
    email : generalFields.email.required(),
    code : joi.string().required().label("enter valid code")
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
}

export const sendCodeSchema = {
  body : joi.object().required().keys({
    email : generalFields.email.required()
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
}

export const resetPasswordSchema = {
  body : joi.object().required().keys({
    email : generalFields.email.required(),
    password : generalFields.password.required(),
    code : joi.string().required().label("enter valid code")
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
}