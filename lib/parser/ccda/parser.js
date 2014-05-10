var Processor = require("./processor");
var common = require("./common");
var xpath = common.xpath;
var util = require('util');

function Parser(){}

Parser.prototype.init = function (jsPath, cardinality, xpath, component) {
    var range = cardinality.split(/\.\./);
    var lower = range[0];
    var upper = range[range.length - 1];

    this.xpath = xpath;
    this.cardinality = cardinality;

    this.required = lower === '*' || parseInt(lower) > 0;
    this.multiple = upper === '*' || parseInt(upper) > 1;

    this.jsPath = jsPath;
    this.component = component || null;
    return this;
};

Parser.prototype.run = function (parentInstance, node) {
    var subComponent = this.component;
    var matches = xpath(node, this.xpath);
    var jsVal;
  
    jsVal = matches.map(function(match, i) {
        if (subComponent && subComponent.componentName) {
            var subTree = subComponent.instance(parentInstance);
            if (subTree.component.parsers.length > 0) {
                subTree.run(match);
            } else {
                subTree.run(Processor.asString(match));
            }
            return subTree;
        } else if (subComponent) {
            return subComponent(match);
        }
        return Processor.asString(match);
    }, this);

    if (!this.multiple && jsVal.length > 1) {
        var msg = util.format("cardinality error: found %d when expecting %s at %s", jsVal.length, this.cardinality, this.xpath);
        parentInstance.errors.push(msg);
    }

    if (this.required && jsVal.length === 0) {
        var msg = parentInstance.pathToTop().map(function(a){return a.component.componentName;});
        parentInstance.errors.push("nullFlavor alert:  missing but required " + this.jsPath + " in " + msg.join(" -> "));
    }

    if (!this.multiple){
        jsVal = (jsVal.length === 0 ? null : jsVal[0]);
    }

    parentInstance.setJs(this.jsPath, jsVal);

    return this;
};

module.exports = Parser;
