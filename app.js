//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose")

//------------------------//
//   Database Config      //
//------------------------//

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//------------------------//
//  Express Middleware    //
//------------------------//

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {

    res.render("home")
});

app.get("/login", (req, res) => {

    res.render("login")
});

app.get("/register", (req, res) => {

    res.render("register")
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
})