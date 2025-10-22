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
        required: true,
        enum:["General_enquiry", "Product_Support", "Billing", "Selling_Art", "Other"]
    },
    contact_message: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Contact', contactSchema);