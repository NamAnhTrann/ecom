const express = require("express");
const router = express.Router();
const orderController = require("../controller/order_controller");
const auth = require("../middleware/auth");


router.post(
  "/order/create/api",
  auth,
  orderController.create_order
);

router.post(
  "/order/create-checkout-session",
  auth,
  orderController.create_checkout_session
);

router.get(
  "/list/single/order/api/", auth, orderController.listSingleOrder
)

module.exports = router;
