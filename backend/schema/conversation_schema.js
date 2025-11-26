const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: v => mongoose.Types.ObjectId.isValid(v),
        message: "Invalid participant user ID"
      }
    }
  ],

  last_message: {
    type: String,
    trim: true,
    validate: {
      validator: v => !v || typeof v === "string",
      message: "Last message must be a text string"
    }
  },

  last_updatedAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid last_updatedAt timestamp"
    }
  }
});

// Conversations should never have fewer than 2 participants
conversationSchema.pre("save", function (next) {
  if (this.participants.length < 2) {
    return next(new Error("A conversation must have at least two participants"));
  }
  next();
});

// Indexes for fast chat loading
conversationSchema.index({ participants: 1 });
conversationSchema.index({ last_updatedAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
