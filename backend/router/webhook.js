const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../schema/order_schema");
const Payment = require("../schema/payment_schema");
const Product = require("../schema/products_schema");
const Cart = require("../schema/cart_schema");

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    const signature = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(" Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.order_id;

      const order = await Order.findById(orderId).populate("order_items.product_id");
      if (!order) {
        console.error(`[Webhook] Order not found: ${orderId}`);
        return res.status(404).json({ message: "Order not found" });
      }

      //  Create payment record
      const payment = await Payment.create({
        order_id: order._id,
        user_id: order.user_id,
        amount: session.amount_total / 100,
        payment_method: "card",
        payment_status: "completed",
        transaction_id: session.payment_intent,
      });

      //  Mark order as paid
      order.order_status = "paid";
      order.payment_id = payment._id;
      await order.save();

      // Deduct product stock
      for (const item of order.order_items) {
        const product = await Product.findById(item.product_id._id);
        if (product) {
          product.product_quantity = Math.max(0, product.product_quantity - item.quantity);
          await product.save();
        }
      }

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { user_id: order.user_id },
        { $set: { items: [], total_price: 0 } }
      );
      console.log(`[Webhook] Order ${orderId} paid successfully`);
    }

    return res.status(200).json({ received: true });
  }
);

module.exports = router;
