const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
  messages_content: {
    type: String,
    required: function () {
      // Text messages must have content
      return this.message_type === "text";
    },
    trim: true,
    validate: {
      validator: function (v) {
        if (this.message_type !== "text") return true; 
        return v && v.length > 0;
      },
      message: "Text messages cannot be empty"
    }
  },

  message_status: {
    type: String,
    enum: ["seen", "sent"],
    default: "sent",
    validate: {
      validator: v => ["seen", "sent"].includes(v),
      message: "Invalid message status"
    }
  },

  message_createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid message creation date"
    }
  },

  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid conversation reference"
    }
  },

  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid sender reference"
    }
  },

  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: v => mongoose.Types.ObjectId.isValid(v),
      message: "Invalid receiver reference"
    }
  },

message_type: {
  type: String,
  enum: ["text", "image", "file"],
  default: "text",
  validate: {
    validator: function (v) {
      const value = this.messages_content;

      if (v === "text") {
        // text must NOT look like a file path
        return !value || !/\.(png|jpg|jpeg|gif|pdf|docx?|xlsx?)$/i.test(value);
      }

      if (v === "image") {
        // image must end with a valid image extension
        return typeof value === "string" &&
               /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(value);
      }

      if (v === "file") {
        // file must be a document or binary file
        return typeof value === "string" &&
               /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar)$/i.test(value);
      }

      return false;
    },
    message: (props) => `Invalid content for message type: ${props.value}`
  }
}

});

messageSchema.index({ conversation_id: 1, message_createdAt: 1 });
messageSchema.index({ sender_id: 1 });
messageSchema.index({ receiver_id: 1 });

module.exports = mongoose.model("Message", messageSchema);
