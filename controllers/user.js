// Models
const User = require("../models/User");

async function handleSignUpForm(req, res) {
    return res.render("users/signup");
}

async function handleSignUp(req, res) {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Registered & Logged in  successfully !");
            return res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/users/signup");
    }
}

async function handleLoginForm(req, res) {
    return res.render("users/login");
}

async function handleLogout(req, res, next) {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "Logged out successfully !");
        return res.redirect("/listings");
    });
}

module.exports = {
    handleSignUpForm,
    handleSignUp,
    handleLoginForm,
    handleLogout,
};
