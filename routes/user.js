const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller=require("../controllers/user.js");

router
 .route("/signup")
 //signup form
 .get(usercontroller.signupForm)
 //signup
 .post(wrapAsync(usercontroller.signupUser));

router
 .route("/login")
 //login form
 .get(usercontroller.loginForm)
 //login
 .post(
   saveRedirectUrl,
   passport.authenticate("local",{failureRedirect: "/login",failureFlesh: true}),
   usercontroller.loginUser
);

//logout user
router.get("/logout",usercontroller.logoutUser);

module.exports = router;