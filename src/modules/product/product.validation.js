
import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const addProductSchema = {
  body : joi.object().required().keys({
    name : generalFields.name.required(),
    description : generalFields.name.min(10).required(),
    price : joi.number().required().min(0).positive(),
    discount : joi.number().min(0).max(100).positive(),
    quantity : joi.number().min(0).positive().integer(),
    colors : joi.custom((value,helper)=>{
      value = JSON.parse(value)
      const valueSchema = joi.object({
        value : joi.array().items(joi.string())
      })
      const valResult = valueSchema.validate({value})
      if(valResult.error){
        return helper.message(valResult.error.details)
      }else{
        return true
      }
    }),
    sizes : joi.custom((value,helper)=>{
      value =JSON.parse(value)
      const valueSchema = joi.object({
        value : joi.array().items(joi.string())
      })
      const ValResult = valueSchema.validate({value})
      if(ValResult.error){
        return helper.message(ValResult.error.details)
      }else{
        return true
      }
    }),
    categoryId : generalFields.id,
    subCategoryId : generalFields.id,
    brandId : generalFields.id,
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
  files : joi.object().required().keys({
    image : joi.array().items(generalFields.file).length(1).required(),
    coverImages :joi.array().items(generalFields.file).max(5)
  })
} 

export const productIdSchema = {
  params : joi.object().required().keys({
    productId : generalFields.id
  })
}