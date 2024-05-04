const Artwork = require("../models/Artwork.model");
const Rental = require("../models/Rental.model");
const User = require("../models/User.model");

const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// CREATE a new rental
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const newRental = await Rental.create(req.body);
    const updatedArtist = await User.findByIdAndUpdate(
      req.body.artist,
      { $push: { "rentals.rentals_offering": newRental._id } },
      { new: true }
    );
    const updatedUser = await User.findByIdAndUpdate(
      req.body.user_borrowing,
      { $push: { "rentals.rentals_receiving": newRental._id } },
      { new: true }
    );
    res.status(200).json(newRental);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// UPDATE a rental, updates the artwork
router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedRental = await Rental.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(updatedRental);
    res.status(200).json(updatedRental);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// GET one rental
router.get("/:id", isAuthenticated, (req, res) => {
  Rental.findById(req.params.id)
    .populate("artist artwork user_borrowing")
    .then((oneRental) => {
      console.log(oneRental);
      res.status(200).json(oneRental);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET all pending rentals (requests) by one user
router.get("/:user_id/pending", isAuthenticated, (req, res) => {
  Rental.find({
    $and: [{ user_borrowing: req.params.user_id }, { is_approved: false }],
  })
    .populate("artist artwork user_borrowing")
    .then((pendingRequests) => {
      console.log(pendingRequests);
      res.status(200).json(pendingRequests);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET all approved rentals for one user
router.get("/:user_id/approved", isAuthenticated, (req, res) => {
  Rental.find({
    $and: [{ user_borrowing: req.params.user_id }, { is_approved: true }],
  })
    .populate("artist artwork user_borrowing")
    .then((approvedRentals) => {
      console.log(approvedRentals);
      res.status(200).json(approvedRentals);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", isAuthenticated, (req,res)=>{
  Rental.findByIdAndDelete(req.params.id)
  .then((deletedRental) => {
    console.log(deletedRental);
    res.status(200).json(deletedRental);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
})

module.exports = router;
