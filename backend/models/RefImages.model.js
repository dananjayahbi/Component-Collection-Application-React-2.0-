const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newRefImage = new Schema(
    {
        imageURL: {
        type: String,
        required: true,
        },
        category: {
        type: String,
        required: true,
        },
    },
    {
        timestamps: true,
    }
);

const RefImages = mongoose.model("RefImages", newRefImage);

module.exports = RefImages;
