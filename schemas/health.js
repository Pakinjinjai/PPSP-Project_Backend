const { Schema, model } = require("mongoose");

const healthSchema = new Schema(
  {
    temperature: {
      type: Number,
      default: null,
    },
    bloodPressure: {
      type: Number,
      default: null,
    },
    heartRate: {
      type: Number,
      default: null,
    },
    oxygen: {
      type: Number,
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("health", healthSchema);
