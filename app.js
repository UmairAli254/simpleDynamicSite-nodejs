"use strict";
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const hbs = require("hbs");
require("./model/connection");
const Mr = require("./model/contact-form");
const RMr = require("./model/register");
const bcrypt = require("bcrypt");
const cookie_parser = require("cookie-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const noCache = require("nocache");

// Variables
const publicPath = __dirname + "/public";
const partialsPath = __dirname + "/views/partials";

// Middlewares
app.set("view engine", "hbs");
app.use(express.static(publicPath));
hbs.registerPartials(partialsPath);
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookie_parser());
app.use(noCache());



app.get("/", (req, res) => {
    res.render("home");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/profile", (req, res) => {
    try {
        const loginToken = req.cookies.loginToken;
        const secret_key = process.env.SECRET_KEY;
        const user_name = req.cookies.loggedInUserName;
        const isVerify = jwt.verify(loginToken, secret_key);

        if (isVerify)
            res.render("profile", {
                userName: user_name
            });
    } catch {
        res.redirect("//localhost:3000/login");
    }
});
app.get("/logout", (req, res) => {
    res.clearCookie("loginToken");
    res.clearCookie("loggedInUserName");
    res.redirect("//localhost:3000");
})



// POST Routes

// For Contact Form
app.post("/submit-contact-form", async (req, res) => {
    try {
        const data = new Mr(req.body);
        const re = await data.save()
        console.log(re);
        res.redirect("http://localhost:3000");
    } catch (err) {
        console.log(err);
    }
});

// For Registration Form
app.post("/register", async (req, res) => {
    try {
        const pass = req.body.pass;
        const c_pass = req.body.c_pass;

        if (pass === c_pass) {
            const data = new RMr(req.body);
            data.registerToken();
            await data.save();
            res.redirect("//localhost:3000");
        } else
            res.status(500).send("Password doesen't matched!");

    } catch (err) {
        res.status(501).send(err);
    }
});

// For Login Form
app.post("/login", async (req, res) => {
    try {
        const pass = req.body.pass;
        const email = req.body.email;

        const data = await RMr.findOne({ email });
        const token = await data.loginToken();
        res.cookie("loginToken", token);
        const isMatch = await bcrypt.compare(pass, data.pass);
        if (isMatch) {
            res.cookie("loggedInUserName", data.name);
            res.redirect("http://localhost:3000/profile");
        }
        else
            res.status(500).send("Password dosen't matched!");

    } catch {
        res.status(404).send("Email not found!");
    }
})









app.listen(port, "localhost", () => {
    console.log("Server is running port", port);
})