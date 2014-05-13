var uuid = require('node-uuid');
var common = require("./common");
var Processor = require("./processor");
var OIDs = require("./oids");
var _ = require("underscore");
var ComponentInstance = require("./componentInstance");

var Cleanup = module.exports = {};

Cleanup.clearNulls = function(){
  if (!this.js || this.js === null) {
    return;
  }

  if ('object' === typeof this.js) {
    Object.keys(this.js).forEach(function(k) {
      if ((this.js[k] === null) || 
          Array.isArray(this.js[k]) && (this.js[k].length === 0 || this.js[k].filter(function(v){return v &&  v.js !== null;}).length === 0) || 
      this.js[k].js === null) {
        delete this.js[k];
      }
    }, this);

    if (Object.keys(this.js).length === 0) {
      this.js = null;
    }
  }

};

Cleanup.resolveReference = function(){ 
  if (this.js === null){
    return; 
  }
  this.js.text = this.js.text.join("").match(/\s*(.*)\s*/)[1];
  var r = this.js.reference && this.js.reference.match(/#(.*)/);
  var resolved = null;
  if (r && r.length == 2){
    resolved = common.xpath(this.node, "//*[@ID='"+r[1]+"']/text()");
  }
  var ret = null;
  if (resolved && resolved.length === 1) {
    ret = Processor.asString(resolved[0]);
  } else {
    ret = this.js.text;
  }

  this.js = ret || null;
};


Cleanup.validateShalls = function(){
  var t = this.component;
  if (t.shallConditions && t.shallConditions.valueSetOid) {
    this.errors.push("SHALL violation: \n"+
    "The code " + JSON.stringify(this, null, "  ") + "\n\n"+
    "is not in the valueset " + t.shallConditions.valueSetOid);
  }
};
Cleanup.augmentAge = function() {

  var lookupOID = "2.16.840.1.113883.11.20.9.21"

  for (lkp in OIDs[lookupOID].table) {
    if (lkp === this.js.units) {
      this.js = OIDs[lookupOID].table[lkp];
    }
  }

}

 
Cleanup.augmentConcept = function(){



  if (this.js.nullFlavor !== null){
    this.js = null;
    return;
  }

  if (!OIDs[this.js.system]){
    OIDs[this.js.system] = {
      name: this.code_system || "OID " + this.js.system
    }; 
  }


  // Keep existing name if present
  if (this.js.name === null){
    if (OIDs[this.js.system].table) {
      this.js.name = OIDs[this.js.system].table[this.js.code];
    }
  }

  // but preferentially use our canonical names for the coding system
  if (OIDs[this.js.system]) {
    this.js.code_system_name = OIDs[this.js.system].name;
  }
};

Cleanup.extractAllFields = function(flist){
  return function(){
    flist.forEach(function(k){
      var tmp = this.js[k];
      delete this.js[k];
      if (tmp.js) {
        Object.keys(tmp.js).forEach(function(m){
          if (this.js[m] === undefined) {
            this.js[m] = tmp.js[m];
          }
        }, this);
      }
    }, this);
  };
};

Cleanup.replaceWithField = function(field){
    return function(){
        this.js = this.js[field];
    }
};

Cleanup.removeField = function(path){
    return function(){
        var field = path[0];
        var ownerJs = this.js;
        for (var i=1; i<path.length; ++i) {
            ownerJs = ownerJs[field];
            field = path[i];
        }
        delete ownerJs[field];
    }
};

Cleanup.ensureMutuallyExclusive = function(ps){
  return function(){
    var seen = [];
    ps.forEach(function(p){
      var newps = [];
      this.js[p].forEach(function(v,i){
        if (seen.indexOf(v.node) === -1){
          newps.push(v);
        }
        seen.push(v.node);
      }, this);
      this.js[p] = newps;
    }, this);
  };
};

Cleanup.hideFields = function(flist) {
  if (!Array.isArray(flist)){
    flist = [flist];
  }
  return function(){
    flist.forEach(function(f){
      if (!this.js){return;}
      this.hidden[f] = this.js[f];
      delete this.js[f];
    }, this);
  };
};
