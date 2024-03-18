const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const Expresserror = require("./utils/Expresserror.js");
const Review = require("./models/reviews.js");
const Listings = require("./routes/listing.js");
const Reviews = require("./routes/review.js");
const ejsMate=require("ejs-mate");

main()
.then(()=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use("/listings/:id/review",Reviews);
app.use("/listings",Listings);
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use('/listings',express.static(path.join(__dirname, 'public')));
app.use('/listings/:id',express.static(path.join(__dirname, 'public')));

app.all("*",(req,res,next)=>{
    next(new Expresserror(404,"page not found"));
})

app.use((err,req,res,next)=>{
   const {statusCode=500,message="somthing went wrong"}=err;
   res.status(statusCode).render("listings/error.ejs",{message});
   //res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is lestining on port 8080");
})