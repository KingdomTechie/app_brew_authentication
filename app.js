//jshint esversion:6
// Module on Passport security - https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/13559534#questions

require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const findOrCreate = require("mongoose-findorcreate");

//------------------------//
//  Express Middleware    //
//------------------------//

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//------------------------//
//   Sessions Middleware  //
//------------------------//

// Make sure session middleware is between Express Middleware and Database configuration
// Initialize Passport right below the session's options object

// app.set('trust proxy', 1)

// This is the session options object
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {secure: true}
}));

//------------------------//
// Passport Initilization //
//------------------------//

// This tells our app to use and initialize Passport
app.use(passport.initialize());

//This tells passport to deal with each session
app.use(passport.session());

//------------------------//
//   Database Config      //
//------------------------//

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

//------------------------//
//     Schema Plugins     //
//------------------------//

// This plugin handles: salting and hashing and to save Users into the MongoDB database
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)
;
const User = new mongoose.model("User", userSchema);

//------------------------//
//  Passport Utilization  //
//------------------------//

// These 3 lines of code authenticates the user using username and password.  Also serialzes and deserializes the user
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: ""
}), (accessToken, refreshToken, profile, done) =>{
    User.findOrCreate({googleId: profile.id}, (err, user) => {
        return done (err, user)
    })
});
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//------------------------//
//        Routes          //
//------------------------//
app.get("/", (req, res) => {
    console.log(req.session.cookie);
    res.render("home")
});

app.get("/secrets", (req, res) => {

    if(req.isAuthenticated()) {
        console.log(req.isAuthenticated());
        console.log(req.session);
        res.render("secrets")
    } else {
        console.log(req.isAuthenticated());
        console.log(req.session);
        res.redirect("/login")
    }
})

app.get("/login", (req, res) => {

    res.render("login")
});

app.post("/login", passport.authenticate("local"),(req, res) => {

        if(req.isAuthenticated()) {
            res.redirect("/secrets")
        } else {
            res.redirect("/login")
        }
    }
);

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login")
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", function(req,res){

    // This creates the user and stores it in the database.  Using passport-local-mongoose package
    User.register({username:req.body.username},req.body.password,(err,user) =>{
  
      if(err){
  
        console.log("Error in registering.",err);
  
        res.redirect("/register");
  
      }else{
  
        passport.authenticate("local")(req,res, () => {
  
          res.redirect("/secrets");
  
      });
  
  }});
  
  });
// app.post("/register", (req, res) => {

//     //The register() method comes from the passport-local-mongoose package; this creates our User for us.
//     User.register({username: req.body.username}, req.body.password, (err, user) => {
//         if (err) {
//             console.log(err);
//             res.redirect("/register")
//         } else {
//             passport.authenticate("local", {successRedirect: "/secrets", failureRedirect: "/login"})
//         }
//     })
// });


app.listen(3000, () => {
    console.log("Listening on port 3000");
});


 // const authenticate = User.authenticate();
    //     authenticate(req.body.username, req.body.password, (err, result) => {
    //         if (err) {
    //             console.log(err);

    //         } else {

    //             if(req.isAuthenticated) {
    //                 console.log(req.isAuthenticated());
                    
    //                 res.render("secrets")
    //             } else {
    //                 console.log(req.isAuthenticated());
                    
    //                 res.render("login")
    //             }
    //         }

    //     })