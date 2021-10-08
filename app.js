//jshint esversion:6
require("dotenv").config()
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const bcrypt = require("bcrypt")
const saltRounds = 10;


//------------------------//
//   Database Config      //
//------------------------//

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//------------------------//
//  Password encryption   //
//------------------------//



const User = new mongoose.model("User", userSchema);



//------------------------//
//  Express Middleware    //
//------------------------//

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

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

    const username = req.body.username;
    const password = req.body.password;
   
    User.findOne({email: username}, (err, foundUser) => {
        if(err) {
            console.log(err);
            res.redirect("/login")
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, (err, result) =>{
                    if (result) {
                        res.render("secrets")
                    } else {
                        res.render("login")
                    }
                })
            }
        }
    });
});

app.get("/logout", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {

    res.render("register")
});

app.post("/register", (req, res) => {

    const username = req.body.username;

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
       if (err) console.log(err);
       
        User.create({email: username, password: hash}, (err, createdUser) => {
            if(err) console.log(err);
            res.render("secrets")
        });
    })
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});