const Artwork = require("../models/Artwork.model")
const User = require("../models/User.model")

const router = require("express").Router()

// GET all artworks
router.get("/", (req,res)=>{
    Artwork.find()
    .populate("artist")
    .then((Artworks)=>{
        console.log(Artworks)
        res.json(Artworks)
    })
    .catch((err)=>{
        console.log(err)
        res.json(err)
    })
})


// GET one artwork by id
router.get("/:id", (req,res)=>{
    Artwork.findById(req.params.id)
    .populate("artist")
    .then((oneArtwork)=>{
        console.log(oneArtwork)
        res.json(oneArtwork)
    })
    .catch((err)=>{
        console.log(err)
    })
})

// // POST a new artwork
// router.post("/", (req,res)=>{
//     Artwork.create(req.body)
//     .then((newArtwork)=>{
//         console.log(newArtwork)
//         res.json(newArtwork)
//     })
//     .catch((err)=>{
//         console.log(err)
//         res.json(err)
//     })
// })

// POST a new artwork async

router.post("/", async (req,res)=>{
    try{
        const newArtwork = await Artwork.create(req.body)
        const artist = await User.findById(newArtwork._id)
        .then((artist)=>{
            artist.artworks.push(newArtwork._id)
        })
        .catch((err)=>{
            console.log(err)
        })
        res.json(newArtwork)

    } catch(err){
        console.log(err)
        res.json(err)
    }
})


// DELETE one artwork
router.delete("/:id", (req,res)=>{
    Artwork.findByIdAndDelete(req.params.id)
    .then((deletedArtwork)=>{
        console.log(deletedArtwork)
        res.json(deletedArtwork)
    })
    .catch((err)=>{
        console.log(err)
        res.json(err)
    })
})



module.exports = router


// {
//     "title": "Dreamscape",
// "year": 2023,
// "city": "New York",
// "dimensions": {
// "x": 120,
// "y": 90,
// "z": 0
// },
// "images_url": [
// "https://example.com/dreamscape_image1.jpg",
// "https://example.com/dreamscape_image2.jpg"
// ],
// "medium": "Painting",
// "genre": "Surrealism"
// }