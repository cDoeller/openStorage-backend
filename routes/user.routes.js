const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET all artists
router.get("/artists", (req, res) => {
  User.find({ isArtist: true })
    .select("user_name _id artworks")
    .populate("artworks favorites")
    .then((allArtists) => {
      res.status(200).json(allArtists);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET all artists with artworks
router.get("/artists/works", (req, res) => {
  User.find({ $and: [{ isArtist: true }, { artworks: { $ne: [] } }] })
    .select("user_name _id artworks")
    .populate("artworks favorites")
    .then((allArtists) => {
      res.status(200).json(allArtists);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET all data of one user
router.get("/:_id", isAuthenticated, (req, res) => {
  User.findById(req.params._id)
    .select("-password")
    .populate("artworks favorites")
    .populate({path: "rentals", populate: {path: "rentals_receiving", model:"Artwork"}})
    .populate({path: "rentals", populate: {path: "rentals_offering", model:"Artwork"}})
    .then((oneUserData) => {
      res.status(200).json(oneUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET all favorites of one user
router.get("/:_id/favorites", isAuthenticated, (req, res) => {
  User.findById(req.params._id)
    .select("favorites -_id")
    .populate("favorites")
    .then((oneUserFavorites) => {
      res.status(200).json(oneUserFavorites);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE user Favorites
router.patch(`/:_id/favorites`, isAuthenticated, (req, res) => {
  User.findByIdAndUpdate(req.params._id, { favorites: req.body }, { new: true })
    .select("favorites -_id")
    .then((oneUserFavorites) => {
      res.status(200).json(oneUserFavorites);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE one user
router.patch("/:_id/update", isAuthenticated, (req, res) => {
  User.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .select("-password")
    .populate("artworks favorites")
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE one user
router.delete("/:_id/delete", isAuthenticated, (req, res) => {
  User.findByIdAndDelete(req.params._id)
    .then((deletedArtist) => {
      res.status(200).json(deletedArtist);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
