import mongoose from "mongoose";
import { Schema,model,Types } from "mongoose";

const brandSchema = new Schema({
  name : {type : String ,required : true , unique : true,lowercase : true},
  slug : {type : String , required : true , unique : true,lowercase : true},
  image : {type : Object},
  createdBy : {type : Types.ObjectId,ref : 'User',required : true}  // reference
},{
  timestamps : true

})

export const brandModel =  mongoose.model.Brand || model('Brand',brandSchema);