import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {      // reference
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
          _id: false,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const cartModel = mongoose.model.Cart || model("Cart", cartSchema);
