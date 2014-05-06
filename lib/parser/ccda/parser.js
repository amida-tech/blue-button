var Processor = require("./processor");
var common = require("./common");
var xpath = common.xpath;


/*
 * Parser registartion never triggering... (?) 
 XDate.parsers.push(function(t){
 });
 */

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
Parser.prototype.run = function (parentComponent, node) {
  var subComponent = this.component;
  var matches = xpath(node, this.xpath);
  var jsVal;
  
  jsVal = matches.map(function(match, i) {

    if (subComponent && subComponent.componentName) {
      var subTree = subComponent.instance();
      subTree.topComponent = parentComponent.topComponent;
      subTree.parentComponent = parentComponent;
      if (subTree.component.parsers.length > 0) {
        subTree.run(match);
      }
      else {
        subTree.run(Processor.asString(match));
      }
      return subTree;
    }
    else if (subComponent) {
      return subComponent(match);
    }
    return Processor.asString(match);

  }, this);

  if (!this.multiple && jsVal.length > 1) {
    throw new Error("Found cardinality `" + jsVal.length + 
                    "` when expecting " + this.cardinality + 
                    " at " + this.xpath);
  }

  if (this.required && jsVal.length === 0) {
    var msg = parentComponent.pathToTop().map(function(a){return a.component.componentName;});
    parentComponent.topComponent.errors.push("nullFlavor alert:  missing but required " + this.jsPath + " in " + msg.join(" -> "));
  }

  if (!this.multiple){
    jsVal = (jsVal.length === 0 ? null : jsVal[0]);
  }

  parentComponent.setJs(this.jsPath, jsVal);

  return this;
};

module.exports = Parser;
