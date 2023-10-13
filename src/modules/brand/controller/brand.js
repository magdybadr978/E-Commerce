import { StatusCodes } from "http-status-codes";
import { brandModel } from "../../../../DB/model/brand.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import { messages } from "../../../utils/enum.js";

export const addBrand = async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user._id;
  const checkBrand = await brandModel.findOne({ name });
  if (checkBrand) {
    return next(
      new ErrorClass(messages.brand.alreadyExist, StatusCodes.CONFLICT)
    );
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "E-commerce/Brand" }
  );
  const brand = await brandModel.create({
    name,
    slug: slugify(name),
    image: { secure_url, public_id },
    createdBy: userId,
  });
  return res.status(200).json({
    success: true,
    message: messages.brand.add,
    brand,
  });
};

export const deleteBrand = async (req, res, next) => {
  const { brandId } = req.params;
  const brandExist = await brandModel.findByIdAndDelete({ _id: brandId });
  if (!brandExist) {
    return next(new ErrorClass(messages.brand.notFound, StatusCodes.NOT_FOUND));
  }
  await cloudinary.uploader.destroy(brandExist.image.public_id);
  const products = await productModel.find({ brandId }); // []   [{}]
  for (let i = 0; i < products.length; i++) {
    await cloudinary.uploader.destroy(products[i].image.public_id);
    if (products[i].coverImages.length) {
      for (let j = 0; j < products[i].coverImages.length; j++) {
        await cloudinary.uploader.destroy(products[i].coverImages[j].public_id);
      }
    }
  }
  await productModel.deleteMany({ brandId: brandId });
  return res.status(200).json({
    success : true,
    message: messages.brand.delete,
  });
};

export const updateBrand = async (req, res, next) => {
  const { brandId } = req.params;
  const IdExist = await brandModel.findById({ _id: brandId });
  if (!IdExist) {
    return next(
      new ErrorClass(messages.brand.notFoundName, StatusCodes.NOT_FOUND)
    );
  }
  if (req.body.name) {
    const brandExist = await brandModel.findOne({
      name: req.body.name,
      _id: { $ne: brandId },
    });
    if (brandExist) {
      return next(new ErrorClass(messages.brand.notFound, StatusCodes.NOT_FOUND));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "E-commerce/Brand" }
    );
    await cloudinary.uploader.destroy(IdExist.image.public_id);
    req.body.image = { secure_url, public_id };
  }

  await brandModel.updateOne({ _id: brandId }, req.body);
  return res.status(200).json({
    success : true,
    message: messages.brand.update
  });
};

export const getAllBrands = async (req, res, next) => {
  const mongosseQuery = brandModel.find();
  const api = new ApiFeatures(mongosseQuery, req.query)
    .pagination(brandModel)
    .filter()
    .search()
    .select()
    .sort();
  const brands = await api.mongooseQuery;
  return res.status(200).json({
    success : true,
    message: "done",
    brands,
    value: req.query.value,
    total: req.query.total,
  });
};

export const getBrand = async (req, res, next) => {
  const { brandId } = req.params;
  const isExist = await brandModel.findById({ _id: brandId });
  if (!isExist) {
    return next(new ErrorClass(messages.brand.notFound, StatusCodes.NOT_FOUND));
  }
  return res.status(200).json({
    message: "done",
    isExist,
  });
};
