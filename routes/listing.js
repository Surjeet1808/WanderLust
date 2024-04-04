const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const listingcontroller =require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({storage});


router
  .route("/")
  //index route
  .get(wrapAsync(listingcontroller.index))
  //new listing
  .post(isLoggedIn,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.newListing)); 

  
  //new listing
  router.get("/new",isLoggedIn,listingcontroller.newListingForm);
  
router
  .route("/:id")
  //show route
  .get(wrapAsync(listingcontroller.showListing)) 
  //update
  .put(isLoggedIn,isOwner,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.updateListing))
  //delete
  .delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.distroyListing));
  
  //update form
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.updateForm));

  module.exports = router;