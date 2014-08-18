"use strict";

var bb = require("../index.js");
var fs = require("fs");

var data = fs.readFileSync("cms_sample.txt").toString();

//sense cms text file
var info = bb.senseString(data);

//here are result of sensing
console.log(info);

//parse CMS data

var data = bb.parseText2(data);
//var data = bb.parseText(data);

//console.log(JSON.stringify(data.interim,null,4));
//console.log(JSON.stringify(data.data.demographics,null,4));



var validator = require("../index.js").validator;
//var bb = JSON.parse(fs.readFileSync(__dirname + '/CCD1.json', 'utf8'));
//var data = fs.readFileSync("CCD_1.xml").toString();


var val = validator.validateDocumentModel(data);
//var val = validator.validateSectionObj(data.data.demographics, "demographics");
var val = validator.validateSectionObj(data.data.claims[0], "claim");

console.log(JSON.stringify(data,null,4));

console.log(data.meta.sections);
console.log("---");
console.log(val);
console.log(JSON.stringify(validator.getLastError(),null,4));
