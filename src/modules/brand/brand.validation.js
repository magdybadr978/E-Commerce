import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const addBrandSchema = {
  body: joi.object().required().keys({
    name : generalFields.name
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
  file : generalFields.file.required()
}


export const deleteBrandSchema = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    brandId : generalFields.id
  }),
  query : joi.object().required().keys({}),
}

export const updateBrandSchema = {
  body : joi.object().required().keys({
    name : generalFields.name,
  }),
  params : joi.object().required().keys({
    brandId : generalFields.id
  }),
  query : joi.object().required().keys({}),
  file : generalFields.file.required()
}


export const getBrandSchema = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    brandId : generalFields.id
  }),
  query : joi.object().required().keys({}),
}