import mongoose, { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, min: 1 },
        name: String,     
        itemPrice: Number,
        totalPrice: { type : Number , default : 0},
      },
    ],
    invoice: {
      secure_url : String,
      public_id : String 
    },
    address: {
      type: String,
      required: true,
    },
    phone : {
      type : String,
      required : true
    },
    price : {
      type : Number,
      default : 0,
      required : true
    },
    coupon : {
      couponId : {type : Types.ObjectId , ref : 'Coupon'},
      name : String,
      discount : { type : Number , min : 1 , max : 100}
    },
    status : {
      type : String,
      enum : ["placed","shipped","delivered","cancelled","refunded"],
      default : "placed"
    },
    payment : {
      type : String,
      enum : ["visa", "cash"],
      default : "cash"
    }
  },
  {
    timestamps: true,
    toJSON : {virtuals : true},
    toObject : { virtuals : true}
  }
);

orderSchema.virtual("finalPrice").get(function(){
  return this.coupon ?
     Number.parseFloat(
      this.price - (this.price * this.coupon.discount) / 100
    ).toFixed(2)
     : this.price
  
})

export const orderModel = model.Order || model("Order", orderSchema);
