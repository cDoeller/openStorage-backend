const fileUploader = require("../config/cloudinary.config")
const router = require("express").Router()

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.post("/", fileUploader.single("imageUrl"), isAuthenticated, (req,res,next)=>{
    console.log("file is: ", req.file)

    if(!req.file){
        next(new Error("No File Uploaded!"))
        return
    }

    res.json({fileUrl:req.file.path})
})


module.exports = router