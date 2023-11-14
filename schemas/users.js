const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      default: null,
      required: true,
    },
    lastname: {
      type: String,
      default: null,
      required: true,
    },
    phoneNo: {
      type: String,
      default: null,
    },
    gender: {
      type: Boolean,
      default: null,
      required: true,
    },
    idCard: {
      type: String,
      default: null,
      required: true,
    },
    birthdate: {
      type: Date,
      default: null,
      required: true,
    },
    role: {
      type: Number,
      default: 2001,
    },
  },
  { timestamps: true }
);

module.exports = model("users", userSchema);
