const path = require("path");

const express = require("express");

const adminController = require("../controllers/adminController");
const auth = require("../middleware/is-auth");
const router = express.Router();

// /admin/add-product => GET
// router.get("/add-product", adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:productId", auth, adminController.postEditProduct);

router.post("/edit-product", auth, adminController.postEditProduct);

router.post("/delete-product", auth, adminController.postDeleteProduct);

module.exports = router;
