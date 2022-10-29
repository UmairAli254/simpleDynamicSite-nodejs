"use strict";
const mongoose = require("mongoose");
const validator = require("validator");

const Sr = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate(val) {
            if (!validator.isEmail(val))
                throw new Error("Invalid Email!");
        },
        required: true
    },
    message: {
        type: String,
        required: true,
        minlength: [7, "Please enter the a resonable description for contact"]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Model
const Mr = new mongoose.model("contact_form", Sr);

module.exports = Mr;