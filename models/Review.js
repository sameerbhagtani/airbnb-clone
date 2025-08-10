const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Review = model("Review", reviewSchema);

module.exports = Review;
