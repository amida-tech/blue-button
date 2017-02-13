"use strict";

var bbxml = require("blue-button-xml");
var bbm = require("blue-button-meta");
var _ = require("lodash");

var css = bbm.code_systems;

var includeCleanup = bbxml.cleanup;
var processor = bbxml.processor;
var common = bbxml.common;
var xmlUtil = bbxml.xmlUtil;

var cleanup = module.exports = Object.create(includeCleanup);

var lookupReference = function (node, id) {
    // ensure element itself exists
    var resolved = xmlUtil.xpath(node, "//*[@ID='" + id + "']");
    if (!resolved || resolved.length !== 1) {
        return null;
    }

    // check for contained text
    var textNode = xmlUtil.xpath(resolved[0], "./text()")[0];
    var containedText = textNode && processor.asString(textNode);

    if (containedText) {
        return containedText;
    }

    return null;
};

var resolveReference = cleanup.resolveReference = function () {
    if (!common.exists(this.js)) {
        return;
    }

    var ret = null;

    // ignore reference if the element itself contains text
    if (this.js.text) {
        ret = this.js.text.join("").match(/\s*(.*)\s*/)[1];
    } else {
        var r = this.js.reference && this.js.reference.match(/#(.*)/);
        var resolved = null;
        if (r && r.length === 2) {
            resolved = lookupReference(this.node, r[1]);
        }
        if (resolved) {
            ret = resolved;
        }
    }

    this.js = ret || null;
};

var resolveReferenceOntoName = cleanup.resolveReferenceOntoName = function () {
    if (!common.exists(this.js)) {
        return;
    }

    var r = this.js.reference && this.js.reference.match(/#(.*)/);
    var resolved = null;
    if (r && r.length === 2) {
        resolved = lookupReference(this.node, r[1]);
    }
    var ret = null;
    if (resolved) {
        this.js.name = resolved;
        delete this.js.reference;
    }
};

var augmentAge = cleanup.augmentAge = function () {
    var units = this.js && this.js.units;
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

cleanup.nullFlavorDisplayNames = {
    "NI": "no information",
    "NA": "not applicable",
    "UNK": "unknown",
    "ASKU": "asked, but not known",
    "NAV": "temporarily unavailable",
    "NASK": "not asked",
    "TRC": "trace",
    "OTH": "other",
    "PINF": "positive infinity",
    "NINF": "negative infinity",
    "MSK": "masked"
};

// if a field is absent or is an object that looks like a nullFlavor code,
// replace it with the nullFlavor display name from a sibling nullFlavorField
cleanup.replaceStringFieldWithNullFlavorName = function (field) {
    return function () {
        if (!this.js) {
            return null;
        }

        if (_.get(this, ["js", field, "code_system_name"]) === "Null Flavor") {
            this.js[field] = cleanup.nullFlavorDisplayNames[this.js[field].code];
        }
    };
};

cleanup.augmentConcept = function () {
    if (!this.js) {
        this.js = {};
    }

    var nullFlavorDisplayNames = cleanup.nullFlavorDisplayNames;

    if (common.exists(this.js.nullFlavor)) {
        this.js.code = this.js.nullFlavor;
        this.js.code_system_name = "Null Flavor";
        this.js.name = nullFlavorDisplayNames[this.js.nullFlavor];
        delete this.js.nullFlavor;
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
    if (this.js.original_text && (!this.js.name || this.js.code_system_name === 'Null Flavor')) {
        this.js.name = this.js.original_text.js;
        delete this.js.original_text;
    } else {
        delete this.js.original_text;
    }

    if (this.js.nullFlavor) {
        delete this.js.nullFlavor;
    }
};

cleanup.selectValueFields = function () {
    var ret = null;
    if (this.js) {

        var type = _.get(this, "js.type");

        if (type === "ST") {
            ret = {
                text: _.get(this, "js.textValue")
            };
        } else if (type === "PQ") {
            ret = _.get(this, "js.physicalQuantityValue.js");
        } else if (type === "CD") {
            ret = _.get(this, "js.codeValue.js");
        }
    }

    this.js = ret;
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

cleanup.allergiesProblemStatusToHITSP = (function () {
    var dict = {};
    dict.active = {
        "name": "Active",
        "code": "55561003",
        "code_system_name": "SNOMED CT"
    };
    dict.suspended = dict.aborted = {
        "name": "Inactive",
        "code": "73425007",
        "code_system_name": "SNOMED CT"
    };
    dict.completed = {
        "name": "Resolved",
        "code": "413322009",
        "code_system_name": "SNOMED CT"
    };

    return function () {
        var status = this.js && this.js.problemStatus;
        if (status) {
            var value = dict[status];
            if (value) {
                var observation = this.js.observation;
                if (!observation) {
                    this.js.observation = {
                        status: value
                    };
                } else if (!observation.js) {
                    observation.js = {
                        status: value
                    };
                } else if (!observation.js.status) {
                    observation.js.status = value;
                }
            }
            delete this.js.problemStatus;
        }
    };
})();
