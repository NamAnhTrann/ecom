const express = require("express");
const router = express.Router();
const cart_controller = require("../controller/cart_controller");
const auth = require("../middleware/auth");

router.post("/cart/add/api", auth, cart_controller.add_cart_api);
router.get("/get/single/cart/api/", auth, cart_controller.list_cart)
router.delete("/delete/single/cart/item/api/:product_id", auth, cart_controller.deletePerItemInCart)


module.exports = router;
