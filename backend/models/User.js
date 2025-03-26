var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();


mongoose.connect("mongodb://localhost:27017/SharesphereFiles")





// const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("User", UserSchema);
