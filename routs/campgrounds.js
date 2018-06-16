var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - show all campground
router.get("/campground", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get searched campground from DB
        Campground.find({name:regex}, function(err, allcampground){
           if(err){
               console.log(err);
           } else {
               if(allcampground.length>0){
                   res.render("campgrounds/index",{campgrounds:allcampground});
               }
               else{
                //   req.flash("error", "Nothing found");
                   res.render("campgrounds/index",{campgrounds:allcampground,"error":"Nothing found"});
               }
           }
        });
    }
    else{
    // Get all campground from DB
    Campground.find({}, function(err, allcampground){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allcampground});
       }
    });
   }
});

//CREATE - add new campground to DB
router.post("/campground",middleware.isLoggedIn, function(req, res){
    // get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, price: price, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campground page
            //console.log(newlyCreated);
            res.redirect("/campground");
        }
    });
});

//NEW - show form to create new campground
router.get("/campground/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/campground/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //console.log(foundCampground.comments[0])
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campground/:id/edit",middleware.checkCampgroundOwnership,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/campground/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campground");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campground/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campground/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campground");
      } else {
          res.redirect("/campground");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;

