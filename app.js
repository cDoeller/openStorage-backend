// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);


const userRoutes = require ("./routes/user.routes");
app.use("/api/user", userRoutes);

const artworkRoutes = require("./routes/artwork.routes")
app.use("/api/artworks", artworkRoutes)

const cityRoutes = require("./routes/city.routes")
app.use("/api/city", cityRoutes)

const rentalRoutes = require("./routes/rental.routes")
app.use("/api/rentals", rentalRoutes)


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
