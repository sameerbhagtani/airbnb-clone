// Models
const Listing = require("../models/Listing");
const Review = require("../models/Review");

async function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        if (req.method === "GET") req.session.returnTo = req.originalUrl;

        req.flash("error", "Please log in !");
        return res.redirect("/users/login");
    }

    return next();
}

async function saveUser(req, res, next) {
    res.locals.user = req.user;

    next();
}

async function isOwnerOfListing(req, res, next) {
    const id = req.params.id;
    const listing = await Listing.findById(id);

    if (!req.user._id.equals(listing.owner._id)) {
        req.flash("error", "You are not the owner of this listing !");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}

async function isOwnerOfReview(req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!req.user._id.equals(review.owner._id)) {
        req.flash("error", "You are not the owner of this review !");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}

module.exports = {
    isLoggedIn,
    saveUser,
    isOwnerOfListing,
    isOwnerOfReview,
};
