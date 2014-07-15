var Processor = require("./processor");
var common = require("./common");
var xpath = common.xpath;
var util = require('util');

function Parser() {}

Parser.prototype.init = function (jsPath, cardinality, xpath, component, sourceKey) {
    var range = cardinality.split(/\.\./);
    var lower = range[0];
    var upper = range[range.length - 1];

    this.xpath = xpath;
    this.cardinality = cardinality;

    this.required = lower === '*' || parseInt(lower) > 0;
    this.multiple = upper === '*' || parseInt(upper) > 1;

    this.jsPath = jsPath;
    this.component = component || null;
    this.sourceKey = sourceKey;
    return this;
};

Parser.prototype.run = function (parentInstance, node, sourceKey) {
    var component = this.component;
    var matches = xpath(node, this.xpath);
    var jsVal = matches.map(function (match, i) {
        if (component && component.componentName) {
            var instance = component.instance(parentInstance);
            if (component.hasParsers()) {
                instance.run(match, sourceKey);
            } else {
                instance.run(Processor.asString(match), sourceKey);
            }
            return instance;
        } else if (component) {
            return component(match);
        } else {
            return Processor.asString(match);
        }
    });

    if (!this.multiple && jsVal.length > 1) {
        var msg = util.format("cardinality error: found %d when expecting %s at %s", jsVal.length, this.cardinality, this.xpath);
        parentInstance.errors.push(msg);
    }

    if (this.required && jsVal.length === 0) {
        var msg = parentInstance.pathToTop().map(function (a) {
            return a.component.componentName;
        });
        parentInstance.errors.push("nullFlavor alert:  missing but required " + this.jsPath + " in " + msg.join(" -> "));
    }

    if (!this.multiple) {
        jsVal = (jsVal.length === 0 ? null : jsVal[0]);
    }

    parentInstance.setJs(this.jsPath, jsVal);

    return this;
};

module.exports = Parser;
