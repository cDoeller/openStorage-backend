const City = require("../models/City.model")

const router = require("express").Router()

// GET one city
router.get("/:id", (req,res)=>{
    
    City.findById(req.params.id)
    .populate("userList")
    .populate("artworksList")
    .then((oneCity)=>{
        console.log(oneCity)
        res.json(oneCity)
    })
    .catch((err)=>{
        console.log(err)
        res.json(err)
    })
})

router.get("/", (req,res)=>{
    City.find()
    .populate("userList")
    .populate("artworksList")
    .then((allCities)=>{
        // console.log(allCities)
        res.json(allCities)
    })
    .catch((err)=>{
        console.log(err)
        res.json(err)
    })
})

router.post("/", (req,res)=>{

    City.create(req.body)
    .then((newCity)=>{
        console.log(newCity)
        res.json(newCity)
    })
    .then((err)=>{
        console.log(err)
        res.json(err)
    })
})


module.exports = router