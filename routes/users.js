const express = require("express");
const route = express.Router();
const {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  getAllUser,
  deleteUser,
  searchUser
} = require("../controllers/users");
const { authorized, isAdmin } = require("../middleware/authorizations");

// route.get("/",(req,res) => {
//     return res.status(200).json({"message":"Hi!! form get method"})
// });

route.post("/login", login);
route.post("/register", register);
route.get("/me", authorized, getUserProfile);
route.get("/getallusers", getAllUser);
route.get("/", searchUser);
route.delete("/:UsersId", authorized, isAdmin, deleteUser);
route.patch("/update", authorized, updateUserProfile);

module.exports = route;
