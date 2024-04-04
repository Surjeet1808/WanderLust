const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware");
const reviewcontroller=require("../controllers/review.js");

//create reviews
router.post("/",isLoggedIn, wrapAsync(reviewcontroller.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewcontroller.destroyReview));

module.exports = router;