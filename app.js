//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const {Schema, model} = mongoose;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new Schema ({
    email: String,
    password: String,
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});

const User = model ("user", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const user1 = new User ({
        email: req.body.username,
        password: req.body.password,
    });

    user1.save().then(()=>{
        
        res.render("secrets")
    });

});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then((user) => {
       if(user){
        if (password === user.password){
            res.render("secrets");
        }
        else {res.send("password is incorrect");}}
        else {res.send("No such user, check your email");}
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000.");
});
