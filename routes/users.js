const express = require('express');
const route = express.Router();
const { login, register } = require('../controllers/users');

// route.get("/",(req,res) => {
//     return res.status(200).json({"message":"Hi!! form get method"})
// });

route.post("/login",login);
route.post("/register",register);


module.exports = route;