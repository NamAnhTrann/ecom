const mongoose = require("mongoose");

const order_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },

  order_items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price_at_purchase: Number,
    },
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  order_status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Order", order_schema);
