const express = require("express");
const router = express.Router({mergeParams:true});
const Listing =require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror=require("../utils/Expresserror.js");
const Review = require("../models/reviews.js");

//reviews

router.post("/", wrapAsync( async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);

    await listing.reviews.push(review);
    
    await review.save();
    await listing.save();

    res.redirect(`/listings/${req.params.id}`);

}));

//delete review
router.delete("/:reviewId",wrapAsync(async (req,res)=>{

const {id,reviewId} =req.params;
await Listing.findByIdAndUpdate(id, {$pull: { reviews:reviewId }});
await Review.findByIdAndDelete(reviewId);

res.redirect(`/listings/${id}`);

}));

module.exports = router;