import joi from "joi";

export const addCouponSchema = {
  body : joi.object().required().keys({
    discount : joi.number().min(1).max(100).required(),
    expiredAt : joi.date().greater(Date.now()).required()
  })
}


export const updateCouponSchema ={
  body : joi.object().required().keys({
    discount : joi.number().min(1).max(100),
    expiredAt : joi.date().greater(Date.now()),
    
  }),
  params : joi.object().required().keys({
    code : joi.string().length(6).required()
  })

}


export const deleteCouponSchema = {
  body : joi.object().required().keys({}),
  params : joi.object().required().keys({
    code : joi.string().length(6).required()
  }),
  query : joi.object().required().keys({}),
}