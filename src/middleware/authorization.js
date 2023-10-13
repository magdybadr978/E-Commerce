import { StatusCodes } from "http-status-codes"
import { ErrorClass } from "../utils/ErrorClass.js"
import { asyncHandler } from "../utils/errorHandling.js"

export const roles = {
  admin : "Admin",
  user : "User"
}

Object.freeze(roles)
export const isAuthorized = (roles = [])=>{

   return asyncHandler(
    async(req,res,next)=>{
    if(!roles.includes(req.user.role)){
     return next(new ErrorClass("you are not authorized to access this end point",StatusCodes.FORBIDDEN))
   }
    return next()
 })
}