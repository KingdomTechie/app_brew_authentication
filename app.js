//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

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
    User.findOne({email: username, password: password}, (err, foundUser) => {
        if(err) {
            console.log(err);
            res.redirect("/login")
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets")
                } else {
                    res.render("login")
                }
            } else {
                res.render("login")
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
    const password = req.body.password;

    User.create({email: username, password: password}, (err, createdUser) => {
        if(err) console.log(err);
        res.render("secrets")
    });
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});