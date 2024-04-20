const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET all artists
router.get("/artists", (req, res) => {
  User.find({ isArtist: true })
    .select("user_name _id artworks")
    .populate("artworks rentals favorites")
    .then((allArtists) => {
      res.json(allArtists);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// // GET artist by name
// router.get("/artists/search", (req,res)=>{
//   User.find({$and:[{isArtist: true}, {user_name:{$regex: `${req.query.name}`, $options: "i" }}]})
//   .select("user_name _id artworks")
//   .populate("artworks")
//   .then((allArtists) => {
//     res.json(allArtists);
//   })
//   .catch((err) => {
//     console.log(err);
//     res.json(err);
//   });
// })

// GET  all data of one user
router.get("/:_id", isAuthenticated, (req, res) => {
  User.findById(req.params._id)
    .select("-password")
    .populate("artworks rentals favorites")
    .then((oneUserData) => {
      res.json(oneUserData);
    })
    .catch((err) => console.log(err));
});

// GET all favorites of one user
router.get("/:_id/favorites", isAuthenticated, (req, res) => {
  User.findById(req.params._id)
    .select("favorites -_id")
    .then((oneUserFavorites) => {
      res.json(oneUserFavorites);
    })
    .catch((err) => console.log(err));
});

// UPDATE one user
router.patch("/:_id/update", isAuthenticated, (req, res) => {
  User.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .select("-password")
    .populate("artworks rentals favorites")
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// DELETE one user
router.delete("/:_id/delete", isAuthenticated, (req, res) => {
  User.findByIdAndDelete(req.params._id)
    .then((deletedArtist) => {
      res.json(deletedArtist);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// UPDATE password-reset --> change PWD
router
  .put("/:_id/pwd", isAuthenticated, (req, res) => {
    
    // check pwd regex / empty
    const { password, new_password } = req.body;
    // Check if email or password or name are provided as empty strings
    if (password === "" || new_password === "") {
      res.status(400).json({ message: "Provide old and new password" });
      return;
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(new_password)) {
      res.status(400).json({
        message:
          "New password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
    
    // make salt + hash pw
    const salt = bcrypt.genSaltSync(saltRounds);
    const newHashedPassword = bcrypt.hashSync(new_password, salt);
    
    // 1) find user in DB
    // 2) update user pw in db
    // 3) send back success message
    User.findById(req.params._id)
      .then((userData) => {
        userData.password = newHashedPassword;
        return userData;
      })
      .then((userData) => {
        User.findByIdAndUpdate(req.params._id, userData)
          .then(() => {
            res.json({ message: "Your password has been updated." });
          })
          .catch((err) => console.log(err));
      });
  })

module.exports = router;
