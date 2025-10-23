const mongoose = require('mongoose');
let contactSchema = new mongoose.Schema({
    contact_first_name: {
        type: String,
        required: true,
    },
    contact_last_name: {
        type: String,
        required: true,
    },
    contact_email: {
        type: String,
        required: true,
        unique: true,
    },

    contact_enquiry_type:{
        type: String,
        required: false,
        enum:["General_enquiry", "Product_Support", "Billing", "Selling_Art", "Other"],
        default: "General_enquiry",
    },
    contact_message: {
        type: String,
        required: true,
    },
    contactCreatedAt: {
        type:Date, 
        default: Date.now,
    },
    contactUpdatedAt: {
        type:Date, 
        default: Date.now,
    }
});

module.exports = mongoose.model('Contact', contactSchema);