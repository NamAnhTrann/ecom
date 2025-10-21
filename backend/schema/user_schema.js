const mongoose = require("mongoose");

user_schema = new mongoose.Schema({
    //hashed before stored
    user_password: {
        type: String,
        required: true
    },

    user_first_name:{
        type:String,
        required: true,
    },
    user_last_name:{
        type:String,
        required: true,
    },

    user_email:{
        type:String,
        required: true,
        unique: true,
    },
    user_phone_number:{
        type:String,
        required: false,
        unique:true,
    },

    user_address:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: false,
    },

    user_profile_img:{
        type:String,
        required: false,
    },

    user_createdAt:{
        type:Date,
        default: Date.now
    },

    user_role:{
        type:String,
        enum:["admin", "user"],
        default: "user"
    },

    user_updatedAt:{
        type:Date,
        default: Date.now
    },

    user_refresh_token:{
        type:String,
    },


})