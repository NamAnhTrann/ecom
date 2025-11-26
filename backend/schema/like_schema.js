const mongoose = require("mongoose");

const like_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid user reference"
    }
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid product reference"
    }
  },

  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid like creation date"
    }
  }
});

// prevent duplicate like from same user
like_schema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("Like", like_schema);
