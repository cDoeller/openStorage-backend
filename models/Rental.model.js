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
    required: [true, "Start Date is Required"],
  },
  end_date: {
    type: Date,
    required: [true, "End Date is Required"],
  },
  transportation: {
    type: String,
    required: [true, "Choose a transportation type"],
  },
  transportation_details: {
    type: Object,
  },
  message: {
    type: String,
  },
  state: {
    type: String,
    default: "pending",
    enum: {
      values: ["accepted", "rejected", "pending"],
      message: "{VALUE} is not supported",
    },
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
