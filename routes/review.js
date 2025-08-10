// Router
const { Router } = require("express");
const router = Router({ mergeParams: true });

// Utils
const wrapAsync = require("../utils/wrapAsync");

// Middleware
const { validateReview } = require("../middlewares/validations");
const { isLoggedIn, isOwnerOfReview } = require("../middlewares/auth");

// Controllers
const {
    handleCreateNewReview,
    handleDeleteReview,
} = require("../controllers/review");

// Routes
router
    .route("/")
    .post(isLoggedIn, validateReview, wrapAsync(handleCreateNewReview));

router
    .route("/:reviewId")
    .delete(isLoggedIn, isOwnerOfReview, wrapAsync(handleDeleteReview));

module.exports = router;
