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

Component.classInit = function(name){
  this.componentName = name;
  this.cleanupSteps = [];
  this.parsers = [];
};

Component.classInit("Component");

Component.define = function(name){
    var r = Object.create(this);
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

Component.cleanupStep = function(steps, exclusiveKeys, inclusiveKeys) {
  if (!Array.isArray(steps)) {
    steps = [steps];
  }
  steps.forEach(function(step) {
    var v = {value: step, exclusiveKeys: exclusiveKeys, inclusiveKeys: inclusiveKeys};
    this.cleanupSteps.push(v);
  }, this);
  return this;
};

Component.overallCleanupSteps = function() {
  var result = [];
  for (var obj=this; obj; obj=Object.getPrototypeOf(obj)) { 
    if (obj.cleanupSteps) {
      Array.prototype.unshift.apply(result, obj.cleanupSteps);
    }
  } 
  return result;
};

Component.hasParsers = function() {
  for (var obj=this; obj; obj=Object.getPrototypeOf(obj)) { 
    if (obj.parsers && obj.parsers.length > 0) {
      return true;
    }
  } 
  return false;
};

Component.overallParsers = function() {
  var result = [];
  for (var obj=this; obj; obj=Object.getPrototypeOf(obj)) { 
    if (obj.parsers) {
      Array.prototype.unshift.apply(result, obj.parsers);
    }
  } 
  return result;
};

Component.generateSchema = function() {
    var r = {};
    var ps = this.overallParsers();
    ps.forEach(function(p){
        var key = p.jsPath;
        var pc = p.component;
        if (Component.isPrototypeOf(pc)) {
            var pr = pc.generateSchema();
            r[key] = p.multiple ? [pr] : pr;
        } else {
            var pr = pc && pc.type;
            if (! pr) {
                pr = 'string';
            }
            r[key] = p.multiple ? [pr] : pr;
        }
    });
    var steps = this.overallCleanupSteps();
    steps.forEach(function(csObj) {
      var cs = csObj.value;
      if (cs && cs.updateSchema) cs.updateSchema(r);
      if (cs && cs.replaceSchema) r = cs.replaceSchema(r);
    });
    return r;
};

Component
.withNegationStatus(false)
.cleanupStep(Cleanup.clearNulls);

module.exports = Component;
