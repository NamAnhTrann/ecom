const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
  },

  // hashed before stored
  user_password: {
    type: String,
    required: function () {
      return !this.googleId; 
    },
  },

  user_first_name: {
    type: String,
    required: false,
  },
  user_last_name: {
    type: String,
    required: false,
  },

  user_email: {
    type: String,
    required: true,
  },
  user_phone_number: {
    type: String,
    required: false,
  },

  user_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
  },

  user_profile_img: {
    type: String,
    required: false,
  },

  user_createdAt: {
    type: Date,
    default: Date.now,
  },

  user_role: {
    type: String,
    enum: ["admin", "seller", "buyer"],
    default: "buyer",
  },

  user_updatedAt: {
    type: Date,
    default: Date.now,
  },

  refreshTokens: {
    type: String,
  },
});

module.exports = mongoose.model("User", user_schema);
