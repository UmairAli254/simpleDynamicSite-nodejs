"use strict";
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Sr = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: function (val) {
            if (!validator.isEmail(val))
                throw new Error("Invalid Email Bro!");
        },
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now()
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

Sr.pre("save", async function () {
    this.pass = await bcrypt.hash(this.pass, 10);;
});

Sr.methods.registerToken = async function () {
    const payload = this._id.toString();

    const token = await jwt.sign(payload, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
}

Sr.methods.loginToken = async function () {
    const payload = this._id.toString();
    const token = await jwt.sign(payload, process.env.SECRET_KEY);
    return token;
}

const Rmr = new mongoose.model("registers", Sr);


module.exports = Rmr;