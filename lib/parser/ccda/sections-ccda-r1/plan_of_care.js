"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");

// var date_time = component.define('date_time');
// date_time.fields([
//     ["point", "1..1", "h:effectiveTime", shared.EffectiveTime]
// ]);

var entry = component.define('entry');
// observation, act, encounter, procedure
entry.templateRoot(["2.16.840.1.113883.10.20.1.25"]);
entry.fields([
    ["plan", "1..1", "h:code", shared.ConceptDescriptor],
    ["identifiers", "1..*", "h:id", shared.Identifier],
    ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
    ['type', "1..1", "h:templateId/@root"]
]);

entry.cleanupStep(function () {
    var typeMap = {
        "2.16.840.1.113883.10.20.1.25": "observation",
        "2.16.840.1.113883.3.62.3.16.1": "act",
        "2.16.840.1.113883.10.20.22.4.40": "encounter",
        "2.16.840.1.113883.10.20.22.4.41": "procedure"
    };
    var t = this.js['type'];
    this.js['type'] = typeMap[t];
});

var plan_of_care_section = exports.plan_of_care_section = component.define('plan_of_care_section');
plan_of_care_section.templateRoot("2.16.840.1.113883.10.20.1.10");
plan_of_care_section.fields([
    ["entry", "0..*", entry.xpath(), entry]
]);
plan_of_care_section.cleanupStep(cleanup.replaceWithField('entry'));

exports.plan_of_care_entry = entry;
