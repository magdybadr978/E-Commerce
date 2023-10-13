import slugify from "slugify";
import { subCategoryModel } from "../../../../DB/model/subCategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import categoryModel from "../../../../DB/model/Category.model.js";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { messages } from "../../../utils/enum.js";

export const getAllSubCategories = async (req, res, next) => {
  const mongooseQuery = subCategoryModel.find(req.params).populate([
    {
      path: "categoryId",
    },
  ]);
  const api = new ApiFeatures(mongooseQuery, req.query)
    .pagination(subCategoryModel)
    .search()
    .filter()
    .select()
    .sort();
  const allSub = await api.mongooseQuery;
  res.status(200).json({
    success : true,
    message: "get all subCategories",
    allSub,
    Count: req.query.Count,
    total: req.query.total,
  });
};

export const addSubCategory = async (req, res, next) => {
  const { name, categoryId } = req.body;
  const checkCategory = await categoryModel.findById(categoryId);
  if (!checkCategory) {
    return next(
      new ErrorClass(messages.category.notFound, StatusCodes.NOT_FOUND)
    );
  }
  const isNameExist = await subCategoryModel.findOne({ name });
  if (isNameExist) {
    return next(
      new ErrorClass(messages.subCategory.alreadyExist, StatusCodes.CONFLICT)
    );
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "E-commerce/subCategory" }
  );
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    categoryId,
    image: { secure_url, public_id },
  });
  res.status(StatusCodes.CREATED).json({
    success : true,
    message: messages.subCategory.add,
    subCategory,
  });
};

export const deleteSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params;
  const checkSubCategory = await subCategoryModel.findById(subCategoryId);
  if (!checkSubCategory) {
    return next(
      new ErrorClass(messages.subCategory.notFound, StatusCodes.NOT_FOUND)
    );
  }
  await subCategoryModel.deleteOne({_id : subCategoryId})
  await cloudinary.uploader.destroy(checkSubCategory.image.public_id);
  const products = await productModel.find({ subCategoryId:subCategoryId  });
  for (let i = 0; i < products.length; i++) {
    await cloudinary.uploader.destroy(products[i].image.public_id);
  }
  await productModel.deleteMany({ subCategoryId: subCategoryId  });
  return res.status(StatusCodes.OK).json({
    success : true,
    message: messages.subCategory.delete,
  });
};

export const searchWithChar = async (req, res, next) => {
  const { char } = req.body;
  const search = await subCategoryModel.find({
    name: { $regex: `${char}`, $options: "i" },
  });
  res.status(StatusCodes.OK).json({
    success : true,
    message: messages.subCategory.search,
    search,
  });
};

export const updateSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params;
  const checkSub = await subCategoryModel.findById({ _id: subCategoryId });
  if (!checkSub) {
    return next(new ErrorClass(messages.subCategory.notFound, StatusCodes.NOT_FOUND));
  }
  if (req.body.name) {
    const isNameExist = await subCategoryModel.findOne({
      name: req.body.name,
      _id: { $ne: subCategoryId },
    });
    if (isNameExist) {
      return next(new ErrorClass(messages.subCategory.notFoundName, StatusCodes.NOT_FOUND));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "E-commerce/subCategory" }
    );
    await cloudinary.uploader.destroy(checkSub.image.public_id);
    req.body.image = { secure_url, public_id };
  }

  const updatesub = await subCategoryModel.updateOne(
    { _id: subCategoryId },
    req.body
  );
  return res.status(StatusCodes.OK).json({
    success : true,
    message: messages.subCategory.update,
    updatesub,
  });
};

export const getSubCategoryById = async (req, res, next) => {
  const { subCategoryId } = req.params;
  const getSub = await subCategoryModel.findById({ _id: subCategoryId });
  if (!getSub) {
    return next(
      new ErrorClass(messages.subCategory.notFound, StatusCodes.NOT_FOUND)
    );
  }
  res.status(StatusCodes.OK).json({
    success : true,
    message: "done",
    getSub,
  });
};
