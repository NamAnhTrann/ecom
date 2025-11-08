const mongoose = require("mongoose");

const payment_schema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },

  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  transaction_id: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", payment_schema);
