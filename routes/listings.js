// Router
const { Router } = require("express");
const router = Router();
const reviewRouter = require("./review");

// Utils
const wrapAsync = require("../utils/wrapAsync");
const { storage } = require("../utils/cloudinary");

// Multer Configuration
const multer = require("multer");
const upload = multer({ storage });

// Middleware
const { validateListing } = require("../middlewares/validations");
const { isLoggedIn, isOwnerOfListing } = require("../middlewares/auth");

// Controllers
const {
    handleGetAllListings,
    handleCreateNewListing,

    handleNewListingForm,

    handleEditListingForm,

    handleGetListing,
    handleEditListing,
    handleDeleteListing,
} = require("../controllers/listings");

// Routes
router
    .route("/")
    .get(wrapAsync(handleGetAllListings))
    .post(
        isLoggedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(handleCreateNewListing)
    );

router.route("/new").get(isLoggedIn, wrapAsync(handleNewListingForm));

router
    .route("/:id/edit")
    .get(isLoggedIn, isOwnerOfListing, wrapAsync(handleEditListingForm));

router.use("/:id/reviews", reviewRouter);

router
    .route("/:id")
    .get(wrapAsync(handleGetListing))
    .put(
        isLoggedIn,
        isOwnerOfListing,
        upload.single("image"),
        validateListing,
        wrapAsync(handleEditListing)
    )
    .delete(isLoggedIn, isOwnerOfListing, wrapAsync(handleDeleteListing));

module.exports = router;
