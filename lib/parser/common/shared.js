"use strict";

var bbxml = require("blue-button-xml");

var component = bbxml.component;
var processor = bbxml.processor;

var cleanup = require('./cleanup');

var shared = module.exports = {};

var simpleCode = shared.SimpleCode = function (oid) {
    var r = component.define("SimpleCode." + oid);
    r.fields([]);
    r.cleanupStep(cleanup.augmentSimpleCode(oid));
    return r;
};

var email = shared.Email = component.define("Email");
email.fields([
    ["address", "1..1", "@value"],
    ["type", "0..1", "@use", simpleCode("2.16.840.1.113883.5.1119")]
]);
email.cleanupStep(function () {
    if (this.js && this.js.address) {
        if (this.js.address.substring(0, 7) === "mailto:") {
            this.js.address = this.js.address.substring(7);
            //NOTE: type for email should be empty (per PragueExpat)
            if (this.js.type) {
                this.js.type = '';
            }
        } else {
            this.js = {};
        }
    }
});

var phone = shared.Phone = component.define("Phone");
phone.fields([
    ["number", "1..1", "@value"],
    ["type", "0..1", "@use", simpleCode("2.16.840.1.113883.5.1119")]
]);
phone.cleanupStep(function () {
    if (this.js && this.js.number) {
        if (this.js.number.substring(0, 4) === "tel:") {
            this.js.number = this.js.number.substring(4);
        }
        //Remove emails as phone numbers.
        if (this.js.number.substring(0, 7) === "mailto:") {
            this.js = {};
        }
    }
});
