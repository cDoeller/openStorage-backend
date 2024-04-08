const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET all artists
router.get("/artists", (req, res) => {
  User.find({ isArtist: true })
    .select("user_name _id artworks")
    .populate("artworks")
    .then((allArtists) => {
      res.json(allArtists);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// GET one user + all data
// test 66114ddfc49cfc974744bc0e
router.get("/:_id", isAuthenticated, (req, res) => {
  User.findById(req.params._id)
    .select("-password")
    .populate("artworks")
    .then((oneUserData) => {
      res.json(oneUserData);
    })
    .catch((err) => console.log(err));
});

// UPDATE one user
router.put("/:_id/update", isAuthenticated, (req, res) => {
  User.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .select("-password")
    .populate("artworks")
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

// UPDATE password-reset
router.put ("/:_id/pwd", isAuthenticated, (req,res)=>{
  // check pwd regex / empty
  // make salt
  // hash pw
  // update user pw in db
  // send back name, email, id
})

module.exports = router;
