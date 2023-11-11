const express = require("express");
const route = express.Router();
const { login, register, getUserProfile } = require("../controllers/users");
const { authorized } = require("../middleware/authorizations");

// route.get("/",(req,res) => {
//     return res.status(200).json({"message":"Hi!! form get method"})
// });

route.post("/login", login);
route.post("/register", register);
route.get("/me", authorized, getUserProfile);

module.exports = route;
