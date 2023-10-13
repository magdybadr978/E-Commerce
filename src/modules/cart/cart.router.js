import { Router } from "express";
import auth from "../../middleware/auth.js";
import * as cartController from "./controller/cart.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./cart.validation.js";
const router = Router();

router.get(
  "/userCart",
  auth(),
  isAuthorized(["User"]),
  asyncHandler(cartController.userCart)
);

router.post(
  "/addToCart",
  auth(),
  isAuthorized(["User"]),
  validation(Val.CartSchema),
  asyncHandler(cartController.addToCart)
);

router.put(
  "/updateCart",
  auth(),
  validation(Val.CartSchema),
  asyncHandler(cartController.updateCart)
);

router.put("/clearCart", auth(), asyncHandler(cartController.clearCart));

router.put(
  "/removeProduct/:productId",
  auth(),
  validation(Val.removeProductSchema),
  asyncHandler(cartController.removeProduct)
);

export default router;
