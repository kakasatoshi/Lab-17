const mongoose = require("mongoose");
const fileHelper = require("../util/file");
const { validationResult } = require("express-validator");

const Product = require("../models/product");

// Add a product
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).json({
      message: "Attached file is not an image.",
      product: { title, price, description },
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      product: { title, price, description },
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: "Product created successfully!", product });
    })
    .catch((err) => {
      res.status(500).json({ message: "Creating product failed.", error: err });
    });
};

// Edit a product
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized." });
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;

      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      return product.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Product updated successfully!", product: result });
    })
    .catch((err) => {
      res.status(500).json({ message: "Updating product failed.", error: err });
    });
};

// Get all products for the admin
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.status(200).json({ products });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Fetching products failed.", error: err });
    });
};

// Delete a product
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json({ message: "Product deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed.", error: err });
    });
};
