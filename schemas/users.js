const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
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
    address: {
      houseNo: {
        type: String,
        default: null,
      },
      province: {
        type: String,
        default: null,
      },
      district: {
        type: String,
        default: null,
      },
      subDistrict: {
        type: String,
        default: null,
      },
      postalCode: {
        type: String,
        default: null,
      },
      road: {
        type: String,
        default: null,
      },
      soi: {
        type: String,
        default: null,
      },
      moo: {
        type: String,
        default: null,
      },
    },
    noteDisease: {
      type: String,
      default: null,
    },
    role: {
      type: Number,
      default: 2001,
    },
  },
  { timestamps: true }
);

module.exports = model("users", userSchema);
