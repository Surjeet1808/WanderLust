const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const Listing =require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror=require("../utils/Expresserror.js");

app.use(express.static(path.join(__dirname,"public")));
//index route
router.get("/", async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  });
  
  //new listing
  router.get("/new", (req , res)=>{
      res.render("listings/new.ejs");
  });
  
  //show route
  router.get("/:id",async (req,res)=>{
      const {id}=req.params;
      const listing = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs",{listing});
  })
  
  //new listing
  router.post("/",wrapAsync(async (req,res)=>{
      if(!req.body.listing){
          throw new Expresserror(400,"send valide data for listing");
      }
      const newlisting = new Listing(req.body.listing);
      await newlisting.save();
      res.redirect("/listings");
  }));
  
  //edit
  router.get("/:id/edit",wrapAsync(async (req,res)=>{
      const {id}=req.params;
     const listing =await Listing.findById(id);
     res.render("listings/edit.ejs",{listing});
  }));
  
  //update
  router.put("/:id",wrapAsync(async (req,res)=>{
       const {id}=req.params;
      await Listing.findByIdAndUpdate(id,req.body.listing);
       res.redirect("/listings");
  }));
  
  //delete
  router.delete("/:id",wrapAsync(async (req,res)=>{
      const {id}=req.params;
      await Listing.findByIdAndDelete(id);
      res.redirect("/listings")
  }));

  module.exports = router;