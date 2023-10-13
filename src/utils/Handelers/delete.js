import { ErrorClass } from "../ErrorClass.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "../cloudinary.js";
export const deleteOne = (model)=>{
  return async(req,res,next)=>{
    const {id} = req.params;
    const checkOne = await model.findByIdAndDelete(id);
    if(!checkOne){
      return next(new ErrorClass("not found ",StatusCodes.NOT_FOUND))
    }
    if(checkOne.image){
      await cloudinary.uploader.destroy(checkOne.image.publicId)
      }

    if(checkProduct.coverImages.length){
      for(let i=0 ; i< checkProduct.coverImages.length ;i++){
         await cloudinary.uploader.destroy(checkProduct.coverImages[i].public_id)
      }
    }
    return res.status(200).json({
      message : "Deleted   successfully"
    })
  }
}