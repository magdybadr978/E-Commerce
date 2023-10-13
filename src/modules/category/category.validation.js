import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addCategorySchema = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file.required(),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}
export const updateCategorySchema = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}
export const deleteCategorySchema = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const searchWithCharSchema = {
  body : joi.object().required().keys({
    char : generalFields.name
  }),
  params : joi.object().required().keys({}),
  query : joi.object().required().keys({}),
}

export const getCategoryByIdSchema = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    categoryId : generalFields.id
  }),
  query : joi.object().required().keys({}),
}