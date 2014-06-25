var validator = require("../index.js").validator;
var fs = require("fs");

var bb = JSON.parse(fs.readFileSync(__dirname + '/CCD1.json', 'utf8').toString());

//validator.setup;

var result = validator.validateDocumentModel(bb);

console.log(result);