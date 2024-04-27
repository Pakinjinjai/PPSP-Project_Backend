const { Schema, model } = require("mongoose");
const replySchema = new Schema(
    {
        keys:{
            type: [String],
            required: true,
        },
        text:{
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);
module.exports = model("replys", replySchema);