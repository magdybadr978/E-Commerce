import { StatusCodes } from "http-status-codes";
import { productModel } from "../../../../DB/model/product.model.js";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import { cartModel } from "../../../../DB/model/cart.model.js";
import { messages } from "../../../utils/enum.js";

export const addToCart = async (req, res, next) => {
  // get data
  const { productId, quantity } = req.body;
  // check product
  const productExist = await productModel.findById(productId);
  //console.log(productExist);
  if (!productExist) {
    return next(new ErrorClass(messages.cart.productNotFound, StatusCodes.NOT_FOUND));
  }
  // check quantity
  if (!productExist.inStock(quantity)) {
    return next(
      new ErrorClass(
        `sorry , only ${productExist.stock} items left on the stock`,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  // add to cart
 
  // check the product existence in the cart
  const isProductInCart = await cartModel.findOne({
    userId: req.user._id,
    "products.productId": productId,
  });
  //console.log(isProductInCart);
  //console.log({productId});

  if (isProductInCart) {
    isProductInCart.products.forEach((product) => {
      if ((product.productId).toString() === (productId).toString()) {
        product.quantity += quantity;
      }
    });
  //  console.log(isProductInCart);
    await isProductInCart.save();
    //send response
    res.status(StatusCodes.OK).json({
      message: messages.cart.add,
      isProductInCart,
    });
  } else {
    const cart = await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { products: { productId, quantity } } },
      { new: true }
    );
  //  console.log({ cart });

    res.status(StatusCodes.OK).json({
      success : true,
      message: messages.cart.addToCart,
      cart,
    });
  }
};

export const userCart = async (req, res, next) => {
  const cart = await cartModel
    .findOne({ userId: req.user._id })
    .populate("products.productId", "name price paymentPrice stock discount");
  return res.status(200).json({
    success : true,
    message: "done",
    cart,
  });
};

export const updateCart = async (req, res, next) => {
  // data
  const { productId, quantity } = req.body;
  // check product
  const checkProduct = await productModel.findOne({ _id : productId });
  if (!checkProduct) {
    return next(new ErrorClass(messages.cart.productNotFound, StatusCodes.NOT_FOUND));
  }
  // check stock
  if (quantity > checkProduct.stock) {
    return next(
      new ErrorClass(
        `sorry , only ${checkProduct.stock} items left on the stock`,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  // update product
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id, "products.productId": productId },
    {
      $set: { "products.$.quantity": quantity },
    },
    { new: true }
  );
  // send response
  res.status(200).json({
    success : true,
    message: messages.cart.update,
    cart,
  });
};

export const removeProduct = async (req, res, next) => {
  // get product from params
  const { productId } = req.params;
  // remove product from cart
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }
  );
  // send response
  return res.status(200).json({
    message: messages.cart.remove,
  });
};

export const clearCart = async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    { products: [] },
    { new: true }
  );
  return res.status(200).json({
    message: messages.cart.clear,
    cart,
  });
};
