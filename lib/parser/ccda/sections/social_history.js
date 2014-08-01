"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");

var socialHistoryObservation = component.define("socialHistoryObservation")
    .templateRoot([
        "2.16.840.1.113883.10.20.22.4.78", // the correct templateId (smoking status)
        "2.16.840.1.113883.10.22.4.78", // incorrect id published in 1.1 DSTU
        "2.16.840.1.113883.10.20.22.4.38" // social history observation template
    ])
    .fields([
        ["value", "1..1", "(h:code/@code | h:value/@code)[last()]", shared.SimpleCode("2.16.840.1.113883.11.20.9.38")],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
    ]);

// when other flavors of social history is implemented (pregnancy, social observation, tobacco use) 
// this should probably be structured similar to procedures with types.  if another structure
// is chosen procedures need to be updated as well.
var socialHistorySection = exports.socialHistorySection = component.define("socialHistorySection")
    .templateRoot(["2.16.840.1.113883.10.20.22.2.17"])
    .fields([
        ["smoking_statuses", "0..*", socialHistoryObservation.xpath(), socialHistoryObservation]
    ]);
socialHistorySection.cleanupStep(cleanup.replaceWithField('smoking_statuses'));
