const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
    validate: {
      validator: v => !v || typeof v === "string",
      message: "Invalid Google ID",
    }
  },

  // Only required if not Google auth
  user_password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    validate: {
      validator: function (value) {
        if (this.googleId) return true;
        return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value);
      },
      message:
        "Password must be at least 6 characters and contain both letters and numbers.",
    },
  },

  user_first_name: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: v => !v || /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v),
      message: props => `${props.value} is not a valid first name`,
    },
  },

  user_last_name: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: v => !v ||/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v),
      message: props => `${props.value} is not a valid last name`,
    },
  },

  user_email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email`,
    },
  },

  user_phone_number: {
    type: String,
    required: false,
    validate: {
      validator: v => !v || /^\+?[0-9]{7,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number`,
    },
  },

  user_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
    validate: {
      validator: v => !v || mongoose.Types.ObjectId.isValid(v),
      message: "Invalid address reference",
    },
  },

  user_profile_img: {
    type: String,
    required: false,
    validate: {
      validator: v =>
        !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v),
      message: "Invalid profile image URL",
    },
  },

  user_createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid createdAt date",
    },
  },

  user_role: {
    type: String,
    enum: ["admin", "seller", "buyer"],
    default: "buyer",
    validate: {
      validator: v => ["admin", "seller", "buyer"].includes(v),
      message: "Invalid user role",
    },
  },

  user_updatedAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid updatedAt date",
    },
  },

  refreshTokens: {
    type: String,
    required: false,
    validate: {
      validator: v => !v || typeof v === "string",
      message: "Invalid refresh token format",
    },
  },

  resetPasswordToken: {
    type: String,
    required: false,
    validate: {
      validator: v => !v || typeof v === "string",
      message: "Invalid reset token",
    },
  },

  resetPasswordExpires: {
    type: Date,
    required: false,
    validate: {
      validator: v => !v || v instanceof Date,
      message: "Invalid reset token expiration date",
    },
  },

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      validate: {
        validator: v => mongoose.Types.ObjectId.isValid(v),
        message: "Invalid product reference",
      },
    },
  ],

  user_status: {
    type: String,
    enum: ["online", "offline", "idle", "do not disturb"],
    default: "offline",
    validate: {
      validator: v =>
        ["online", "offline", "idle", "do not disturb"].includes(v),
      message: "Invalid user status",
    },
  },
});

// Indexes
user_schema.index({ user_email: 1 }, { unique: true });
user_schema.index({ googleId: 1 });
user_schema.index({ user_role: 1 });
user_schema.index({ refreshTokens: 1 });
user_schema.index({ user_status: 1 });

module.exports = mongoose.model("User", user_schema);
