//main module that exports all other sub modules

"use strict";

var sense = require("./lib/sense.js");
exports.senseXml = sense.senseXml;
exports.senseString = sense.senseString;

exports.xml = require("./lib/xml.js").parse;

var parser = require("./lib/parser.js");
exports.parseXml = parser.parseXml;
exports.parseString = parser.parseString;

//need to review if this is still needed
exports.parse = parser.parse;


exports.generateSchema = require("./lib/schema.js").generateSchema;

exports.validator = require("./lib/validator.js");

/*
	//get access to current version of NPM package

	var version = require('./package.json').version;
	console.log(version);
*/
