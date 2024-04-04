const Listing=require("../models/listings.js");
const Review=require("../models/reviews.js");
module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

  module.exports.newListingForm=(req , res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
  const {id}=req.params;
  const listing = await Listing.findById(id)
  .populate({path:"reviews",populate: {path:"author"}})
  .populate("owner");
  if(!listing){
    req.flash("err","listing are you trying to access does not exist");
    return res.redirect("/listings");
  }
    
    res.render("listings/show.ejs",{listing});
};

module.exports.newListing=async (req,res)=>{
  let imageurl=req.file.path;
  let imagefilename=req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner=req.user.id;
  newlisting.image.url=imageurl;
  newlisting.image.filename=imagefilename;
  await newlisting.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
};

module.exports.updateForm=async (req,res)=>{
  const {id}=req.params;
 const listing =await Listing.findById(id);
 if(!listing){
    req.flash("err","listing are you trying to edit does not exist");
    return res.redirect("/listings");
  }
  
   let originalurl=listing.image.url;
    originalurl=originalurl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs",{listing,originalurl});

};

module.exports.updateListing=async (req,res)=>{
  const {id}=req.params;
  let listing= await Listing.findByIdAndUpdate(id,req.body.listing);
  if(typeof(req.file)!="undefined"){
    let imageurl=req.file.path;
    let imagefilename=req.file.filename;
    listing.image.url=imageurl;
    listing.image.filename=imagefilename;
    await listing.save();
  }

  req.flash("success","listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.distroyListing=async (req,res)=>{
  const {id}=req.params;
  const listing=await Listing.findById(id);
  for(let review of listing.reviews){
     await Review.findByIdAndDelete(review);
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success","listing deleted");
  res.redirect("/listings");
};