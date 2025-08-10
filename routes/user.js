// Packages
const passport = require("passport");

// Router
const { Router } = require("express");
const router = Router();

// Utils
const wrapAsync = require("../utils/wrapAsync");

// Controllers
const {
    handleSignUpForm,
    handleLoginForm,
    handleLogout,

    handleSignUp,
} = require("../controllers/user");

// Routes
router
    .route("/signup")
    .get(wrapAsync(handleSignUpForm))
    .post(wrapAsync(handleSignUp));

router
    .route("/login")
    .get(handleLoginForm)
    .post(
        async (req, res, next) => {
            res.locals.returnTo = req.session.returnTo || "/listings";
            next();
        },
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true,
        }),
        async (req, res) => {
            const returnTo = res.locals.returnTo;
            delete res.locals.returnTo;

            req.flash("success", "Welcome back !");
            return res.redirect(returnTo);
        }
    );

router.route("/logout").get(handleLogout);

module.exports = router;
