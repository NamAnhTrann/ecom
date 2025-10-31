const express = require("express");
const router = express.Router();
const productController = require("../controller/product_controller");
const passport = require("passport");
const auth = require("../middleware/auth");

router.get("/get/all/product/api", auth, productController.listAllProduct);
router.get(
  "/get/single/product/api/:id/",
  auth,
  productController.listSingleProduct
);

router.post("/post/product/api", auth, productController.addProduct);
router.delete(
  "/delete/many/products/api",
  auth,
  productController.deleteAllProduct
);
router.delete(
  "/delete/single/product/api/:id",
  auth,
  productController.deleteSingleProduct
);
router.put(
  "/update/single/product/api/:id",
  auth,
  productController.updateSingleProduct
);
module.exports = router;
