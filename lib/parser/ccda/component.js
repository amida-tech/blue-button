"use strict";

var util = require("util");
var common = require("./common");
var assert = require("assert");
var Parser = require("./parser");
var Processor = require("./processor");
var Cleanup = require("./cleanup");
var XDate = require("xdate");
var ComponentInstance = require("./componentInstance");

var deepForEach = common.deepForEach;

var Component = {};

Component.classInit = function (name) {
    this.componentName = name;
    this.cleanupSteps = [];
    this.parsers = [];
};

Component.classInit("Component");

Component.define = function (name) {
    var r = Object.create(this);
    r.classInit(name);
    return r;
};

Component.instance = function (parent) {
    var r = Object.create(ComponentInstance);
    r.js = {};
    r.hidden = {};
    r.component = this;
    if (parent) {
        r.parent = parent;
        r.errors = parent.errors;
    } else {
        r.errors = [];
    }
    return r;
};

Component.templateRoot = function (roots) {
    this.templateRoots = [];

    if (!Array.isArray(roots)) {
        roots = [roots];
    }

    roots.forEach(function (root, i) {
        this.templateRoots.push(root);
    }, this);

    return this;
};

Component.xpath = function () {
    //console.log(this.templateRoots);
    var ret = this.templateRoots.map(function (r) {
        return util.format(".//h:templateId[@root='%s']/..", r);
    }).join(" | ");

    return ret;
};

Component.withNegationStatus = function (t) {
    this._negationStatus = t;
    return this;
};

Component.withMood = function (m) {
    if (!util.isArray(m)) {
        m = [m];
    }
    this._moods = m;
    return this;
};

Component.fields = function (parsers) {
    this.parsers = [];
    parsers.forEach(function (p, i) {
        var np = new Parser();
        np.init.apply(np, p);
        this.parsers.push(np);
    }, this);

    return this;
};

var componentHiearcy = function (c) {
    var result = [];
    for (var obj = c; obj; obj = Object.getPrototypeOf(obj)) {
        result.unshift(obj);
    }
    return result;
}

var normalizeInputKeys = function (input) {
    if (!input) {
        return null;
    }
    if (Array.isArray(input)) {
        return input.length > 0 ? input : null;
    } else {
        return [input];
    }
}

Component.cleanupStep = function (steps, inclusiveKeys, exclusiveKeys) {
    if (!Array.isArray(steps)) {
        steps = [steps];
    }

    steps.forEach(function (step) {
        var v = {
            value: step,
            inclusiveKeys: normalizeInputKeys(inclusiveKeys),
            exclusiveKeys: normalizeInputKeys(exclusiveKeys)
        };
        this.cleanupSteps.push(v);
    }, this);
    return this;
};

var cleanupSourceKeyFilter = function (step, sourceKey) {
    if (!(step.inclusiveKeys || step.exclusiveKeys)) {
        return true;
    }
    if (stepObj.inclusiveKeys) {
        return sourceKey && stepObj.inclusiveKeys.indexOf(sourceKey) > -1;
    }
    if (stepObj.exclusiveKeys) {
        return (!sourceKey) || (stepObj.exclusiveKeys.indexOf(sourceKey) < 0);
    }
}

Component.overallCleanupSteps = function (sourceKey) {
    var result = [];
    var sourceKeyFilter = function (step) {
        if (!(step.inclusiveKeys || step.exclusiveKeys)) {
            return true;
        }
        if (step.inclusiveKeys) {
            return sourceKey && step.inclusiveKeys.indexOf(sourceKey) > -1;
        }
        if (step.exclusiveKeys) {
            return (!sourceKey) || (step.exclusiveKeys.indexOf(sourceKey) < 0);
        }
    };
    componentHiearcy(this).forEach(function (obj) {
        if (obj.cleanupSteps) {
            var filtered = obj.cleanupSteps.filter(sourceKeyFilter);
            Array.prototype.push.apply(result, filtered);
        }
    });
    return result;
};

Component.hasParsers = function () {
    for (var obj = this; obj; obj = Object.getPrototypeOf(obj)) {
        if (obj.parsers && obj.parsers.length > 0) {
            return true;
        }
    }
    return false;
};

Component.overallParsers = function (sourceKey) {
    var result = [];
    var pathMap = Object.create(null);
    componentHiearcy(this).forEach(function (obj) {
        if (obj.parsers) {
            obj.parsers.forEach(function (p) {
                if (!p.sourceKey) {
                    if (pathMap[p.jsPath] === undefined) {
                        pathMap[p.jsPath] = result.length;
                        result.push(p);
                    }
                } else if (sourceKey && p.sourceKey === sourceKey) {
                    var index = pathMap[p.jsPath];
                    if ((index !== undefined) && (index >= 0)) {
                        result[index] = p;
                    } else {
                        pathMap[p.jsPath] = -1;
                        result.push(p);
                    }
                }
            });
        }
    });
    return result;
};

Component
    .withNegationStatus(false)
    .cleanupStep(Cleanup.clearNulls);

module.exports = Component;
