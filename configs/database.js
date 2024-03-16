const mongoose = require("mongoose");
require('dotenv').config();

const URI = process.env.MONGO_URI

const _init = async () => {
  mongoose
    // .connect("mongodb://localhost:27017/Healthcare_WebApp")
    .connect(URI)
    .then((v) => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.log("Error connecting ${e}");
    });
};
_init();
