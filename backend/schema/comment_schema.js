const mongoose = require("mongoose");

let comment_schema = new mongoose.Schema({
  text: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, "Comment cannot exceed 1000 characters"],
    validate: {
      validator: v => !v || typeof v === "string",
      message: "Invalid comment text"
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
      message: "Invalid creation timestamp"
    }
  }
});

// Indexes for fast loading and feed ordering
comment_schema.index({ product_id: 1, createdAt: -1 });
comment_schema.index({ user_id: 1 });

module.exports = mongoose.model("Comment", comment_schema);
