"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");

var smokingStatusObservation = component.define("smokingStatusObservation")
    .templateRoot([
        "2.16.840.1.113883.10.20.22.4.78", // the correct templateId
        "2.16.840.1.113883.10.22.4.78" // incorrect id published in 1.1 DSTU
    ])
    .fields([
        ["value", "1..1", "h:value/@code", shared.SimpleCode("2.16.840.1.113883.11.20.9.38")],
        ["date", "1..1", "h:effectiveTime", shared.EffectiveTime],
    ]);

// when other flavors of social history is implemented (pregnancy, social observation, tobacco use) 
// this should probably be structured similar to procedures with types.  if another structure
// is chosen procedures need to be updated as well.
var socialHistorySection = exports.socialHistorySection = component.define("socialHistorySection")
    .templateRoot(["2.16.840.1.113883.10.20.22.2.17"])
    .fields([
        ["smoking_statuses", "0..*", smokingStatusObservation.xpath(), smokingStatusObservation]
    ]);
//socialHistorySection.cleanupStep(cleanup.replaceWithField('smoking_statuses'));
