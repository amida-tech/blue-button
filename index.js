//main module that exports all other sub modules

"use strict";

// sense file type
var sense = require("./lib/sense.js");
exports.senseXml = sense.senseXml;
exports.senseString = sense.senseString;

// xml utilities
exports.xml = require("blue-button-xml").xmlUtil;

// CCDA, C32, and CMS parser
var parser = require("./lib/parser.js");
exports.parseXml = parser.parseXml;
exports.parseString = parser.parseString;
exports.parseText = parser.parseText;
exports.parse = parser.parse;

// CCDA (CCD) generation
exports.generateCCDA = require("blue-button-generate").generateCCD;

// Data model schema validation
exports.validator = require("blue-button-model").validator;
