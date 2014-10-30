"use strict";

var bbxml = require("blue-button-xml");
var bbm = require("blue-button-meta");

var css = bbm.code_systems;

var includeCleanup = bbxml.cleanup;
var processor = bbxml.processor;
var common = bbxml.common;

var cleanup = module.exports = Object.create(includeCleanup);

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
    var units = this.js.units;
    if (units) {
        var cs = css.find("2.16.840.1.113883.11.20.9.21");
        if (cs) {
            var value = cs.codeDisplayName(units);
            if (value) {
                this.js = value;
            }
        }
    }
};

cleanup.augmentSimpleCode = function (oid) {
    var f = function () {
        if (this.js) {
            var cs = css.find(oid);
            if (cs) {
                this.js = cs.codeDisplayName(this.js);
            }
        }
    };
    return f;
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

cleanup.augmentConcept = function () {
    if (!this.js) {
        this.js = {};
    }

    if (common.exists(this.js.nullFlavor) && !this.js.original_text) {
        this.js = null;
        return;
    }

    if (this.js.system) {
        var cs = css.find(this.js.system);
        if (cs) {
            // Keep existing name if present
            if (!common.exists(this.js.name)) {
                var newName = cs.codeDisplayName(this.js.code);
                if (newName) {
                    this.js.name = newName;
                }
            }
            // but preferentially use our canonical names for the coding system
            var systemName = cs.name();
            if (systemName) {
                this.js.code_system_name = systemName;
            }
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

cleanup.augmentEffectiveTime = function () {
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

cleanup.augmentSimplifiedCode = function () {
    if (this.js) {
        // TODO: look up; don't trust the name to be present...
        this.js = this.js.name;
    }
};

cleanup.augmentSimplifiedCodeOID = function (oid) {
    var f = function () {
        if (this.js) {
            if (this.js.name) {
                this.js = this.js.name;
            } else if (this.js.code) {
                var cs = css.find(oid);
                if (cs) {
                    var name = cs.codeDisplayName(this.js.code);
                    if (name) {
                        this.js = name;
                    }
                }
            } else {
                this.js = null;
            }
        }
    };
    return f;
};
