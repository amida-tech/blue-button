//main module that exports all other sub modules

"use strict";

exports.parse = require("./lib/parser.js").parse;

exports.validator = require("./lib/validator.js");
