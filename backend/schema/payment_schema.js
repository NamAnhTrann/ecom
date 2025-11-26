const mongoose = require("mongoose");

const payment_schema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid order reference"
    }
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid user reference"
    }
  },

  amount: {
    type: Number,
    required: true,
    min: [0, "Payment amount cannot be negative"]
  },

  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
    validate: {
      validator: v => ["pending", "completed", "failed"].includes(v),
      message: "Invalid payment status"
    }
  },

  transaction_id: {
    type: String,
    required: false,
    trim: true,
    // validate: {
    //   validator: v => !v || typeof v === "string",
    //   message: "Invalid transaction ID format"
    // }
  },

  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid payment creation date"
    }
  }
});

module.exports = mongoose.model("Payment", payment_schema);
