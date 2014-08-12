//main module that exports all other sub modules

"use strict";

var sense = require("./lib/sense.js");
exports.senseXml = sense.senseXml;
exports.senseString = sense.senseString;

exports.xml = require("./lib/xml.js").parse;

var parser = require("./lib/parser.js");
exports.parseXml = parser.parseXml;
exports.parseString = parser.parseString;
exports.parseText = parser.parseText;
exports.parseText2 = parser.parseText2;

//need to review if this is still needed
exports.parse = parser.parse;

// ccda generation
exports.generateCCDA = require("./lib/generator/ccda/generator.js").genWholeCCDA;

// testing for ccda generation
//exports.testCCDA = require("./test/test-lib.js").testXML;

//remove old validator.js from /lib
exports.validator = require("./lib/validator/validator.js");

/*
	//get access to current version of NPM package

	var version = require('./package.json').version;
	console.log(version);
*/
