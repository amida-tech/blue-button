"use strict";

var assert = require("assert");
var common = require("./common");

var deepForEach = common.deepForEach;

var componentInstance = {};

componentInstance.pathToTop = function () {
    function chainUp(c) {
        var ret = [c];
        if (!c.parent) {
            return ret;
        }
        [].push.apply(ret, chainUp(c.parent));
        return ret;
    }

    return chainUp(this);
};

componentInstance.cleanupTree = function (sourceKey) {
    deepForEach(this, {
        pre: function (v) {
            if (componentInstance.isPrototypeOf(v)) {
                return v.js;
            }
            return v;
        },
        post: function (v) {
            if (v && v.cleanup) v.cleanup(sourceKey);
        }
    });
};

componentInstance.cleanup = function (sourceKey) {
    var steps = this.component.overallCleanupSteps(sourceKey);
    steps.forEach(function (stepObj) {
        stepObj.value.call(this);
    }, this);
    return this;
};

componentInstance.setJs = function (path, val) {
    var parts = path.split(/\./);
    var hook = this.js;
    var i;

    for (i = 0; i < parts.length - 1; i++) {
        hook = hook[parts[i]] || (hook[parts[i]] = {});
    }
    hook[parts[i]] = val;
};

componentInstance.run = function (node, sourceKey) {
    this.node = node;
    var parsers = this.component.overallParsers(sourceKey);
    if (0 === parsers.length) {
        assert(node === null || -1 === ['object'].indexOf(typeof node));
        this.js = node;
    } else {
        parsers.forEach(function (p) {
            p.run(this, node, sourceKey);
        }, this);
        return this;
    }
};

componentInstance.toJSON = function () {
    return deepForEach(this, {
        pre: function (o) {
            if (componentInstance.isPrototypeOf(o)) {
                return o.js;
            }
            return o;
        }
    });
};

module.exports = componentInstance;
