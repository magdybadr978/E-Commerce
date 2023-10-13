import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as productController from "./controller/product.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as val from "./product.validation.js";
import auth from "../../middleware/auth.js";
import { isAuthorized } from "../../middleware/authorization.js";
const router = Router();

router.post(
  "/addProduct",
  auth(),
  isAuthorized(["Admin"]),
  fileUpload(fileValidation.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 5 },
  ]),
  validation(val.addProductSchema),
  asyncHandler(productController.addProduct)
);

router.delete(
  "/deleteProduct/:productId",
  validation(val.productIdSchema),
  asyncHandler(productController.deleteProduct)
);

router.put(
  "/updateProduct/:productId",
  fileUpload(fileValidation.image).fields([
    { name: "image" },
    { name: "coverImages" },
  ]),
  validation(val.productIdSchema),
  asyncHandler(productController.updateProduct)
);

router.get("/getAllProducts", asyncHandler(productController.getAllProducts));

export default router;
