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
    .populate({
      path: "artworks favorites",
    })
    .populate({
      path: "rentals.rentals_receiving rentals.rentals_offering",
      populate: {
        path: "artwork",
        model: "Artwork"
      }
    })
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
    .populate({
      path: "favorites",
      populate: { path: "artist", model: "User" },
    })
    .then((oneUserFavorites) => {
      res.status(200).json(oneUserFavorites);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GETT all rentals of one user
router.get("/:_id/rentals", isAuthenticated, (req, res) => {
  User.findById(req.params._id)
    .select("rentals")
    .populate("rentals")
    .populate({
      path: "rentals",
      populate: { path: "rentals_receiving", model: "Rental" },
    })
    .then((oneUserRentals) => {
      res.status(200).json(oneUserRentals);
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

// NOTIFICATIONS
// -----> add is authenticated

// POST one notification in sub-schema
router.post("/:_id/notifications", (req, res) => {
  const _id = req.params._id;
  const newNotification = req.body;
  User.findByIdAndUpdate(
    _id,
    { $push: { notifications: newNotification } },
    { new: true }
  )
    .select("notifications -_id")
    .populate({
      path: "notifications",
      populate: {
        path: "request",
        model: "Rental",
        populate: [
          {
            path: "artwork",
            model: "Artwork",
          },
          {
            path: "user_borrowing",
            model: "User",
          },
        ],
      },
    })
    .then((updatedUser) => {
      res.status(200).json(updatedUser.notifications);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET all notifications of one user
router.get("/:_id/notifications", isAuthenticated, (req, res) => {
  User.findById(req.params._id)
    .select("notifications -_id")
    .populate({
      path: "notifications",
      populate: {
        path: "request",
        model: "Rental",
        populate: [
          {
            path: "artwork",
            model: "Artwork",
          },
          {
            path: "user_borrowing",
            model: "User",
          },
        ],
      },
    })
    .then((oneUserNotifications) => {
      res.status(200).json(oneUserNotifications);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.get("/:_id/notifications/:_requestId", isAuthenticated, (req, res)=>{
  const requestId = req.params._requestId;
  User.findById(req.params._id)
  .select("notifications -_id")
  .populate({
    path: "notifications",
    match: { request: { $elemMatch: { _id: requestId } }}
  })
  .then((oneUserOneNotification) => {
    const notificationId = oneUserOneNotification.notifications[0]._id;
    const response = {_id: notificationId}
    res.status(200).json(response);
    // res.status(200).json(oneUserOneNotification);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
})

// UPDATE one notification of one user of sub-schema
router.patch("/:_id/notifications/:notification_id", (req, res) => {
  const _id = req.params._id;
  const notification_id = req.params.notification_id;
  const data = req.body;
  User.findOneAndUpdate(
    { _id, "notifications._id": notification_id },
    { $set: { "notifications.$": data } },
    { new: true }
  )
    .select("notifications -_id")
    .populate({
      path: "notifications",
      populate: {
        path: "request",
        model: "Rental",
        populate: [
          {
            path: "artwork",
            model: "Artwork",
          },
          {
            path: "user_borrowing",
            model: "User",
          },
        ],
      },
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE one notification of one user of sub-schema
router.delete("/:_id/notifications/:notification_id", (req, res) => {
  const _id = req.params._id;
  const notification_id = req.params.notification_id;
  // remove only one object from array of objects with $pull
  User.findByIdAndUpdate(
    _id,
    { $pull: { notifications: { _id: notification_id } } },
    { new: true }
  )
    .select("notifications -_id")
    .populate({
      path: "notifications",
      populate: {
        path: "request",
        model: "Rental",
        populate: [
          {
            path: "artwork",
            model: "Artwork",
          },
          {
            path: "user_borrowing",
            model: "User",
          },
        ],
      },
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
