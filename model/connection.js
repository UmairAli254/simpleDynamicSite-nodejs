"use strict";
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/simplesite", {
    family: 4
}) 
    .then(() => console.log("Connected Successfully!"))
    .catch(err => console.log(err)); 