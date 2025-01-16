const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.status(200).json({ status: "success", data: { products } });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Fetching products failed." });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res
          .status(404)
          .json({ status: "error", message: "Product not found." });
      }
      res.status(200).json({ status: "success", data: { product } });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Fetching product failed." });
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.status(200).json({ status: "success", data: { products } });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Fetching products failed." });
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      }));
      res.status(200).json({ status: "success", data: { products } });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Fetching cart failed." });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res
          .status(404)
          .json({ status: "error", message: "Product not found." });
      }
      return req.user.addToCart(product);
    })
    .then((result) => {
      res
        .status(200)
        .json({
          status: "success",
          message: "Product added to cart.",
          data: result,
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Adding to cart failed." });
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res
        .status(200)
        .json({
          status: "success",
          message: "Product removed from cart.",
          data: result,
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Removing from cart failed." });
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: { ...i.productId._doc },
      }));
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => {
      res
        .status(201)
        .json({ status: "success", message: "Order placed successfully." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Placing order failed." });
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.status(200).json({ status: "success", data: { orders } });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ status: "error", message: "Fetching orders failed." });
    });
};
