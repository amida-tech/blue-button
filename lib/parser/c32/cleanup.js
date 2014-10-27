"use strict";

var uuid = require('node-uuid');
var libCleanup = require("../../../libxml/cleanup");
var common = require("../../../libxml/common");
var processor = require("../../../libxml/processor");
var OIDs = require("./oids");
var _ = require("underscore");

var cleanup = module.exports = {};

cleanup.clearNulls = libCleanup.clearNulls;

cleanup.augmentObservation = function () {

    if (this.js.problem_text.js) {
        if (!this.js.code.js.name) {
            this.js.code.js.name = this.js.problem_text.js;
        }
    }

}

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

cleanup.augmentSimpleCode = function (oid) {
    var f = function () {
        if (this.js) {
            this.js = OIDs[oid].table[this.js];
        }
    };
    return f;
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

cleanup.extractAllFields = function (flist) { // We need cleanup function to become objects
    var r = function () {
        flist.forEach(function (k) {
            //console.log(">>>>>");
            //console.log(JSON.stringify(this,null,4));
            //console.log(this);
            //console.log("k", k);
            var tmp = this.js[k];
            delete this.js[k];
            if (tmp) { //HACK: added this if
                if (tmp.js) {
                    Object.keys(tmp.js).forEach(function (m) {
                        if (this.js[m] === undefined) {
                            this.js[m] = tmp.js[m];
                        }
                    }, this);
                }
            }
        }, this);
    };
    return r;
};

cleanup.replaceWithField = function (field) {
    var r = function () {
        this.js = this.js && this.js[field];
    };
    return r;
};

cleanup.removeField = function (field) {
    var r = function () {
        if (this.js) //HACK: added if
            delete this.js[field];
    }
    return r;
};
