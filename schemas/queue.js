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
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
    //locations flase == online || true == onsite
    locations:{
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
