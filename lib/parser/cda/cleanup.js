"use strict";

var uuid = require('node-uuid');
var includeCleanup = require("../common/cleanup");
var common = require("blue-button-xml").common;
var processor = require("blue-button-xml").processor;
var OIDs = require("../common/oids");
var _ = require("underscore");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.augmentObservation = function () {

    if (this.js.problem_text) {
        if (this.js.problem_text.js) {
            if (!this.js.code.js.name) {
                this.js.code.js.name = this.js.problem_text.js;
            }
        }
    }

}

cleanup.augmentConcept = function (grunt) {

    if (!this.js) {
        this.js = {};
    }

    if (common.exists(this.js.nullFlavor) && !this.js.original_text) {
        this.js = null;
        return;
    }

    if (!OIDs[this.js.system]) {
        OIDs[this.js.system] = {
            name: this.code_system || "OID " + this.js.system
        };
    }

    // Keep existing name if present
    if (!common.exists(this.js.name)) {
        if (OIDs[this.js.system].table) {
            this.js.name = OIDs[this.js.system].table[this.js.code];
        }
    }

    // but preferentially use our canonical names for the coding system
    if (OIDs[this.js.system]) {
        if (OIDs[this.js.system].name !== 'OID undefined') {
            this.js.code_system_name = OIDs[this.js.system].name;
        }

    }

    //If original text is present w/out name, use it.
    if (this.js.original_text && !this.js.name) {
        this.js.name = this.js.original_text.js;
        delete this.js.original_text;
    } else {
        delete this.js.original_text;
    }

    if (this.js.nullFlavor) {
        delete this.js.nullFlavor;
    }

};

var augmentEffectiveTime = cleanup.augmentEffectiveTime = function () {
    var returnArray = {};

    if (!this.js) {
        var tempjs = {};
    } else {
        var tempjs = this.js;
    }

    if (tempjs.point) {
        returnArray.point = {
            "date": tempjs.point,
            "precision": tempjs.point_resolution
        };
    }

    if (tempjs.low) {
        returnArray.low = {
            "date": tempjs.low,
            "precision": tempjs.low_resolution
        };
    }

    if (tempjs.high) {
        returnArray.high = {
            "date": tempjs.high,
            "precision": tempjs.high_resolution
        };
    }

    if (this.js) {
        this.js = returnArray;
    }

};
