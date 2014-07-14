"use strict";

var bb = require("../index.js");
var fs = require("fs");

var data = fs.readFileSync("CCD_1.xml").toString();

//parse xml into JS object 
var doc = bb.xml(data);

//here are result of parsing
console.log(doc.errors);
console.log(doc.toString());

//get document type (e.g. CCDA) of parsed document 
var type = bb.senseXml(doc);
console.log(type);

//get document type (e.g. CCDA) of document from string (and return parsed xml if it is xml based type) 
var sense = bb.senseString(data);
console.log(sense);

//convert Xml document into JSON 
var result = bb.parseXml(doc);
console.log(JSON.stringify(result, null, 4));
console.log(result);

//convert string into JSON 
result = bb.parseString(data);
console.log(JSON.stringify(result, null, 4));

// result = // {“data”:“JSON model compliant data here…”, “meta”:{“version”:“1.0.0”,“type”:“CCDA”, … some other metadata}}



//generating CCDA out of JSON
var ccda = bb.generateCCDA(result);

console.log(ccda.toString());