import { Router } from "express";
import * as subCategoryController from "./controller/subCategory.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as val from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import auth from "../../middleware/auth.js";
import { isAuthorized } from "../../middleware/authorization.js";
const router = Router({ mergeParams: true });

router.post(
  "/addSubCategory",
  auth(),
  isAuthorized(["Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(val.addSubCategorySchema),
  asyncHandler(subCategoryController.addSubCategory)
);

router.get(
  "/getAllSubCategories",
  asyncHandler(subCategoryController.getAllSubCategories)
);

router.delete(
  "/deleteSubCategory/:subCategoryId",
  auth(),
  isAuthorized(["Admin"]),
  validation(val.deleteSubCategorySchema),
  asyncHandler(subCategoryController.deleteSubCategory)
);

router.get(
  "/searchWithChar",
  validation(val.searchSubCategorySchema),
  asyncHandler(subCategoryController.searchWithChar)
);

router.put(
  "/updateSubCategory/:subCategoryId",
  auth(),
  isAuthorized(["Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(val.updateSubCategorySchema),
  asyncHandler(subCategoryController.updateSubCategory)
);

router.get(
  "/getSubCategoryById/:subCategoryId",
  validation(val.getSubCategoryByIdSchema),
  asyncHandler(subCategoryController.getSubCategoryById)
);

export default router;
