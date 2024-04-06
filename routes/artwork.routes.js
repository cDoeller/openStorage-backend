const Artwork = require("../models/Artwork.model")

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

// Search route

// router.get("/search", (req,res)=>{
//     console.log(req.query)
//     res.json(req.query)
//     Artwork.find({q:req.query})
//     .then((foundArtwork)=>{
//         console.log(foundArtwork)
//         res.json(foundArtwork)
//     })
//     .catch((err)=>{
//         console.log(err)
//         res.json(err)
//     })

// })

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

// POST a new artwork
router.post("/", (req,res)=>{
    Artwork.create(req.body)
    .then((newArtwork)=>{
        console.log(newArtwork)
        res.json(newArtwork)
    })
    .catch((err)=>{
        console.log(err)
        res.json(err)
    })
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