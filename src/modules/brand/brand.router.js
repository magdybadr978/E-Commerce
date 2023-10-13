import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as val from "./brand.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as BrandController from "./controller/brand.js";
import auth from "../../middleware/auth.js";
import { isAuthorized } from "../../middleware/authorization.js";
const router = Router();

router.get("/getAllBrands", asyncHandler(BrandController.getAllBrands));

router.post(
  "/addBrand",
  auth(),
  isAuthorized(["Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(val.addBrandSchema),
  asyncHandler(BrandController.addBrand)
);

router.delete(
  "/deleteBrand/:brandId",
  auth(),
  isAuthorized(["Admin"]),
  validation(val.deleteBrandSchema),
  asyncHandler(BrandController.deleteBrand)
);

router.put(
  "/updateBrand/:brandId",
  auth(),
  isAuthorized(["Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(val.updateBrandSchema),
  asyncHandler(BrandController.updateBrand)
);

router.get(
  "/getBrand/:brandId",
  validation(val.getBrandSchema),
  asyncHandler(BrandController.getBrand)
);

export default router;
