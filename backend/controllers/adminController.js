const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.status(200).json({
    message: 'Add product page',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).json({
      success: false,
      message: 'Attached file is not an image.',
      product: { title, price, description },
      validationErrors: []
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()[0].msg,
      product: { title, price, description },
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl: image.path,
    userId: req.user
  });
  product
    .save()
    .then(() => res.status(201).json({ success: true, message: 'Product created!' }))
    .catch(err => next(new Error(err)));
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      res.status(200).json({ success: true, product });
    })
    .catch(err => next(new Error(err)));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
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
    .then(() => res.status(200).json({ success: true, message: 'Product updated!' }))
    .catch(err => next(new Error(err)));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => res.status(200).json({ success: true, products }))
    .catch(err => next(new Error(err)));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => res.status(200).json({ success: true, message: 'Product deleted!' }))
    .catch(err => next(new Error(err)));
};
