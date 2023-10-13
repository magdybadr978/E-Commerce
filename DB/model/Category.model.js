import mongoose, { model, Schema, Types } from 'mongoose';


const categorySchema = new Schema({
    name: { type: String, required: true, unique: true ,lowercase : true,trim : true},
    slug: { type: String, required: true ,unique : true , lowercase : true},
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
},{
  timestamps : true,
  toJSON : {virtuals : true},
  toObject : { virtuals : true}
})

categorySchema.virtual('subCategories',{
  localField : "_id",
  foreignField : "categoryId",
  ref : "SubCategory"
})

const categoryModel =  model('Category', categorySchema)
//model.Category ||
export default categoryModel