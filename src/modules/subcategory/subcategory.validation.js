import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';



export const addSubCategorySchema = {
  body : joi.object().required().keys({
    name : generalFields.name,
    categoryId :generalFields.id
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
  file : generalFields.file.required()
} 


export const deleteSubCategorySchema ={
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    subCategoryId : generalFields.id
  }),
  query : joi.object().required().keys({}),
}


export const searchSubCategorySchema = {
  body : joi.object().required().keys({
    char : generalFields.name
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
}

export const updateSubCategorySchema = {
  body :  joi.object().required().keys({
    name : generalFields.name
  }),
  params :  joi.object().required().keys({
    subCategoryId : generalFields.id
  }),
  query :  joi.object().required().keys({}),
  file : generalFields.file
}


export const getSubCategoryByIdSchema = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    subCategoryId : generalFields.id
  }),
  query : joi.object().required().keys({}),
}
