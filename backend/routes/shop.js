const path = require("path");

const express = require("express");

const shopController = require("../controllers/shopController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);
// router.get("/cart",  shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cartDeleteItem", isAuth, shopController.postCartDeleteProduct);

router.post("/createOrder", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
