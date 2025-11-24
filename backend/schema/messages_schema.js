const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
  messages_content: {
    type: String,
  },

  message_status: {
    type: String,
    enum: ["seen", "sent"],
    default: "sent",
  },

  message_createdAt: {
    type: Date,
    default: Date.now,
  },

  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },

  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message_type: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  
});

messageSchema.index({ conversation_id: 1, message_createdAt: 1 });
messageSchema.index({ sender_id: 1 });
messageSchema.index({ receiver_id: 1 });


module.exports = mongoose.model("Message", messageSchema);
