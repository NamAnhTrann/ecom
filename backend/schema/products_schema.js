const mongoose = require("mongoose");
//validator will be required later
let productSchema = new mongoose.Schema({
  product_title: {
    type: String,
    required: true,
  },

  product_price: {
    type: Number,
    required: true,
  },

  product_desc: {
    type: String,
    required: true,
  },

  product_quantity: {
    type: Number,
    required: true,
  },

  productUpdated: {
    type: Date,
    default: Date.now,
  },

  product_img: {
    type: String,
    required: false,
  },

  product_extra_img:{
    type:String,
    required:false
  },
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  likes_count: {
    type: Number,
    default: 0,
  },

  comments_count: {
    type: Number,
    default: 0,
  },

  // product_category:{
  //     type:String,
  //     enum: [""]
  // }
});


//add indexes
productSchema.index({ user_id: 1 });           
productSchema.index({ productUpdated: -1 });    
productSchema.index({ likes_count: -1 });         
productSchema.index({ comments_count: -1 });      
productSchema.index({ product_title: "text" }); 

module.exports = mongoose.model("Product", productSchema);
