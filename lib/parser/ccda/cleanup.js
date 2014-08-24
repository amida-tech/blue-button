"use strict";

var uuid = require('node-uuid');
var common = require("./common");
var Processor = require("./processor");
var OIDs = require("./oids");
var _ = require("underscore");
var ComponentInstance = require("./componentInstance");

var Cleanup = module.exports = {};

Cleanup.clearNulls = function () {

    //Purges empty objects from arrays, added to improve phone/email support.
    for (var obj in this.js) {
        if (_.isArray(this.js[obj])) {
            for (var jsobj in this.js[obj]) {
                if (_.isArray(this.js[obj][jsobj].js) === false) {
                    if (_.isEmpty(this.js[obj][jsobj].js) && _.isUndefined(this.js[obj][jsobj].js) === false) {
                        delete this.js[obj][jsobj];
                    }
                }
            }
        }
    }

    if (!this.js || this.js === null) {
        return;
    }

    if ('object' === typeof this.js) {
        Object.keys(this.js).forEach(function (k) {
            if ((this.js[k] === null) ||
                Array.isArray(this.js[k]) && (this.js[k].length === 0 || this.js[k].filter(function (v) {
                    return v && v.js !== null;
                }).length === 0) ||
                this.js[k].js === null) {
                delete this.js[k];
            }
        }, this);

        if (Object.keys(this.js).length === 0) {
            this.js = null;
        }
    }

};

var resolveReference = Cleanup.resolveReference = function () {
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
        ret = Processor.asString(resolved[0]);
    } else {
        this.js.text = this.js.text && this.js.text.join("").match(/\s*(.*)\s*/)[1];
        ret = this.js.text;
    }

    this.js = ret || null;
};

var augmentAge = Cleanup.augmentAge = function () {

    var lookupOID = "2.16.840.1.113883.11.20.9.21"

    for (var lkp in OIDs[lookupOID].table) {
        if (lkp === this.js.units) {
            this.js = OIDs[lookupOID].table[lkp];
        }
    }

}

Cleanup.augmentConcept = function () {
    if (common.exists(this.js.nullFlavor)) {
        this.js = null;
        return;
    }

    if (!OIDs[this.js.system]) {
        OIDs[this.js.system] = {
            name: this.code_system_name || "OID " + this.js.system
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
        this.js.code_system_name = OIDs[this.js.system].name;
    }
};

Cleanup.augmentSimpleCode = function (oid) {
    var f = function () {
        if (this.js) {
            this.js = OIDs[oid].table[this.js];
        }
    };
    return f;
};

Cleanup.renameField = function (oldn, newn) {
    var f = function () {
        if (this.js[oldn]) {
            this.js[newn] = this.js[oldn];
            delete this.js[oldn];
        }
    };
    return f;
};

Cleanup.replaceWithObject = function (field, value) {
    var f = function () {
        if (this.js[field]) {
            this.js[field] = value;
        }
    };
    return f;
};

var augmentEffectiveTime = Cleanup.augmentEffectiveTime = function () {
    var returnArray = {};

    if (this.js) {
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

        if (this.js.null_flavor) {
            returnArray.null_flavor = this.js.null_flavor;
        }

    }

    this.js = returnArray;
};

var augmentIndividualName = Cleanup.augmentIndividualName = function () {
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

Cleanup.extractAllFields = function (flist) { // We need Cleanup function to become objects
    var r = function () {
        flist.forEach(function (k) {
            //console.log(">>>>>");
            //console.log(JSON.stringify(this,null,4));
            //console.log(this);
            //console.log("k", k);
            var tmp;
            if (this.js !== undefined && this.js !== null) {
                tmp = this.js[k];
                delete this.js[k]
            };
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

Cleanup.replaceWithField = function (field) {
    var r = function () {
        this.js = this.js && this.js[field];
    };
    return r;
};

Cleanup.removeField = function (field) {
    var r = function () {
        if (this.js) //HACK: added if
            delete this.js[field];
    }
    return r;
};

Cleanup.ensureMutuallyExclusive = function (ps) {
    return function () {
        var seen = [];
        ps.forEach(function (p) {
            var newps = [];
            this.js[p].forEach(function (v, i) {
                if (seen.indexOf(v.node) === -1) {
                    newps.push(v);
                }
                seen.push(v.node);
            }, this);
            this.js[p] = newps;
        }, this);
    };
};

Cleanup.hideFields = function (flist) {
    if (!Array.isArray(flist)) {
        flist = [flist];
    }
    return function () {
        flist.forEach(function (f) {
            if (!this.js) {
                return;
            }
            this.hidden[f] = this.js[f];
            delete this.js[f];
        }, this);
    };
};
