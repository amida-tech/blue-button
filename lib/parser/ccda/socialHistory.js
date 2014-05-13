var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");

var smokingStatusObservation = Component.define("smokingStatusObservation")
.templateRoot([
    "2.16.840.1.113883.10.20.22.4.78", // the correct templateId
    "2.16.840.1.113883.10.22.4.78" // incorrect id published in 1.1 DSTU
])
.fields([
    ["value", "1..1", "h:value/@code", shared.SimpleCode("2.16.840.1.113883.11.20.9.38")],
    ["dateRange", "1..1", "h:effectiveTime", shared.EffectiveTime],
]);

exports.socialHistorySection = Component.define("socialHistorySection")
.templateRoot(["2.16.840.1.113883.10.20.22.2.17"])
.fields([
    ["smokingStatuses", "0..*", smokingStatusObservation.xpath(), smokingStatusObservation]
]);
