const { Schema, model } = require("mongoose");

const queueSchema = new Schema(
  {
    topic: {
      type: String,
      default: null,
    },
    note: {
      type: String,
      default: null,
    },
    dateQueue: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("queue", queueSchema);
