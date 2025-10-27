const mongoose = require("mongoose");

let comment_schema = new mongoose.Schema({
  text: {
    type: String,
    required: false,
  },

  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  product_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
comment_schema.index({
  product_id: 1,
  createdAt: -1,
});
module.exports = mongoose.model("Comment", comment_schema);
