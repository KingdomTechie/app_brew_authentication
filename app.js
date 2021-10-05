//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const app = express();
app.use(urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");




app.listen(3000, () => {
    console.log("Listening on port 3000");
})