import { Router } from "express";
import auth from "../../middleware/auth.js";
import { isAuthorized } from "../../middleware/authorization.js";
import * as Val from "./coupon.validation.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as couponController from "./controller/coupon.js";
const router = Router();

router.post(
  "/addCoupon",
  auth(),
  isAuthorized(["Admin"]),
  validation(Val.addCouponSchema),
  asyncHandler(couponController.addCoupon)
);

router.put(
  "/updateCoupon/:code",
  auth(),
  isAuthorized(["Admin"]),
  validation(Val.updateCouponSchema),
  asyncHandler(couponController.updateCoupon)
);

router.delete(
  "/deleteCoupon/:code",
  auth(),
  isAuthorized(["Admin"]),
  validation(Val.deleteCouponSchema),
  asyncHandler(couponController.deleteCoupon)
);

router.get(
  "/getAllCoupons",
  auth(),
  isAuthorized(["Admin"]),
  asyncHandler(couponController.getAllCoupons)
);

export default router;
