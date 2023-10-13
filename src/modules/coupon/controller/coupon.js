import voucher_codes from "voucher-code-generator";
import { couponModel } from "../../../../DB/model/coupon.model.js";
import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import { messages } from "../../../utils/enum.js";

export const addCoupon = async(req,res,next)=>{ 
  const {discount,expiredAt} = req.body;
  const code = voucher_codes.generate({length : 6});      // []
  const coupon = await couponModel.create({
    name : code[0],
    discount,
    expiredAt : new Date(expiredAt).getTime(),
    createdBy : req.user._id
  }) 
  return res.status(StatusCodes.CREATED).json({
    success : true,
    message : messages.coupon.create,
    coupon
  })
}


export const updateCoupon = async(req,res,next)=>{
  const {discount , expiredAt} = req.body;
  const {code} = req.params;
  //console.log(code);
  const checkCoupon = await couponModel.findOne({
    name : code,
    expiredAt : { $gt : Date.now()}
  })
  //console.log(checkCoupon);
  if(!checkCoupon){
    return next(new ErrorClass(messages.coupon.notFound,StatusCodes.NOT_FOUND))
  }
  if(req.user.id !== checkCoupon.createdBy.toString()){
    return next(new ErrorClass(messages.coupon.NotAllowed,StatusCodes.FORBIDDEN))
  }
  checkCoupon.discount = discount ? discount : checkCoupon.discount
  checkCoupon.expiredAt = expiredAt ? new Date(expiredAt) : checkCoupon.expiredAt

  const coupon = await checkCoupon.save()
  return res.status(201).json({
    success : true,
    message : messages.coupon.update,
    coupon
  })
}

export const deleteCoupon = async(req,res,next)=>{
  const {code} = req.params;
  const checkCoupon = await couponModel.findOne({
    name : code
  })
  if(!checkCoupon){
    return next(new ErrorClass(messages.coupon.notFound,StatusCodes.NOT_FOUND))
  }
  if(req.user.id !== checkCoupon.createdBy.toString()){
    return next(new ErrorClass(messages.coupon.NotAllowed,StatusCodes.FORBIDDEN))
  }
  await couponModel.findByIdAndDelete(checkCoupon._id)
  return res.status(StatusCodes.OK).json({
    success : true,
    message : messages.coupon.delete
  })
}


export const getAllCoupons = async(req,res,next)=>{
  const coupons = await couponModel.find();
  return res.json({
    success : true,
    message : "done",
    coupons
  })
}