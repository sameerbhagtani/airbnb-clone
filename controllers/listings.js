// Models
const Listing = require("../models/Listing");

// Packages
const axios = require("axios");

async function handleGetAllListings(req, res) {
    const allListings = await Listing.find({});

    return res.render("listings/index", { allListings });
}

async function handleNewListingForm(req, res) {
    return res.render("listings/new");
}

async function handleGetListing(req, res) {
    const id = req.params.id;

    const result = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "owner" } })
        .populate("owner");

    if (!result) {
        req.flash("error", "Listing not found !");
        return res.redirect("/listings");
    }

    return res.render("listings/show", {
        listing: result,
    });
}

async function handleEditListingForm(req, res) {
    const id = req.params.id;

    const result = await Listing.findById(id);

    if (!result) {
        req.flash("error", "Listing not found !");
        return res.redirect("/listings");
    }

    if (result.image.url) {
        const originalUrl = result.image.url;
        result.image.url = originalUrl.replace("/upload", "/upload/w_250");
    }

    return res.render("listings/edit", { listing: result });
}

async function handleCreateNewListing(req, res, next) {
    const newListing = new Listing(req.body.listing);

    const location = newListing.location;

    const coordinates = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                format: "json",
                q: location,
                limit: 1,
            },
            headers: {
                "User-Agent": "airbnb-clone/1.0",
            },
        },
    );

    newListing.coordinates.push(coordinates.data[0].lat);
    newListing.coordinates.push(coordinates.data[0].lon);

    newListing.owner = req.user._id;

    let url, filename;
    if (req.file) {
        url = req.file.path;
        filename = req.file.filename;
    } else {
        url =
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
        filename = "defaultImage";
    }

    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "New Listing Created !");
    return res.status(201).redirect("/listings");
}

async function handleEditListing(req, res) {
    const id = req.params.id;
    const newListing = req.body.listing;

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        newListing.image = { url, filename };
    }

    await Listing.findByIdAndUpdate(id, newListing);

    req.flash("success", "Listing Updated !");
    return res.redirect(`/listings/${id}`);
}

async function handleDeleteListing(req, res) {
    const id = req.params.id;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted !");
    res.redirect(`/listings`);
}

module.exports = {
    handleGetAllListings,
    handleNewListingForm,
    handleGetListing,
    handleEditListingForm,

    handleCreateNewListing,

    handleEditListing,

    handleDeleteListing,
};
