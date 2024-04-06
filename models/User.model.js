const mongoose = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email already exists."],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    user_name: {
      type: String,
      unique: [true, "User already exists."],
      required: [true, "User name is required."],
    },
    real_name: {
      type: String,
      required: [true, "Your real name is required."],
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
          required: [true, "Street name is required."],
        },
        city: {
          type: String,
          required: [true, "City is required."],
        },
        country: {
          type: String,
          required: [true, "Country info is required."],
        },
        postal_code: {
          type: Number,
          required: [true, "Postal code is required."],
        },
        phone_number: {
          type: Number,
          required: [true, "Phone number is required."],
        },
      },
    },
    isArtist: {
      type: Boolean,
      default: false,
    },
    artist_statement: {
      type: String,
    },
    artworks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Artwork",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
