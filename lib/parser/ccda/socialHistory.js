var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");

var SmokingStatusObservation = Component.define("SmokingStatusObservation")
.templateRoot([
  "2.16.840.1.113883.10.20.22.4.78", // the correct templateId
  "2.16.840.1.113883.10.22.4.78" // incorrect id published in 1.1 DSTU
])
.fields([
  ["sourceIds","1..*", "h:id", shared.Identifier],
  ["smokingStatus","0..1", "h:value", 
    shared.ConceptDescriptor.shall({
      valueSetOid: "2.16.840.1.113883.11.20.9.38"
    })],
  // TODO: want a better name for this field -- but what does it mean?
  // http://www.hl7.org/dstucomments/showdetail_comment.cfm?commentid=98
  ["dateRange", "1..1", "h:effectiveTime", shared.EffectiveTime],
])
.uriBuilder({
  category: "entries",
  type: "smokingStatus"
}) ;

exports.SocialHistorySection = Component.define("SocialHistorSection")
.templateRoot(["2.16.840.1.113883.10.20.22.2.17"])
.fields([
  ["smokingStatuses","0..*", SmokingStatusObservation.xpath(), SmokingStatusObservation]
])
.uriBuilder({
  category: "sections",
  type: "socialHistory"
});
