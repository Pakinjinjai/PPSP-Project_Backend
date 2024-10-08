const { sign, verify } = require("jsonwebtoken");
require('dotenv').config();


const secretKey = "#12345678@!45%#@";

const createJWT = (payload) => {
  const token = sign(payload, secretKey, { expiresIn: "7D" });
  return token;
};

const verifyJWT = (token) => {
  try {
    const decoded = verify(token, secretKey);
    return decoded;
  } catch (error) {
    // console.log(error);
    return undefined;
  }
};

module.exports = {
  createJWT,
  verifyJWT,
};
