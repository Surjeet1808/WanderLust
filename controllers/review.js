const Listing =require("../models/listings.js");
const Review = require("../models/reviews.js");

module.exports.createReview=async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    await listing.reviews.push(review);
    
    await review.save();
    await listing.save();
    req.flash("success","review created");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview=async (req,res)=>{
    const {id,reviewId} =req.params;
    await Listing.findByIdAndUpdate(id, {$pull: { reviews:reviewId }});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
};