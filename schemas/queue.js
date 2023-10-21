const { Schema, model } = require("mongoose");

const queueSchema = new Schema(
  {
    topic: {
      type: String,
    },
    dateQueue: {
      type: Date,
      required: true,
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
