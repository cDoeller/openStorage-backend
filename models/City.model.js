const mongoose = require("mongoose")

const citySchema = new mongoose.Schema({
    user:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    },
    artworks:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Artwork"
    }

})

const City = mongoose.model("City", citySchema)

module.exports = City