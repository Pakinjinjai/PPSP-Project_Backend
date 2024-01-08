const express = require("express");
const route = express.Router();
const {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  getAllUser,
  deleteUser,
  searchUser,
} = require("../controllers/users");
const { authorized, isAdmin } = require("../middleware/authorizations");

route.post("/login", login);
route.post("/register", register);
route.get("/me", authorized, getUserProfile);
route.get("/getallusers", getAllUser);
route.get("/", searchUser);
route.delete("/:_id", authorized, isAdmin, deleteUser);
route.patch("/update", authorized, updateUserProfile);

module.exports = route;
