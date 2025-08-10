const mongoose = require("mongoose");

async function connectDB(url) {
    try {
        await mongoose.connect(url);
        console.log(`Connected to MongoDB`);
    } catch (err) {
        console.error(`Error connecting to MongoDB : ${err}`);
    }
}

async function disconnectDB() {
    try {
        await mongoose.disconnect();
    } catch (err) {
        console.error(`Error disconnecting from MongoDB : ${err}`);
    }
}

module.exports = {
    connectDB,
    disconnectDB,
};
