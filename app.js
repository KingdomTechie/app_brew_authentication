//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

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

app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false
}));

// This tells our app to use and initialize Passport
app.use(passport.initialize());

//This tells passport to deal with each session
app.use(passport.session());


//------------------------//
//   Database Config      //
//------------------------//

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// This plugin handles: salting and hashing and to save Users into the MongoDB database
userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema);




//------------------------//
//        Routes          //
//------------------------//
app.get("/", (req, res) => {

    res.render("home")
});

app.get("/login", (req, res) => {

    res.render("login")
});

app.post("/login", (req, res) => {

    
});

app.get("/logout", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {

    res.render("register")
});

app.post("/register", (req, res) => {

    
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});