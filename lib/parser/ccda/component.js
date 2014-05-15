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

Component.instance = function(parent) {
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

Component.generateSchema = function() {
    var r = {};
    this.parsers.forEach(function(p){
        var key = p.jsPath;
        var pc = p.component;
        if (Component.isPrototypeOf(pc)) {
            var pr = pc.generateSchema();
            r[key] = p.multiple ? [pr] : pr;
        } else {
            var type = pc && pc.type;
            if (! type) {
                type = 'string';
            }
            var pr = {type: type, required: p.required};
            r[key] = p.multiple ? [pr] : pr;
        }
    });
    var css = this.cleanupSteps && this.cleanupSteps[1];
    if (css) {
        var n = css.length;
        for (var i=0; i<n; ++i) {
            var cs = css[i];
            if (cs && cs.updateSchema) cs.updateSchema(r);
            if (cs && cs.replaceSchema) r = cs.replaceSchema(r);
        }
    }
    return r;
};

Component
.withNegationStatus(false)
.cleanupStep(Cleanup.hideFields(["sourceIds"]), "paredown")
.cleanupStep(Cleanup.clearNulls, "paredown");

module.exports = Component;
