let locationSchema = new mongoose.Schema({
    location_city:{
        type:String,
        required: false,
    },

    location_street:{
        type:String,
        required: false,
    },

    location_zipcode:{
        type:String,
        required: false,
    },
    location_country:{
        type:String,
        required: false,
    },

    location_state:{
        type:String,
        required: false,
    },
    location_updateAt:{
        type:Date,
        default: Date.now
    },
    location_createdAt:{
        type:Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Location", locationSchema)