// Load env. variables
require("dotenv").config();

// Packages
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");

// App Initialization
const app = express();

// DB Connection
const { connectDB } = require("./utils/db");
connectDB(process.env.MONGODB_URL);

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Global Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session
app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            crypto: {
                secret: "secret-key",
            },
            touchAfter: 24 * 3600,
        }),
    }),
);

// Flash
app.use(flash());

// Passport Configuration
const User = require("./models/User");
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom Middlewares
const saveFlash = require("./middlewares/flash");
app.use(saveFlash);

const { saveUser } = require("./middlewares/auth");
app.use(saveUser);

// Routes
app.get("/", (req, res) => {
    return res.redirect("/listings");
});

const listingsRouter = require("./routes/listings");
app.use("/listings", listingsRouter);

const userRouter = require("./routes/user");
app.use("/users", userRouter);

// 404 Handler
const ExpressError = require("./utils/ExpressError");
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong !" } = err;

    // console.error(err.stack);

    res.status(status).render("error", { err: err });
});

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
