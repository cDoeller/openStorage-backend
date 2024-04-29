const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // error handeling via err-code needed?
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    user_name: {
      type: String,
      unique: true, // error handeling via err-code needed?
      required: [true, "User name is required."],
    },
    real_name: {
      type: String,
    },
    profile_img_url: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
      trim: true,
    },
    contact: {
      website: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      address: {
        street: {
          type: String,
        },
        city: {
          type: String,
        },
        country: {
          type: String,
        },
        postal_code: {
          type: Number,
        },
        phone_number: {
          type: Number,
        },
      },
    },
    tagline: {
      type: String,
    },
    isArtist: {
      type: Boolean,
      default: false,
    },
    artist_statement: {
      type: String,
    },
    artworks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],
    rentals: {
      rentals_offering: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Rental",
        },
      ],
      rentals_receiving: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Rental",
        },
      ],
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],
    notifications: [
      {
        type: {
          type: String,
          enum: ["new-request", "change-request", "confirm"],
        },
        request: {
          type: mongoose.Schema.Types.ObjectId,
          default: "Rental",
        },
        isNew: {
          type: Boolean,
          default: true,
        },
        message: {
          type: String,
          default: "",
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
