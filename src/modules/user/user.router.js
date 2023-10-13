import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as userController from "./controller/user.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./user.validation.js";
const router = Router();

router.post(
  "/signUp",
  fileUpload(fileValidation.image).single("image"),
  validation(Val.signUpSchema),
  asyncHandler(userController.signUp)
);

router.put("/confirmEmail", asyncHandler(userController.confirmEmail));

router.post(
  "/signIn",
  validation(Val.signInSchema),
  asyncHandler(userController.signIn)
);

router.put(
  "/sendCode",
  validation(Val.sendCodeSchema),
  asyncHandler(userController.sendCode)
);

router.put(
  "/resetPassword",
  validation(Val.resetPasswordSchema),
  asyncHandler(userController.resetPassword)
);

export default router;
