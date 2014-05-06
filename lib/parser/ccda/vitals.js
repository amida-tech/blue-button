var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");

var VitalSignObservation = Component.define("VitalSignObservation")
.templateRoot("2.16.840.1.113883.10.20.22.4.27")
.fields([
  ["sourceIds","1..*", "h:id", shared.Identifier],
  ["vitalName","1..1", "h:code", shared.ConceptDescriptor],
  ["measuredAt", "1..1", "h:effectiveTime", shared.EffectiveTime],
  ["physicalQuantity","1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
  ["freeTextValue","0..1", "h:text", shared.TextWithReference],
  ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
])
.uriBuilder({
  category: "entries",
  type: "vitals"
});


var VitalSignsOrganizer = Component.define("VitalSignsOrganizer")
.templateRoot("2.16.840.1.113883.10.20.22.4.26")
.fields([
  ["panelName","0..1", "h:code", shared.ConceptDescriptor],
  ["sourceIds","1..*", "h:id", shared.Identifier],
  ["vitals", "1..*", VitalSignObservation.xpath(), VitalSignObservation]
])
.uriBuilder({
  category: "organizers",
  type: "vitals"
});

exports.VitalSignsSection = Component.define("VitalSignsSection")
.templateRoot("2.16.840.1.113883.10.20.22.2.4.1")
.fields([
  //["name","0..1", "h:code", shared.ConceptDescriptor],
  ["panels","0..*", VitalSignsOrganizer.xpath(), VitalSignsOrganizer],
])
.uriBuilder({
  category: "sections",
  type: "vitals"
});
