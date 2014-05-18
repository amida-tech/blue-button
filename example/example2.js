"use strict";

//Parsing just a specific section

var bb = require("../index.js");
var fs = require("fs");

var data = fs.readFileSync("CCD_Vitals.xml").toString();

//parse xml into JS object 
var doc = bb.xml(data);

//here are result of parsing
//console.log(doc.errors);
//console.log(doc.toString());


//convert Xml document into JSON 
var result = bb.parseXml(doc, {component: "ccda_vitals"});

console.log(JSON.stringify(result, null, 4));
//console.log(result);

