const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newRefImageCategory = new Schema(
    {
        categoryName: {
        type: String,
        required: true,
        },
        description: {
        type: String,
        required: true,
        },
    },
    {
        timestamps: true,
    }
);

const RefImageCategories = mongoose.model("RefImageCategories", newRefImageCategory);

module.exports = RefImageCategories;