const mongoose = require("mongoose");

const _init = async () => {
  mongoose
    // .connect("mongodb://localhost:27017/Healthcare_WebApp")
    .connect("mongodb+srv://admin:1234@cluster0.up8drkr.mongodb.net/Serves")
    .then((v) => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.log("Error connecting ${e}");
    });
};
_init();
