import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//create order schema 
export const createOrderSchema = {
  body : joi.object().required().keys({
    address : joi.string().min(3).required(),
    coupon : joi.string(),
  //  phone : joi.string().pattern(new RegExp(/^(01)(0 | 1 | 2 | 5)[0-9]{8}$/)).required(),
    phone : joi.string().pattern(new RegExp(/^01[0-2 , 5]{1}[0-9]{8}$/)).required(),
    payment : joi.string().valid("cash","visa").required()
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({})
} 



export const cancelOrderSchema = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    orderId : generalFields.id
  }),
  query : joi.object().required().keys({}),
}