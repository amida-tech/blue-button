//main module that exports all other sub modules

"use strict";

var sense = require("./lib/sense.js");
exports.senseXml = sense.senseXml;
exports.senseString = sense.senseString;

exports.xml = require("blue-button-xml").xmlParser;

var parser = require("./lib/parser.js");
exports.parseXml = parser.parseXml;
exports.parseString = parser.parseString;
exports.parseText = parser.parseText;
exports.parseText2 = parser.parseText2;

//need to review if this is still needed
exports.parse = parser.parse;

// ccda generation
exports.generateCCDA = require("blue-button-generate").generateCCD;

// testing for ccda generation
//exports.testCCDA = require("./test/test-lib.js").testXML;

exports.validator = require("blue-button-model").validator;

/*
	//get access to current version of NPM package

	var version = require('./package.json').version;
	console.log(version);
*/
