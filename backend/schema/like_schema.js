const mongoose =require("mongoose");

const like_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },

    product_id:{
        type: mongoose.Schema.ObjectId,
        ref:"Product",
        required: true
    },

    createdAt: {
        type:Date,
        default:Date.now
    }
})

//prevent duplicate issue from the same user (fuck this issue)
like_schema.index({user_id:1, product_id: 1}, {unique:true});

module.exports=mongoose.model("Like", like_schema)