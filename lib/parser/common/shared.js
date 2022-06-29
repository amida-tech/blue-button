"use strict";

var bbxml = require("@amida-tech/blue-button-xml");

var component = bbxml.component;
var processor = bbxml.processor;

var cleanup = require('./cleanup');

var shared = module.exports = {};

var Identifier = shared.Identifier = component.define("Identifier")
  .fields([
    ["identifier", "1..1", "@root"],
    ["extension", "0..1", "@extension"],
  ]);

var simpleCode = shared.SimpleCode = function (oid) {
  var r = component.define("SimpleCode." + oid);
  r.fields([]);
  r.cleanupStep(cleanup.augmentSimpleCode(oid));
  return r;
};

var email = shared.email = component.define("email");
email.fields([
  ["address", "1..1", "@value"],
  ["type", "0..1", "@use", simpleCode("2.16.840.1.113883.5.1119")]
]);
email.cleanupStep(function () {
  if (this.js && this.js.address) {
    this.js.address = this.js.address.substring(7);

    //NOTE: type for email should be empty (per PragueExpat)
    if (this.js.type) {
      this.js.type = '';
    }
  }
});
email.setXPath("h:telecom[starts-with(@value, 'mailto:')]");

var phone = shared.phone = component.define("phone");
phone.fields([
  ["number", "1..1", "@value"],
  ["type", "0..1", "@use", simpleCode("2.16.840.1.113883.5.1119")]
]);
phone.cleanupStep(function () {
  if (this.js && this.js.number) {
    if (this.js.number.substring(0, 4) === "tel:") {
      this.js.number = this.js.number.substring(4);
    }

    this.js.number = this.js.number.trim();
  }
});
phone.setXPath("h:telecom[@value and @value!='' and not(starts-with(@value, 'mailto:'))]");

var simplifiedCodeOID = shared.simplifiedCodeOID = function (oid) {
  var r = component.define("SC " + oid);
  r.fields([
    ["name", "0..1", "@displayName"],
    ["code", "1..1", "@code"],
  ]);
  r.cleanupStep(cleanup.augmentSimplifiedCodeOID(oid));
  return r;
};

shared.metaData = component.define("metaData")
  .fields([
    ["identifiers", "0..*", "h:id", Identifier],
    ["confidentiality", '0..1', "h:confidentialityCode", simplifiedCodeOID("2.16.840.1.113883.5.25")],
    ["set_id", "0..1", "h:setId", Identifier]
  ]);
