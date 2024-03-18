const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: Review
        }
    ]
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;