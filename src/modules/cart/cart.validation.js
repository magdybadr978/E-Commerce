import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const CartSchema = {
  body : joi.object().required().keys({
    productId : generalFields.id.required(),
    quantity : joi.number().integer().min(1).required()
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({})
}

export const removeProductSchema = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    productId : generalFields.id.required()
  }),
  query : joi.object().required().keys({}),
}