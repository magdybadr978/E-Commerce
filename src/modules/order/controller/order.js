import { cartModel } from "../../../../DB/model/cart.model.js";
import { couponModel } from "../../../../DB/model/coupon.model.js";
import { orderModel } from "../../../../DB/model/order.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import { StatusCodes } from "http-status-codes";
import { createInvoice } from "../../../utils/pdfTemplete.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../../../utils/cloudinary.js";
import sendEmail from "../../../utils/email.js";
import { clearCartt, updateStock } from "./order.service.js";
import { clearCart } from "../../cart/controller/cart.js";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createOrder = async (req, res, next) => {
  // get data from request
  const { address, coupon, phone, payment } = req.body;
  //console.log({ address, coupon, phone, payment });
  // check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await couponModel.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
    if(!checkCoupon){
      return next(new ErrorClass("there is no coupon", StatusCodes.BAD_REQUEST));
    }
  }
  // check cart have products or not
  const cart = await cartModel.findOne({ userId: req.user._id });
  //console.log({cart});
  const products = cart.products; // get products
  if (products.length < 1) {
    // empty
    return next(new ErrorClass("empty cart", StatusCodes.BAD_REQUEST));
  }

  let orderProducts = [];
  let orderPrice = 0;
  // check products
  for (let i = 0; i < products.length; i++) {
    // check product existence
    const product = await productModel.findById(products[i].productId);
    //console.log({product});
    if (!product) {
      return next(new ErrorClass(`product ${products[i].productId} not found`));
    }
    // check product stock
    if (!product.inStock(products[i].quantity)) {
      return next(
        new ErrorClass(`${product.name} out of stock`, StatusCodes.BAD_REQUEST)
      );
    }
    orderProducts.push({
      productId: product._id,
      quantity: products[i].quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: (products[i].quantity) * (product.finalPrice),
    });

    orderPrice += products[i].quantity * (product.price);
  }
//  console.log({orderProducts});
  // create order
  const order = await orderModel.create({
    user: req.user._id,
    products: orderProducts,
    address,
    phone,
    coupon: {
      _id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
    payment,
    price: orderPrice,
  });
  //console.log({order});
  // generate invoice
  const user = req.user;
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price, // before discount
    paid: order.finalPrice, // after discount
    invoice_nr: order._id, // invoice number
  };

  const pdfPath = path.join(
    __dirname,
    `./../../../../invoiceTemp/${order._id}.pdf`
  );

  createInvoice(invoice, pdfPath);
  // upload cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.CLOUD_FOLDER}/order/invoice/${user._id}`,
  });
  // delete file from fileSystem
  //await cloudinary.api.delete_folder()
  // add invoice to order
  order.invoice = { public_id, secure_url };
  await order.save();
  // send email
  const isSent = await sendEmail({
    to: user.email,
    subject: "order invoice",
    attachments: [
      {
        path: secure_url,
        contentType: "application/pdf",
      },
    ],
  });
  if (isSent) {
    // update stock
    updateStock(order.products, true);
    // clear cart
    clearCartt(req.user._id);
  }
  // stripe payment
   if(payment == "visa"){
    const stripe = new Stripe(process.env.STRIPE_KEY)

    let existCoupon;
    if(order.coupon.name !== undefined){
      existCoupon = await stripe.coupons.create({
        percent_off : order.coupon.discount,
        duration :"once"
      })
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types : ["card"],
      mode : "payment",
      success_url : process.env.SUCCESS_URL,
      cancel_url : process.env.CANCEL_URL,
      line_items : order.products.map((product)=>{
        return {
          price_data : {
            currency : "egp",
            product_data :{
              name : product.name,
            //  images : [product.productId.defaultImage.url]
            },
            unit_amount : product.itemPrice * 100,
          },
          quantity : product.quantity
        }
      }),
      discounts :existCoupon? [{coupon : existCoupon.id }] : [],
    })
    return res.json({
     success : true,
     results : session.url
   })
   }
  // send response
  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "create order successfully",
  });
};

export const cancelOrder = async (req, res, next) => {
  // get data from request
  const { orderId } = req.params;
  // check if order is exist
  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new ErrorClass("order not found", StatusCodes.NOT_FOUND));
  }
  // check order status
  if (order.status == "shipped" || order.status == "delivered") {
    return next(new ErrorClass("can not cancel this order"));
  }
  // cancel order
  order.status = "cancelled";
  await order.save();
  // update stock
  updateStock(order.products, false);
  // send response
  return res.status(200).json({
    success: true,
    message: "order canceled successfully",
  });
};
