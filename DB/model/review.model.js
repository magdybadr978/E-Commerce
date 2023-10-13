import mongoose, { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const reviewModel = model.Review || model("Review", reviewSchema);
