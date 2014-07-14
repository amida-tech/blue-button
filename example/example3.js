var validator = require("../index.js").validator;
var fs = require("fs");
var bb = JSON.parse(fs.readFileSync(__dirname + '/CCD1.json', 'utf8'));
var data = fs.readFileSync("CCD_1.xml").toString();

//parse xml into JS object
console.log(typeof bb);
//validator.setup;

var result = validator.validateDocumentModel(bb);

console.log(result);
