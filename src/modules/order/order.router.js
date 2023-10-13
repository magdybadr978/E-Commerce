import { Router } from "express";
import auth from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./order.validation.js";
import * as orderController from "./controller/order.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { isAuthorized, roles } from "../../middleware/authorization.js";
const router = Router();

//create order
router.post(
  "/createOrder",
  auth(),
  isAuthorized([roles.user]),
  //fileUpload(fileValidation.file).single("file"),
  validation(Val.createOrderSchema),
  asyncHandler(orderController.createOrder)
);

//cancel order
router.put(
  "/cancelOrder/:orderId",
  auth(),
  validation(Val.cancelOrderSchema),
  asyncHandler(orderController.cancelOrder)
);

export default router;
