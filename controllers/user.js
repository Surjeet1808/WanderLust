const User=require("../models/user.js");
module.exports.signupForm=(req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signupUser=async(req,res)=>{
    try{
     let{username,email,password}=req.body;
    const newUser=new User({email,username});
    await User.register(newUser,password);
    req.login(newUser,(err)=>{
       if(err){
         return next(err);
       }
       req.flash("success","welcome to wanderlust");
       res.redirect("/listings");
    })
    }
    catch(e){
       req.flash("err",e.message);
       res.redirect("/signup");
    }
 };

 module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.loginUser=async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let redirecturl=res.locals.redirectUrl?res.locals.redirectUrl:"/listings";
    res.redirect(redirecturl);
 };

 module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
          return next(err);
       }
       req.flash("success","you are logged out!");
       res.redirect("/listings");
    })
 }