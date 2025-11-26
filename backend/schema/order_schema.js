const mongoose = require("mongoose");

const order_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid user reference"
    }
  },

  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid cart reference"
    }
  },

  order_items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        validate: {
          validator: v => mongoose.Types.ObjectId.isValid(v),
          message: "Invalid product reference"
        }
      },

      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
      },

      price_at_purchase: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
      }
    }
  ],

  total_amount: {
    type: Number,
    required: true,
    min: [0, "Total amount cannot be negative"]
  },

  order_status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
    validate: {
      validator: v => ["pending", "paid", "cancelled"].includes(v),
      message: "Invalid order status"
    }
  },

  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: false,
    validate: {
      validator: v => !v || mongoose.Types.ObjectId.isValid(v),
      message: "Invalid payment reference"
    }
  },

  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid createdAt date"
    }
  }
});

module.exports = mongoose.model("Order", order_schema);
