const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
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
    min: [1, "Quantity must be at least 1"],
    max: [9999, "Quantity too large"],
    validate: {
      validator: v => Number.isInteger(v),
      message: "Quantity must be a whole number"
    }
  }
});


const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid user reference"
    }
  },

  items: {
    type: [cartItemSchema],
    validate: {
      validator: arr => Array.isArray(arr) && arr.length >= 0,
      message: "Items must be a valid array"
    }
  },

  total_price: {
    type: Number,
    default: 0,
    min: [0, "Total price cannot be negative"],
    validate: {
      validator: v => typeof v === "number" && v >= 0,
      message: "Invalid total price"
    }
  },

  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid creation timestamp"
    }
  },

  updatedAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid update timestamp"
    }
  }
});


module.exports = mongoose.model("Cart", cartSchema);
