import mongoose from "mongoose";
import { Schema,model,Types } from "mongoose";

const subCategorySchema =new Schema({
    name: { type: String, required: true, unique: true,lowercase : true },
    slug: { type: String, required: true ,unique : true,lowercase : true},
    image: { type: Object ,required : true},
    //createdBy: { type: Types.ObjectId, ref: 'User', required: true},
    categoryId : {type : Types.ObjectId,ref : 'Category',required : true}
},{
  timestamps : true
})

export const subCategoryModel = mongoose.model.SubCategory || model('SubCategory',subCategorySchema);