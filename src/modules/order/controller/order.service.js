import { cartModel } from "../../../../DB/model/cart.model.js"
import { productModel } from "../../../../DB/model/product.model.js";

// clear cart
export const clearCartt = async(userId)=>{
  await cartModel.findOneAndUpdate({userId : userId},{products : []});
}

  // update stock
  export const updateStock = async(products,placeOrder)=>{
    // placeOrder >>>>>>>> true   false
    //true  >>>> place order
    // false   >>>>> cancel order
    if(placeOrder){
      for(const product of products){
        await productModel.findByIdAndUpdate(product.productId , {
          $inc : {
            availableItems : -product.quantity,
            soldItems : product.quantity
          }
        })
      }
    }else{
      for(const product of products){
        await productModel.findByIdAndUpdate(product.productId , {
          $inc : {
            availableItems : product.quantity,
            soldItems : -product.quantity
          }
        })
      }
    }
  }
