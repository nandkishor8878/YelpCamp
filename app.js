var express            =require("express"),
    app                =express(),
    bodyParser         =require("body-parser"),
    mongoose           =require("mongoose"),
    passport           =require("passport"),
    flash              =require("connect-flash"),
    LocalStrategy      =require("passport-local"),
    Campground         =require("./models/campground"),
    Comment            =require("./models/comment"),
    seedDB             =require("./seed"),
    methodOverride     =require("method-override"),
    User               =require("./models/user");
    
//requring reuts
var indexRoutes        =require("./routs/index"),
    campgroundRoutes   =require("./routs/campgrounds"),
    commentRoutes      =require("./routs/comments");
    
    
var databaseURL = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect(databaseURL);
//mongoose.connect("mongodb://localhost/yelp_camp");
//mongoose.connect("mongodb://nkyelpcamp:nk903933@ds259070.mlab.com:59070/nkyelpcamp");
//console.log(databaseURL);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
app.use(require("express-session")({
    secret:"One day I will quanqur the world!",
    resave:false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error      =req.flash("error");
    res.locals.success    =req.flash("success");
    next();
});
//use routs
app.get("/profile", function(req, res){
    res.send("Working on profile section");
});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
app.locals.moment=require("moment");

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The YelpCamp server has started");
});