//main module that exports all other sub modules

"use strict";

exports.parse = require("./lib/parser.js").parse;

exports.generateSchema = require("./lib/schema.js").generateSchema;

exports.validator = require("./lib/validator.js");
