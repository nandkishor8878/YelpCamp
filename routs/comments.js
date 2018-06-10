var express   =require("express");
var router    =express.Router({mergeParams: true});
var Campground=require("../models/campground");
var Comment   =require("../models/comment");
var middleware=require("../middleware");


router.get("/campground/:id/comments/new",middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    });
});
//add comment
router.post("/campground/:id/comments",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campground");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                console.log(err);
               }
               else{
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   //campground.author.username
                   campground.save();
                   //console.log(comment);
                   res.redirect("/campground/"+campground._id);
               }
            });
        }
    });   
});
// EDIT COMMENT ROUTE
router.get("/campground/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
                if(err){
                    console.log(err);
                    res.redirect("back");
                }
                else{
                    res.render("comments/edit", {campground_id: req.params.id,comment:foundComment});
                }
    });
});
// comment Update rout
router.put("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    // find and update the correct comment
    Comment.findByIdAndUpdate(req.params.campground_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campground/" + req.params.id);
       }
    });
});

// DESTROY COMMENT ROUTE
router.delete("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campground/" + req.params.id);
      }
   });
});

module.exports=router;