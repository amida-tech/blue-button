"use strict";

var bb = require("../index.js");
var fs = require("fs");

var data = fs.readFileSync("cms_sample.txt").toString();

//sense cms text file
var info = bb.senseString(data);

//here are result of sensing
console.log(info);

//parse CMS data

var data = bb.parseText(data);

console.log(JSON.stringify(data,null,4));
