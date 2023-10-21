const { Schema, model } = require("mongoose");

const patientSchema = new Schema(
  {
    firstname: {
      type: String,
      default: null,
    },
    lastname: {
      type: String,
      default: null,
    },
    phoneNo: {
      type: String,
      default: null,
    },
    gender: {
      type: Boolean,
      default: null,
    },
    mail: {
      type: String,
      default: null,
    },
    idCard: {
      type: String,
      default: null,
    },
    birtdate: {
      type: Date,
      default: null,
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
    noteDrug: {
      type: String,
      default: null,
    },
    noteMedicine: {
      type: String,
      default: null,
    },
    noteDisease: {
      type: String,
      default: null,
    },
    health: {
      type: String,
      default: null,
    },
    income: {
      type: Number,
      default: null,
    },
    takingMed: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("patient", patientSchema);
