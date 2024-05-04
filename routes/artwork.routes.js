const cloudinaryConfig = require("../config/cloudinary.config");
const Artwork = require("../models/Artwork.model");
const User = require("../models/User.model");

const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET all artworks
router.get("/", (req, res) => {
  Artwork.find()
    .populate("artist")
    .then((Artworks) => {
      res.status(200).json(Artworks);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET recently added
router.get("/recent", (req, res) => {
  const amount = req.query.amount;
  Artwork.find()
    .sort({ createdAt: -1 })
    .limit(amount)
    .populate("artist")
    .then((Artworks) => {
      res.status(200).json(Artworks);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET popular genres
router.get("/popular-genres", (req, res) => {
  // count how often a genre is present in artworks {_id:genre, count{sum}}
  Artwork.aggregate([
    {
      $group: {
        _id: "$genre",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])
    .then((popularGenres) => {
      res.status(200).json(popularGenres);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET all cities (unique)
router.get("/cities", (req, res) => {
  Artwork.distinct("city")
    .then((Artworks) => {
      res.status(200).json(Artworks);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET / SEARCH artworks
router.get("/search", (req, res) => {
  const {
    artist,
    medium,
    city,
    genre,
    dimensions_x,
    dimensions_y,
    dimensions_z,
  } = req.query;

  let searchQuery = {};

  if (medium) searchQuery.medium = medium;
  if (genre) searchQuery.genre = genre;
  if (city) searchQuery.city = { $regex: `${city}`, $options: "i" };
  if (artist) searchQuery.artist = artist;
  if (dimensions_x) searchQuery["dimensions.x"] = { $lte: `${dimensions_x}` };
  if (dimensions_y) searchQuery["dimensions.y"] = { $lte: `${dimensions_y}` };
  if (dimensions_z) searchQuery["dimensions.z"] = { $lte: `${dimensions_z}` };

  console.log(searchQuery);
  Artwork.find(searchQuery)
    .populate("artist")
    .then((foundArtworks) => {
      res.status(200).json(foundArtworks);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET one artwork by id
router.get("/:id", (req, res) => {
  Artwork.findById(req.params.id)
    .populate("artist")
    .then((oneArtwork) => {
      res.status(200).json(oneArtwork);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST new artwork
router.post("/", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    const newArtwork = await Artwork.create(req.body);
    const updatedArtist = await User.findByIdAndUpdate(
      req.body.artist,
      { $push: { artworks: newArtwork._id } },
      { new: true }
    );
    res
      .status(200)
      .json({ newArtwork: newArtwork, updatedArtist: updatedArtist });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// UPDATE one artwork
router.patch("/:id", isAuthenticated, (req, res) => {
  Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedArtwork) => {
      res.status(200).json(updatedArtwork);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE one artwork
router.delete("/:id", isAuthenticated, (req, res) => {
  Artwork.findByIdAndDelete(req.params.id)
    .then((deletedArtwork) => {
      res.status(200).json(deletedArtwork);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
