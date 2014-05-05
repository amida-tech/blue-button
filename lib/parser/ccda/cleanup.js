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

Cleanup.assignUri = function(){
  var t = this.component.uriTemplate;
  this.js._id = common.patientUri(this.topComponent.patientId)+"/"+t.category + "/" + t.type + "/"+ (uuid.v4());
};

Cleanup.fixSectionUris = function(){
  Object.keys(this.js).forEach(function(k){
    var v = this.js[k];
    if (v && v.component && 
      v.component.uriTemplate && 
    v.component.uriTemplate.category === "sections") {
      var parts = this.js._id.split("documents/ccda");
      v.js._id = parts[0] + "sections/" + v.component.uriTemplate.type + parts[1];
    }
  }, this);

};

Cleanup.assignPatient = function(){
  this.js._patient = common.patientUri(this.topComponent.patientId);
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
    var haveCode = this.js.system + "#" + this.js.code;
    var known = this.topComponent.codes[haveCode];
    if (!known || -1 === known.valueSetOids.indexOf(t.shallConditions.valueSetOid)) {
      this.topComponent.errors.push("SHALL violation: \n"+
      "The code " + JSON.stringify(this, null, "  ") + "\n\n"+
      "is not in the valueset " + t.shallConditions.valueSetOid);
    }
  }
};

 
Cleanup.augmentConcept = function(){
  if (this.js.nullFlavor !== null){
    this.js = null;
    return;
  }
  var knownCode = null;
  
  if (this.topComponent.codes) {
    knownCode = this.topComponent.codes[this.js.system+"#"+this.js.code] || null;
  }
  
  if (!OIDs[this.js.system]){
    OIDs[this.js.system] = {
      uri: "urn:oid:"+this.js.system+"#",
      name: this.systemName || "OID " + this.js.system
    }; 
  }

  // Keep existing label if present
  if (this.js.label === null){
    if (knownCode){
      this.js.label = knownCode.codeSystemConceptName;
    } else if (OIDs[this.js.system].table) {
      this.js.label = OIDs[this.js.system].table[this.js.code];
    }
  }

  // but preferentially use our canonical names for the coding system
  if (knownCode){
    this.js.systemName = knownCode.codeSystemName;
  } else if (OIDs[this.js.system]) {
    this.js.systemName = OIDs[this.js.system].name;
  }

  this.js.uri = OIDs[this.js.system].uri + this.js.code;
};

Cleanup.extractAllFields = function(flist){
  return function(){
    flist.forEach(function(k){
      var tmp = this.js[k];
      delete this.js[k];
      if (tmp.js) {
        Object.keys(tmp.js).forEach(function(k){
          if (this.js[k] === undefined) {
            this.js[k] = tmp.js[k];
          }
        }, this);
      }
    }, this);
  };
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

Cleanup.remapUris = function(uriMap) {
  var m = uriMap[this.js._id].matches;
  this.js._id = m && m[0] && m[0]._id || this.js._id;
  Cleanup.fixSectionUris.call(this);
  common.deepForEach(this, {
    pre: function(v){
      if (ComponentInstance.isPrototypeOf(v)){
        if (v.js && v.js._id) {
          var m = uriMap[v.js._id] && uriMap[v.js._id].matches;
          v.js._id = m && m[0] && m[0]._id || v.js._id;
          Cleanup.assignPatient.call(v);
        }
        return v.js;
      }
      return v;
    }
  });
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
