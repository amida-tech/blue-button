var common = require("./common");
var assert = require("assert");

var deepForEach = common.deepForEach;

var ComponentInstance = {};

ComponentInstance.pathToTop = function() {
    function chainUp(c) {
      var ret = [c];
      if (c.parentComponent === c){
        return ret;
      }
      [].push.apply(ret, chainUp(c.parentComponent));
      return ret;
    }

    return chainUp(this);
  };

ComponentInstance.cleanupTree = function(level){
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
  var supers = [];
  while (stepper) {
    supers.unshift(stepper);
    stepper = stepper.super_;
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

ComponentInstance.run = function(node) {
  this.node = node;

  if (0 === this.component.parsers.length) {
    assert(node === null || -1 === ['object'].indexOf(typeof node));
    this.js = node;
  }

  this.component.parsers.forEach(function(p){
    p.run(this, node);
  }, this);
  return this;
};

ComponentInstance.toString = function(){
  return JSON.stringify(this);
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

ComponentInstance.getLinks = function(){
  var links = {
    patient: common.patientUri(this.topComponent.patientId)
  };

  this.pathToTop().slice(1).forEach(function(a){
    var t = a.component.uriTemplate;
    if (!t) {
      return;
    }
    links[t.category] = a.js._id;
  }, this);

  return links;
};

module.exports = ComponentInstance;