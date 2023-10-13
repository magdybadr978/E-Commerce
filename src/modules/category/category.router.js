import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./category.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import subcategoryRouter from "../subcategory/subcategory.router.js";
import auth from "../../middleware/auth.js";
import { isAuthorized } from "../../middleware/authorization.js";
const router = Router();

router.use("/:categoryId/subcategory", subcategoryRouter);
// why use (to use all routers in this url)
router.post(
  "/",
  auth(),
  isAuthorized(["Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(Val.addCategorySchema),
  categoryController.addCategory
);

router.post(
  "/save",
  fileUpload(fileValidation.image).single("image"),
  validation(Val.addCategorySchema),
  asyncHandler(categoryController.addCategorySava)
);

router.put(
  "/:categoryId",
  auth(),
  isAuthorized(["User", "Admin"]),
  fileUpload(fileValidation.image).single("image"),
  validation(Val.updateCategorySchema),
  asyncHandler(categoryController.updateCategory)
);
router.delete(
  "/:categoryId",
  auth(),
  isAuthorized(["User", "Admin"]),
  validation(Val.deleteCategorySchema),
  asyncHandler(categoryController.deleteCategory)
);

router.get(
  "/allCategories",
  asyncHandler(categoryController.getAllCategories)
);

router.get(
  "/searchWithChar",
  validation(Val.searchWithCharSchema),
  asyncHandler(categoryController.searchWithChar)
);

router.get(
  "/getCategoryById/:categoryId",
  auth(),
  validation(Val.getCategoryByIdSchema),
  asyncHandler(categoryController.getCategoryById)
);

export default router;
