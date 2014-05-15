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

Cleanup.augmentSimpleCode = function(oid) {
    var f = function() {
        if (this.js) {
            this.js = OIDs[oid].table[this.js];
        }
    };
    f.replaceSchema = function(current) {
        return "string";
    };
    return f;
};

var augmentEffectiveTime = Cleanup.augmentEffectiveTime = function() {
    var returnArray = [];

    if (this.js.point) {
        returnArray.push({
            "date": this.js.point,
            "precision": this.js.point_resolution
        });
    }

    if (this.js.low) {
        returnArray.push({
            "date": this.js.low,
            "precision": this.js.low_resolution
        });
    }

    if (this.js.high) {
        returnArray.push({
            "date": this.js.high,
            "precision": this.js.high_resolution
        });
     }
     
     this.js = returnArray;
};
augmentEffectiveTime.replaceSchema = function(current) {
    return [{date: 'datetime', precision: 'string'}];
};

Cleanup.extractAllFields = function(flist) {  // We need Cleanup function to become objects
    var r = function(){
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
    r.updateSchema = function(current) {
        flist.forEach(function(k) {
            var tmp = current[k];
            if (tmp) {
                delete current[k];
                Object.keys(tmp).forEach(function(m) {
                    if (! current.hasOwnProperty(m)) {
                        current[m] = tmp[m];
                    }
                });
            }
        });
    };
    return r;
};

Cleanup.replaceWithField = function(field){
    var r = function(){
        this.js = this.js[field];
    };
    r.replaceSchema = function(current) {
        return current[field];
    };
    return r;
};

Cleanup.removeField = function(field){
    var r = function(){
        delete this.js[field];
    }
    r.updateSchema = function(current) {
        delete current[field];
    }
    return r;
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
