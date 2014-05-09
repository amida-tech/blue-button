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

Component.classInit = function(name){
  this.cleanupSteps = {};
  this.componentName = name;
  this.needsUri = false;
};

Component.classInit("Component");

/*
* Components can define subclasses on-the-fly
*/
Component.define = function(name){
    var r = Object.create(this);
    r.super_ = this;
    r.classInit(name);
    return r;
};

Component.instance = function() {
    var r = Object.create(ComponentInstance);
    r.js = {};
    r.hidden = {};
    r.topComponent = r;
    r.parentComponent = r;
    r.component = this;
    return r;
};

Component.shall = function(conditions){
  var ret = this.define(this.componentName + JSON.stringify(conditions));
  ret.shallConditions = conditions;
  return ret;
};

Component.templateRoot = function(roots) {
  this.templateRoots = [];

  if (!Array.isArray(roots)) {
    roots = [roots];
  }

  roots.forEach(function(root,i){
    this.templateRoots.push(root);
  }, this);

  return this;
};

Component.xpath = function(){
  //console.log(this.templateRoots);
  var ret = this.templateRoots.map(function(r){
    return util.format(".//h:templateId[@root='%s']/..", r);
  }).join(" | ");

  return ret;
};

Component.withNegationStatus = function(t){
  this._negationStatus = t;
  return this;
};


Component.withMood = function(m){
  if (!util.isArray(m)){
    m = [m];
  }
  this._moods = m;
  return this;
};

Component.fields = function(parsers) {
  this.parsers = [];
  parsers.forEach(function(p, i){
    var np = new Parser();
    np.init.apply(np, p);
    this.parsers.push(np);
  }, this);

  return this;
};

Component.cleanupStep = function(steps, level){
  if (!Array.isArray(steps)){
    steps = [steps];
  }
  level = level || 1;
  var existing = this.cleanupSteps[level] || (this.cleanupSteps[level]=[]);
  [].push.apply(existing, steps);
  return this;
};

Component.document = function(obj) {
    var name = this.componentName;
    if (! obj) {
        obj = {};
    } else if (obj.hasOwnProperty(name)) {
        return obj;
    }
    var r = {};
    obj[name] = r;
    this.parsers.forEach(function(p){
        var key = p.jsPath;
        var parserComponent = p.component;
        if (Component.isPrototypeOf(parserComponent)) {
            parserComponent.document(obj);
            if (p.multiple) {
                r[key] = [parserComponent.componentName];
            } else {
                r[key] = parserComponent.componentName;
            }
        } else {
            var type = null;
            if (parserComponent && parserComponent.type) {
                type = parserComponent.type;
            } else {
                type = 'string';
            }
            if (p.multiple) {
                r[key] = [{type: type, required: p.required}];
            } else {
                r[key] = {type: type, required: p.required};
            }
        }
    });
    return obj;
};

Component
.withNegationStatus(false)
.cleanupStep(Cleanup.hideFields(["sourceIds"]), "paredown")
.cleanupStep(Cleanup.clearNulls, "paredown");

module.exports = Component;
