"use strict";

var uuid = require('node-uuid');
var includeCleanup = require("../common/cleanup");
var common = require("blue-button-xml").common;
var processor = require("blue-button-xml").processor;
var OIDs = require("../common/oids");
var _ = require("underscore");

var cleanup = module.exports = Object.create(includeCleanup);
