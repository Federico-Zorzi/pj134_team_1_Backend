// * DOTENV(.env) SETUP FOR GENERAL CONFIGURATION
require("dotenv").config();

// * EXPRESS SETUP
const express = require("express");
const app = express();
const https = process.env.HTTPS === "on" ? "https" : "http";
const host =
  process.env.HOST + (process.env.PORT ? ":" + process.env.PORT : "");
const port = process.env.PORT;

// * MIDDLEWARES REGISTERING
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

//  * DATA PARSING FOR METHODS POST/PUT/PATCH
app.use(express.json());

// * REGISTERING PUBLIC FOLDER
app.use(express.static("public"));

// * ROUTERS SETUP
// const homepageRouter = require("./routers/homepage");
// app.use("/", homepageRouter);

// * MIDDLEWARES FOR ERRORS
app.use(errorHandler);
app.use(notFound);

// * SERVER LISTEN
app.listen(port, () => {
  console.log(`Server listening at ${https}://${host}`);
});
