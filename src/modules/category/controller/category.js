import slugify from "slugify";
import cloudinary from "./../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import { subCategoryModel } from "../../../../DB/model/subCategory.model.js";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { messages } from "../../../utils/enum.js";
import categoryModel from "../../../../DB/model/Category.model.js";

export const addCategory = async (req, res, next) => {
  // get data from request
  const { name } = req.body;
  const userId = req.user._id;
  // check if category exist
  const isExist = await categoryModel.findOne({ name });
  if (isExist) {
    return next(
      new ErrorClass(messages.category.alreadyExist, StatusCodes.BAD_REQUEST)
    );
  }
  // add slug to name
  const slug = slugify(name, { trim: true });
  // upload image for category
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "E-commerce/category" }
  );
  // create category
  const category = await categoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy: userId,
  });
  // send response
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: messages.category.add, category });
};

/**
 *
 * add category with (preReview and save )
 */

export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const isExist = await categoryModel.findById({ _id: categoryId });
  if (!isExist) {
    return next(
      new ErrorClass(messages.category.notFound, StatusCodes.NOT_FOUND)
    );
  }
  if (req.body.name) {
    const checkCategory = await categoryModel.findOne({
      _id: { $ne: categoryId },
      name: req.body.name,
    });
    if (checkCategory) {
      return next(
        ErrorClass(messages.category.notAllow, StatusCodes.FORBIDDEN)
      );
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "E-commerce/category" }
    );
    await cloudinary.uploader.destroy(isExist.image.public_id);
    req.body.image = { secure_url, public_id };
  }

  const update = await categoryModel.updateOne({ _id: categoryId }, req.body);
  res.status(200).json({
    success: true,
    message: messages.category.update,
    update,
  });
};

export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const isExist = await categoryModel.findByIdAndDelete({ _id: categoryId });
  if (!isExist) {
    return next(
      new ErrorClass(messages.category.notFound, StatusCodes.CONFLICT)
    );
  }
  await cloudinary.uploader.destroy(isExist.image.public_id);
  const subCategories = await subCategoryModel.find({ categoryId }); // []   [{}]
  for (let i = 0; i < subCategories.length; i++) {
    await cloudinary.uploader.destroy(subCategories[i].image.public_id);
  }
  const products = await productModel.find({ categoryId });
  for (let i = 0; i < products.length; i++) {
    await cloudinary.uploader.destroy(products[i].image.public_id);
  }
  await subCategoryModel.deleteMany({ categoryId: categoryId });
  await productModel.deleteMany({ categoryId : categoryId});
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "done",
  });
};

export const getAllCategories = async (req, res, next) => {
  const categories = await categoryModel
    .find()
    .populate([{ path: "subCategories" , select : 'name'}]);
  res.status(200).json({
    success: true,
    message: "get all categories",
    categories,
    // value: req.query.value,
    // total: req.query.total,
  });
};

export const searchWithChar = async (req, res, next) => {
  const { char } = req.body;
  const search = await categoryModel.find({
    name: { $regex: `${char}`, $options: "i" },
  });
  res.status(200).json({
    success: true,
    message: "search",
    search,
  });
};

export const getCategoryById = async (req, res, next) => {
  const { categoryId } = req.params;
  const findcategory = await categoryModel.findOne({ _id: categoryId });
  if (!findcategory) {
    return next(new ErrorClass("category not found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "get category by id",
    findcategory,
  });
};
