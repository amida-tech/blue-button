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

cleanup.augmentConcept = function () {
    if (!this.js) {
        this.js = {};
    }

    if (common.exists(this.js.nullFlavor) && !this.js.original_text) {
        this.js = null;
        return;
    }

    if (this.js.system && OIDs[this.js.system]) {
        // Keep existing name if present
        if (!common.exists(this.js.name)) {
            if (OIDs[this.js.system].table) {
                var newName = OIDs[this.js.system].table[this.js.code];
                if (newName) {
                    this.js.name = newName;
                }
            }
        }

        // but preferentially use our canonical names for the coding system
        if (OIDs[this.js.system].name) {
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
    if (this.js) {
        var returnArray = {};

        if (this.js.point) {
            returnArray.point = {
                "date": this.js.point,
                "precision": this.js.point_resolution
            };
        }

        if (this.js.low) {
            returnArray.low = {
                "date": this.js.low,
                "precision": this.js.low_resolution
            };
        }

        if (this.js.high) {
            returnArray.high = {
                "date": this.js.high,
                "precision": this.js.high_resolution
            };
        }

        if (this.js.center) {
            returnArray.center = {
                "date": this.js.center,
                "precision": this.js.center_resolution
            };
        }

        this.js = returnArray;
    }
};
