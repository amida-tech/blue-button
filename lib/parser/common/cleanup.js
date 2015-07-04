"use strict";

var bbxml = require("blue-button-xml");
var bbm = require("blue-button-meta");

var css = bbm.code_systems;

var includeCleanup = bbxml.cleanup;
var processor = bbxml.processor;
var common = bbxml.common;
var xmlUtil = bbxml.xmlUtil;

var cleanup = module.exports = Object.create(includeCleanup);

var resolveReference = cleanup.resolveReference = function (input) {
    if ((input !== null) && (input !== undefined)) {
        var r = input.reference && input.reference.match(/#(.*)/);
        var resolved = null;
        if (r && r.length === 2) {
            resolved = xmlUtil.xpath(this.node, "//*[@ID='" + r[1] + "']/text()");
        }
        var ret = null;
        if (resolved && resolved.length === 1) {
            ret = processor.asString(resolved[0]);
        } else {
            input.text = input.text && input.text.join("").match(/\s*(.*)\s*/)[1];
            ret = input.text;
        }

        input = ret || null;
    }
    return input;
};

var augmentAge = cleanup.augmentAge = function (input) {
    var units = input.units;
    if (units) {
        var cs = css.find("2.16.840.1.113883.11.20.9.21");
        if (cs) {
            input = cs.codeDisplayName(units);
            if (input) {
                return input;
            }
        }
    }
    return input;
};

cleanup.augmentSimpleCode = function (oid) {
    var f = function (input) {
        if (input) {
            var cs = css.find(oid);
            if (cs) {
                return cs.codeDisplayName(this.js);
            }
        }
        return input;
    };
    return f;
};

var augmentIndividualName = cleanup.augmentIndividualName = function (input) {
    if (input) {
        if (input.middle && input.middle.length > 0) {
            input.first = input.middle[0];
            if (input.middle.length > 1) {
                input.middle.splice(0, 1);
            } else {
                delete input.middle;
            }
        }
        if (!input.first && !input.last && input.freetext_name) {
            var names = input.freetext_name.split(' ').filter(function (piece) {
                return piece.length > 0;
            });
            var n = names.length;
            if (n > 0) {
                input.last = names[n - 1];
                if (n > 1) {
                    input.first = names[0];
                }
                if (n > 2) {
                    input.middle = names.slice(1, n - 1);
                }
            }
        }
        delete input.freetext_name;
    }
    return input;
};

cleanup.augmentConcept = function (input) {
    if (input) {
        if (common.exists(input.nullFlavor) && !input.original_text) {
            return null;
        }

        if (input.system) {
            var cs = css.find(input.system);
            if (cs) {
                // Keep existing name if present
                if (!common.exists(input.name)) {
                    var newName = cs.codeDisplayName(input.code);
                    if (newName) {
                        input.name = newName;
                    }
                }
                // but preferentially use our canonical names for the coding system
                var systemName = cs.name();
                if (systemName) {
                    input.code_system_name = systemName;
                }
            }
        }

        //If original text is present w/out name, use it.
        if (input.original_text && !input.name) {
            input.name = input.original_text;
            delete input.original_text;
        } else {
            delete input.original_text;
        }

        if (input.nullFlavor) {
            delete this.js.nullFlavor;
        }
    }
    return input;
};

cleanup.augmentEffectiveTime = function (input) {
    if (input) {
        var returnArray = {};
        var empty = true;

        if (input.point) {
            returnArray.point = {
                "date": input.point,
                "precision": input.point_resolution
            };
            empty = false;
        }

        if (input.low) {
            returnArray.low = {
                "date": input.low,
                "precision": input.low_resolution
            };
            empty = false;
        }

        if (input.high) {
            returnArray.high = {
                "date": input.high,
                "precision": input.high_resolution
            };
            empty = false;
        }

        if (input.center) {
            returnArray.center = {
                "date": input.center,
                "precision": input.center_resolution
            };
            empty = false;
        }

        if (empty) {
            return null;
        } else {
            return returnArray;
        }
    }
    return input;
};

cleanup.augmentSimplifiedCode = function (input) {
    if (input) {
        // TODO: look up; don't trust the name to be present...
        return input.name;
    }
    return input;
};

cleanup.augmentSimplifiedCodeOID = function (oid) {
    var f = function (input) {
        if (input) {
            if (input.name) {
                input = input.name;
            } else if (input.code) {
                var cs = css.find(oid);
                if (cs) {
                    var name = cs.codeDisplayName(input.code);
                    if (name) {
                        input = name;
                    }
                }
            } else {
                input = null;
            }
        }
        return input;
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

    return function (input) {
        var status = input && input.problemStatus;
        if (status) {
            var value = dict[status];
            if (value) {
                var observation = input.observation;
                if (!observation) {
                    input.observation = {
                        status: value
                    };
                } else if (!observation) {
                    input.observation = {
                        status: value
                    };
                } else if (!observation.status) {
                    input.observation.status = value;
                }
            }
            delete input.problemStatus;
        }
        return input;
    };
})();
