if(process.env.Node_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Expresserror = require("./utils/Expresserror.js");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

//let url='mongodb://127.0.0.1:27017/wanderlust';
let url=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log(err);
});


async function main(){
    mongoose.connect(url);
}

const store=MongoStore.create({
    mongoUrl:url,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60,
})
store.on("error",()=>{
  console.log("error occured in mongo session store",err);
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  };
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.err=req.flash("err");
    res.locals.curruser=req.user;
    next();
 });

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use("/listings/:id/review",reviewsRouter);
app.use("/listings",listingRouter);
app.use("/",userRouter);
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use('/listings',express.static(path.join(__dirname, 'public')));
app.use('/listings/:id',express.static(path.join(__dirname, 'public')));

app.get("/terms",(req,res)=>{
   res.render("footer/terms.ejs");
});
app.get("/privacy",(req,res)=>{
    res.render("footer/privacy.ejs");
 });

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