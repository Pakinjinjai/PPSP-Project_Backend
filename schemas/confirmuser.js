const { Schema, model } = require("mongoose");

const confirmUserSchemas = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    accoutId: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("confirmusers", confirmUserSchemas);