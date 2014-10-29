"use strict";

var uuid = require('node-uuid');
var includeCleanup = require("../common/cleanup");
var common = require("blue-button-xml").common;
var processor = require("blue-button-xml").processor;
var OIDs = require("../common/oids");
var _ = require("underscore");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.augmentObservation = function () {

    if (this.js.problem_text.js) {
        if (!this.js.code.js.name) {
            this.js.code.js.name = this.js.problem_text.js;
        }
    }

};
