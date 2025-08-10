// Models
const Review = require("../models/Review");
const Listing = require("../models/Listing");

async function handleCreateNewReview(req, res) {
    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.review);
    newReview.owner = req.user._id;
    const savedReview = await newReview.save();

    listing.reviews.push(savedReview._id);
    await listing.save();

    req.flash("success", "New Review Created !");
    return res.status(201).redirect(`/listings/${listing._id}`);
}

async function handleDeleteReview(req, res) {
    const listingId = req.params.id;
    const reviewId = req.params.reviewId;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(listingId, {
        $pull: { reviews: reviewId },
    });

    req.flash("success", "Review Deleted !");
    return res.status(200).redirect(`/listings/${listingId}`);
}

module.exports = {
    handleCreateNewReview,
    handleDeleteReview,
};
