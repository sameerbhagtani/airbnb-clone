const { Schema, model } = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); // Adds username, hash, salt, and useful methods

const User = model("User", userSchema);

module.exports = User;
