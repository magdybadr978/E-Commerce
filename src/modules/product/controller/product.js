import categoryModel from "../../../../DB/model/Category.model.js";
import { brandModel } from "../../../../DB/model/brand.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { subCategoryModel } from "../../../../DB/model/subCategory.model.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import QRcode from "qrcode";
import { ErrorClass } from "../../../utils/ErrorClass.js";
import { StatusCodes } from "http-status-codes";
import { pagination } from "../../../utils/pagination.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import { messages } from "../../../utils/enum.js";

export const addProduct = async (req, res, next) => {
  const checkName = await productModel.findOne({ name: req.body.name });
  if (checkName) {
    checkName.stock += Number(req.body.quantity);
    await checkName.save();
    return res
      .status(200)
      .json({ message: messages.product.add, product: checkName });
  }
  const checkCategory = await categoryModel.findById(req.body.categoryId);
  if (!checkCategory) {
    return next(new ErrorClass(messages.product.CatNotFound, StatusCodes.NOT_FOUND));
  }
  const checkSubCategory = await subCategoryModel.findById(
    req.body.subCategoryId
  );
  if (!checkSubCategory) {
    return next(
      new ErrorClass(messages.product.subNotFound, StatusCodes.NOT_FOUND)
    );
  }
  const checkBrand = await brandModel.findById(req.body.brandId);
  if (!checkBrand) {
    return next(new ErrorClass(messages.product.brandNotFound, StatusCodes.NOT_FOUND));
  }
  req.body.slug = slugify(req.body.name);
  if (req.body.quantity) {
    req.body.stock = req.body.quantity;
  }
  req.body.paymentPrice =
    req.body.price - req.body.price * ((req.body.discount || 0) / 100);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    { folder: "E-commerce/product/image" }
  );
  req.body.image = { secure_url, public_id };
  if (req.files.coverImages.length) {
    const coverImages = [];
    for (let i = 0; i < req.files.coverImages.length; i++) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.coverImages[i].path,
        { folder: "E-commerce/product/covers" }
      );
      coverImages.push({ secure_url, public_id });
    }
    req.body.coverImages = coverImages;
  }
  if (req.body.sizes) {
    req.body.sizes = JSON.parse(req.body.sizes);
  }
  if (req.body.colors) {
    req.body.colors = JSON.parse(req.body.colors);
  }
  req.body.QRcode = await QRcode.toDataURL(
    JSON.stringify({
      name: req.body.name,
      description: req.body.description,
      imageURL: req.body.image.secure_url,
      price: req.body.price,
      paymentPrice: req.body.paymentPrice,
    })
  );
  req.body.createdBy = req.user._id;
  const product = await productModel.create(req.body);
  res.status(200).json({
    success: true,
    message: messages.product.add,
    product,
  });
};


export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const checkProduct = await productModel.findByIdAndDelete({ _id: productId });
  if (!checkProduct) {
    return next(new ErrorClass(messages.product.productNotFound,StatusCodes.NOT_FOUND));
  }
  //console.log(checkProduct);
  await cloudinary.uploader.destroy(checkProduct.image.public_id);

  if (checkProduct.coverImages.length) {
    for (let i = 0; i < checkProduct.coverImages.length; i++) {
      await cloudinary.uploader.destroy(checkProduct.coverImages[i].public_id);
    }
  }
  return res.status(200).json({
    success: true,
    message: messages.product.delete,
  });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const isExist = await productModel.findById({ _id: productId });
  if (!isExist) {
    return next(new ErrorClass(messages.product.productNotFound, StatusCodes.NOT_FOUND));
  }
  //console.log({isExist});
  if (req.body.name) {
    const checkProduct = await productModel.findOne({
      _id: { $ne: productId },
      name: req.body.name,
    });
    if (checkProduct) {
      return next(
        new ErrorClass(
          messages.product.NotAllowed,
          StatusCodes.FORBIDDEN
        )
      );
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.files.image?.length) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.image[0].path,
      { folder: "E-commerce/product/image" }
    );
    req.body.image = { secure_url, public_id };
  }
  if (req.files.coverImages?.length) {
    const coverImages = [];
    for (let i = 0; i < req.files.coverImages.length; i++) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.coverImages[i].path,
        { folder: "E-commerce/product/covers" }
      );
      coverImages.push({ secure_url, public_id });
    }
    req.body.coverImages = coverImages;
  }

  const updateProduct = await productModel.updateOne(
    { _id: productId },
    req.body
  );
  await cloudinary.uploader.destroy(isExist.image.public_id);
  for (let i = 0; i < isExist.coverImages.length; i++) {
    await cloudinary.uploader.destroy(isExist.coverImages[i].public_id);
  }
  return res.status(200).json({
    success: true,
    message: messages.product.update
  });
};

export const getAllProducts = async (req, res, next) => {
  const mongooseQuery = productModel.find().populate({ path : "brandId"});
  const apiFeatures = new ApiFeatures(mongooseQuery, req.query)
    .filter()
    .sort()
    .search()
    .select()
    .pagination(productModel);

  const products = await apiFeatures.mongooseQuery;
  //console.log({ products, Count: req.query.Count, total: req.query.total });
  res.status(StatusCodes.ACCEPTED).json({
    message: "done",
    products,
    value: req.query.value,
    total: req.query.total,
  });
};
