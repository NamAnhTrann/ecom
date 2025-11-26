const mongoose = require('mongoose');

let contactSchema = new mongoose.Schema({
  contact_first_name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => !v || /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v),
      message: props => `${props.value} is not a valid first name`,
    },
  },

  contact_last_name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => !v || /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(v),
      message: props => `${props.value} is not a valid last name`,
    },
  },

  contact_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email`
    }
  },

contact_enquiry_type: {
  type: String,
  enum: ["General_enquiry", "Product_Support", "Billing", "Selling_Art", "Other"],
  default: "General_enquiry",
  validate: {
    validator: function (v) {
      return ["General_enquiry", "Product_Support", "Billing", "Selling_Art", "Other"].includes(v);
    },
    message: props => `${props.value} is not a valid enquiry type`
  }
},

  contact_message: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "Message must be at least 1 characters long"]
  },

  contactCreatedAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid creation date"
    }
  },

  contactUpdatedAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: v => v instanceof Date,
      message: "Invalid update date"
    }
  }
});

// Index for fast search by email
contactSchema.index({ contact_email: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);
