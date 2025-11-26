const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
  product_title: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "Title must be at least 1 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },

  product_price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"]
  },

  product_desc: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "Description must be at least 1 characters"]
  },

  product_quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity cannot be negative"]
  },

  productUpdated: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid productUpdated date"
    }
  },

  product_img: {
    type: String,
    required: false,
    // validate: {
    //   validator: v => !v || /^https?:\/\/.+/i.test(v),
    //   message: "Main product image must be a valid URL"
    // }
  },

  product_extra_img: {
    type: String,
    required: false,
    // validate: {
    //   validator: v => !v || /^https?:\/\/.+/i.test(v),
    //   message: "Extra product image must be a valid URL"
    // }
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    validate: {
      validator: v => !v || mongoose.Types.ObjectId.isValid(v),
      message: "Invalid user reference"
    }
  },

  likes_count: {
    type: Number,
    default: 0,
    min: [0, "Likes cannot be negative"]
  },

  comments_count: {
    type: Number,
    default: 0,
    min: [0, "Comments cannot be negative"]
  }
});

// Indexes
productSchema.index({ user_id: 1 });
productSchema.index({ productUpdated: -1 });
productSchema.index({ likes_count: -1 });
productSchema.index({ comments_count: -1 });
productSchema.index({ product_title: "text" });

module.exports = mongoose.model("Product", productSchema);
