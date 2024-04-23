const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Artwork title is Required"],
    },
    year: {
      type: Number,
    },
    city: {
      type: String,
      required: [true, "City is Required"],
    },
    dimensions: {
      x: {
        type: Number,
        required: [true, "Dimensions is Required"],
        min: [1, "Dimensions (w) musst be bigger than 0"],
      },
      y: {
        type: Number,
        required: true,
        min: [1, "Dimensions (h) musst be bigger than 0"],
      },
      z: {
        type: Number,
        default: 0,
        min: [0, "Dimensions (d) musst be at least 0"],
      },
    },
    images_url: {
      type: [String],
      required: [true, "Upload at least one image"],
      trim: true, // does trim work on string array?
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    medium: {
      type: String,
      enum: {
        values: [
          "Painting",
          "Sculpture",
          "Object",
          "Photography",
          "Installation",
          "Drawing",
          "Print",
          "Collage",
          "Mixed Media",
        ],
        message: "{VALUE} is not supported",
      },
    },
    genre: {
      type: String,
      enum: {
        values: [
          "Surreal",
          "Minimal",
          "Real",
          "Natural",
          "Dada",
          "Arte Povera",
          "Pop",
          "Ready Made",
          "Digital",
          "Abstract",
          "Assemblage",
          "Concrete",
          "Kinetic",
          "Figurative",
          "Conceptual",
          "Political",
          "Interactive",
          "Art & Design",
        ],
        message: "{VALUE} is not supported",
      },
    },
    is_borrowed: {
      type: Boolean,
      default: false,
    },
    is_for_sale: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Artwork = mongoose.model("Artwork", artworkSchema);

module.exports = Artwork;
