import mongoose from "mongoose";
import { Schema,model,Types } from "mongoose";

const couponSchema = new Schema({
  name :{
    type : String,
    required : true
  },
  discount : {
    type : Number,
    min : 1,
    max : 100,
    required : true
  },
  expiredAt : Number,
  createdBy : {
    type : Types.ObjectId,
    ref : 'User',
    required : true
  }
},
  {
    timestamps: true
  })

export const couponModel = mongoose.model.Coupon || model('Coupon',couponSchema)