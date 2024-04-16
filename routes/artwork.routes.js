const cloudinaryConfig = require("../config/cloudinary.config");
const Artwork = require("../models/Artwork.model");
const User = require("../models/User.model");

const router = require("express").Router();

const fileUploader = require("../config/cloudinary.config");

// UPLOAD IMAGE
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  res.json({ fileUrl: req.file.path });
});

// GET all artworks
router.get("/", (req, res) => {
  Artwork.find()
    .populate("artist")
    .then((Artworks) => {
      console.log(Artworks);
      res.json(Artworks);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// SEARCH artworks
router.get("/search", (req, res) => {
  const { artist, medium, city, genre, dimensions } = req.query;
  const searchQuery = {};

  if (medium) searchQuery.medium = medium;
  if (genre) searchQuery.genre = genre;
  if (city) searchQuery.city = { $regex: `${city}`, $options: "i" };
  if (artist) searchQuery.artist = artist;
  // MISSING dimensions

  console.log(searchQuery);
  Artwork.find(searchQuery)
    .populate("artist")
    .then((foundArtworks) => {
      res.json(foundArtworks);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// GET one artwork by id
router.get("/:id", (req, res) => {
  Artwork.findById(req.params.id)
    .populate("artist")
    .then((oneArtwork) => {
      console.log(oneArtwork);
      res.json(oneArtwork);
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST a new artwork async

router.post("/", async (req, res) => {
  try {
    const newArtwork = await Artwork.create(req.body);
    const updatedArtist = await User.findByIdAndUpdate(
      req.body.artist,
      { $push: { artworks: newArtwork._id } },
      { new: true }
    );

    console.log(newArtwork);
    console.log(updatedArtist);
    res.json({ newArtwork: newArtwork, updatedArtist: updatedArtist });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// DELETE one artwork
router.delete("/:id", (req, res) => {
  Artwork.findByIdAndDelete(req.params.id)
    .then((deletedArtwork) => {
      console.log(deletedArtwork);
      res.json(deletedArtwork);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;

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
