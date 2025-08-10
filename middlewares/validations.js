const Joi = require("joi");
const ExpressError = require("../utils/ExpressError");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

async function validateListing(req, res, next) {
    if (!req.body) {
        throw new ExpressError(400, "All fields are required !");
    }

    const { error } = listingSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, message);
    } else {
        next();
    }
}

async function validateReview(req, res, next) {
    if (!req.body) {
        throw new ExpressError(400, "All fields are required !");
    }

    const { error } = reviewSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, message);
    } else {
        next();
    }
}

module.exports = { validateListing, validateReview };
