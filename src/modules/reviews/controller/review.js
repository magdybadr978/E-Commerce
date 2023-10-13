import { StatusCodes } from "http-status-codes";
import { productModel } from "../../../../DB/model/product.model.js";
import { reviewModel } from "../../../../DB/model/review.model.js";


export const addReview = async(req,res,next)=>{
  // user   content 
  const {content , productId} = req.body;
  // add review to model
  const review = await reviewModel.create({
    userId : req.user._id,
    content
  })
  // add review to product
  const product = await productModel.findByIdAndUpdate(productId ,{
    $push : {reviews : { id : review._id}}
  })
  return res.status(StatusCodes.CREATED).json({
    success : true,
    message : "done"
  })
}