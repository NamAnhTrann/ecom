const mongoose = require("mongoose");
//validator will be required later
let productSchema = new mongoose.Schema({
    product_title: {
        type:String,
        required: true,
    },
    
    product_price :{ 
        type: Number, 
        required: true
    },

    product_desc: {
        type:String, 
        required: true,
    },

    product_quantity: {
        type:Number, 
        required: true,
    },

    productUpdated: {
        type:Date, 
        default: Date.now
    },

    product_img: {
        type:String,
        required: false,
    },

    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    }

    // product_category:{
    //     type:String,
    //     enum: [""]
    // }

})

module.exports = mongoose.model("Product", productSchema)