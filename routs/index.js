var express   =require("express");
var router    =express.Router();
var User      =require("../models/user");
var passport  =require("passport");

router.get("/",function(req,res){
    res.render("landing");
});

// register form
router.get("/register",function(req, res) {
    res.render("register");
});

//register logic
router.post("/register",function(req, res) {
    var newUser  = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/campground");
            });
        }
    });
});

// login form
router.get("/login",function(req, res) {
    res.render("login");
});

//register logic
router.post("/login",passport.authenticate("local",
       {
           successRedirect:"/campground",
           failureRedirect:"/login"
    
       }),function(req, res) {
    
});

//logout
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Succesfully Logged Out")
    res.redirect("/campground");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}
module.exports=router;