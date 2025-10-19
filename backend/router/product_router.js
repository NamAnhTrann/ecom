const express = require("express");
const router = express.Router();
const productController = require("../controller/product_controller");

router.get("/get/all/product/api", productController.listAllProduct);
router.get("/get/single/product/api/:id/", productController.listSingleProduct)
router.post('/post/product/api', productController.addProduct)
router.delete("/delete/many/products/api", productController.deleteAllProduct)
router.delete("/delete/single/product/api/:id", productController.deleteSingleProduct)
router.put("/update/single/product/api/:id", productController.updateSingleProduct)
module.exports = router;
