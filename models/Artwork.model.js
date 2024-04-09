const mongoose = require("mongoose")

const artworkSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    year:{
        type:Number
    },
    city:{
        type:String,
        required:true
    },
    dimensions:{
        x:{
            type:Number,
            required:true,
            min:1
        },
        y:{
            type:Number,
            required:true,
            min:1
        },
        z:{
            type:Number,
            default:0,
            min:0
        }
        
    },
    images_url:{
        type:[String],
        required:true,
        trim:true // does trim work on string array?
    },
    artist:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    medium:{
        type:String,
        enum:["Painting", "Sculpture", "Photography"]
    },
    genre:{
        type:String,
        enum:["Conceptual Art", "Surrealism"]
    },
    borrowedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    returnDate:Date,
    isForSale:{
        type:Boolean,
        default:false
    }
})

const Artwork = mongoose.model("Artwork", artworkSchema)

module.exports = Artwork