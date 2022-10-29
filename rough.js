"use strict";
const jwt = require("jsonwebtoken");

async function fun() {
    const payload = "Umair Ali Bhai";
    const secret_key = "This is a secret key";

    const token = await jwt.sign(payload, secret_key);
    console.log(token);

    const isVerify = await jwt.verify(token, "This is a secret key");
    if(isVerify)
        console.log("Chill");
    else
        console.log("Shit");
    // console.log(isVerify);
}

fun();