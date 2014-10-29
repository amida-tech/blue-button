"use strict";

var uuid = require('node-uuid');
var libCleanup = require("blue-button-xml").cleanup;
var common = require("blue-button-xml").common;
var processor = require("blue-button-xml").processor;
var OIDs = require("../common/oids");
var _ = require("underscore");

var cleanup = module.exports = {};

cleanup.renameField = libCleanup.renameField;
cleanup.replaceWithObject = libCleanup.replaceWithObject;
cleanup.extractAllFields = libCleanup.extractAllFields;
cleanup.replaceWithField = libCleanup.replaceWithField;
cleanup.removeField = libCleanup.removeField;

var resolveReference = cleanup.resolveReference = function () {
    if (!common.exists(this.js)) {
        return;
    }

    var r = this.js.reference && this.js.reference.match(/#(.*)/);
    var resolved = null;
    if (r && r.length == 2) {
        resolved = common.xpath(this.node, "//*[@ID='" + r[1] + "']/text()");
    }
    var ret = null;
    if (resolved && resolved.length === 1) {
        ret = processor.asString(resolved[0]);
    } else {
        this.js.text = this.js.text && this.js.text.join("").match(/\s*(.*)\s*/)[1];
        ret = this.js.text;
    }

    this.js = ret || null;
};

var augmentAge = cleanup.augmentAge = function () {

    var lookupOID = "2.16.840.1.113883.11.20.9.21"

    for (var lkp in OIDs[lookupOID].table) {
        if (lkp === this.js.units) {
            this.js = OIDs[lookupOID].table[lkp];
        }
    }

}

cleanup.augmentConcept = function () {

    if (this.js === null) {
        this.js = {};
    }

    if (common.exists(this.js.nullFlavor)) {
        this.js = null;
        return;
    }

    if (!OIDs[this.js.system] && this.js.system) {
        OIDs[this.js.system] = {
            name: this.code_system_name || "OID " + this.js.system
        };
    }

    // Keep existing name if present
    if (!common.exists(this.js.name) && this.js.system) {
        if (OIDs[this.js.system].table) {
            var newName = OIDs[this.js.system].table[this.js.code];
            if (newName) {
                this.js.name = newName;
            }
        }
    }

    // but preferentially use our canonical names for the coding system
    if (OIDs[this.js.system]) {
        this.js.code_system_name = OIDs[this.js.system].name;
    }
};

cleanup.augmentSimpleCode = function (oid) {
    var f = function () {
        if (this.js) {
            this.js = OIDs[oid].table[this.js];
        }
    };
    return f;
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

var augmentIndividualName = cleanup.augmentIndividualName = function () {
    if (this.js) {
        if (this.js.middle && this.js.middle.length > 0) {
            this.js.first = this.js.middle[0];
            if (this.js.middle.length > 1) {
                this.js.middle.splice(0, 1);
            } else {
                delete this.js.middle;
            }
        }
        if (!this.js.first && !this.js.last && this.js.freetext_name) {
            var names = this.js.freetext_name.split(' ').filter(function (piece) {
                return piece.length > 0;
            });
            var n = names.length;
            if (n > 0) {
                this.js.last = names[n - 1];
                if (n > 1) {
                    this.js.first = names[0];
                }
                if (n > 2) {
                    this.js.middle = names.slice(1, n - 1);
                }
            }
        }
        delete this.js.freetext_name;
    }
};
