const express = require("express");
const router = express.Router();
const productController = require("../controller/product_controller");
const passport = require("passport");

router.get("/get/all/product/api", productController.listAllProduct);
router.get("/get/single/product/api/:id/", productController.listSingleProduct)

router.post('/post/product/api', passport.authenticate("jwt", { session: false }), productController.addProduct)
router.delete("/delete/many/products/api", passport.authenticate("jwt", { session: false }), productController.deleteAllProduct)
router.delete("/delete/single/product/api/:id", passport.authenticate("jwt", { session: false }), productController.deleteSingleProduct)
router.put("/update/single/product/api/:id", passport.authenticate("jwt", { session: false }), productController.updateSingleProduct)
module.exports = router;
