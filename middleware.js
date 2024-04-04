const Listing=require("./models/listings.js");
const Expresserror = require("./utils/Expresserror.js");
const {listingSchema}= require("./schema.js");
const Review=require("./models/reviews.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("err","you must login first");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
   res.locals.redirectUrl=req.session.redirecturl;
   return next();
};

module.exports.isOwner= async (req,res,next)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
     req.flash("err","you are not the owner");
     return res.redirect(`/listings/${id}`)
    }
    next();
};

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new Expresserror(400,error);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor= async (req,res,next)=>{
    const {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curruser._id)){
     req.flash("err","you are not the owner");
     return res.redirect(`/listings/${id}`)
    }
    next();
};