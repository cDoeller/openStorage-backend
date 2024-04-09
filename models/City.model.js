const mongoose = require("mongoose")

const citySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    artworksList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Artwork"
    }]

})

const City = mongoose.model("City", citySchema)

module.exports = City