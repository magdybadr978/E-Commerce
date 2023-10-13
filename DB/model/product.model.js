import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    paymentPrice: { type: Number, required: true, default: 0 },
    colors: { type: Array },
    sizes: { type: Array },
    coverImages: { type: Array },
    image: { type: Object, required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    subCategoryId: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand", required: true },
    avgRate: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    QRcode: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: false },
    wishList: [{ type: Types.ObjectId, ref: "User" }],
    reviews : [{ id :{type : Types.ObjectId , ref : "Review"}}]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.methods.inStock = function (requiredQuantity) {
  return this.stock >= requiredQuantity ? true : false;
};

productSchema.virtual("finalPrice").get(function () {
  // this  >>>>>>>  document   >>>>> product
  // calculate finalPrice
  if(this.price){
    return Number.parseFloat(
      this.price - (this.price - this.discount || 0) / 100
    ).toFixed(2);
  }
});

export const productModel =
  mongoose.model.Product || model("Product", productSchema);
