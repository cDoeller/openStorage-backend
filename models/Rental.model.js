const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artwork",
  },
  user_borrowing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  transportation: {
    type: String,
    required: true,
  },
  transportation_details: {
    type: Object,
  },
  message: {
    type: String,
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
