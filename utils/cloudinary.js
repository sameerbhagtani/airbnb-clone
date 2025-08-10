const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "airbnb-clone",
        allowed_formats: ["jpeg", "png", "jpg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};
