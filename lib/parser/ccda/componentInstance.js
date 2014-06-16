"use strict";

var common = require("./common");
var assert = require("assert");

var deepForEach = common.deepForEach;

var ComponentInstance = {};

ComponentInstance.pathToTop = function() {
    function chainUp(c) {
      var ret = [c];
      if (! c.parent){
        return ret;
      }
      [].push.apply(ret, chainUp(c.parent));
      return ret;
    }

    return chainUp(this);
  };

ComponentInstance.cleanupTree = function(level) {
  level = level || 1;
  deepForEach(this, {
    pre: function(v){
      if (ComponentInstance.isPrototypeOf(v)){
        return v.js;
      }
      return v;
    },
    post: function(v){
      if (v && v.cleanup) v.cleanup(level);
    }
  });
};

ComponentInstance.cleanup = function(level){
  var stepper = this.component;
  var proto = null
  var supers = [];
  while (stepper && (proto = Object.getPrototypeOf(stepper))) {
    supers.unshift(stepper);
    stepper = proto;
  }
  supers.forEach(function(stepper){
    if (stepper.cleanupSteps[level]) {
      stepper.cleanupSteps[level].forEach(function(step){
        step.call(this);
      }, this);
    }
  }, this);
  return this;
};

ComponentInstance.setJs = function(path, val) {
  var parts = path.split(/\./);
  var hook = this.js;
  var i;

  for (i=0; i < parts.length - 1; i++){
    hook = hook[parts[i]] || (hook[parts[i]] = {});
  }
  hook[parts[i]] = val;
};

ComponentInstance.run = function(node, sourceType) {
  this.node = node;
  var componentParsers = this.component.parsers;
  if (0 === componentParsers.length) {
    assert(node === null || -1 === ['object'].indexOf(typeof node));
    this.js = node;
  } else {
    var parsers = [];
    var pathMap = Object.create(null);
    componentParsers.forEach(function(cp) {
      if (! cp.sourceType) { 
        if (pathMap[cp.jsPath] === undefined) {
          pathMap[cp.jsPath] = parsers.length;
          parsers.push(cp);
        }
      } else if (sourceType && cp.sourceType === sourceType) {
        var index = pathMap[cp.jsPath];
        if ((index !== undefined) && (index >= 0)) {
          parsers[index] = cp;
        } else {
          pathMap[cp.jsPath] = -1;
          parsers.push(cp);          
        }
      }
    });
    parsers.forEach(function(p){
      p.run(this, node);
    }, this);
    return this;
  }
};

ComponentInstance.toJSON = function(){
  return deepForEach(this, {
    pre: function(o){
      if (ComponentInstance.isPrototypeOf(o)) {
        return o.js;
      }
      return o;
    }
  });
};

module.exports = ComponentInstance;
