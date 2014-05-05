var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");

var ResultObservation = Component.define("ResultObservation")
.templateRoot("2.16.840.1.113883.10.20.22.4.2")
.fields([
  ["sourceIds","1..*", "h:id", shared.Identifier],
  ["resultName","1..1", "h:code", shared.ConceptDescriptor],
  ["measuredAt", "1..1", "h:effectiveTime", shared.EffectiveTime],
  ["physicalQuantity","1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
  ["freeTextValue","0..1", "h:text", shared.TextWithReference],
  ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
])
.uriBuilder({
  category: "entries",
  type: "results"
});


var ResultsOrganizer = Component.define("ResultsOrganizer")
.templateRoot("2.16.840.1.113883.10.20.22.4.1")
.fields([
  ["sourceIds","1..*", "h:id", shared.Identifier],
  ["panelName","0..1", "h:code", shared.ConceptDescriptor],
  ["results", "1..*", ResultObservation.xpath(), ResultObservation]
])
.uriBuilder({
  category: "organizers",
  type: "results"
});


var ResultsSection = exports.ResultsSection = Component.define("ResultsSection")
.templateRoot([
  '2.16.840.1.113883.10.20.22.2.3', '2.16.840.1.113883.10.20.22.2.3.1' // .1 for "entries required"
])
.fields([
  //        ["name","0..1", "h:code", shared.ConceptDescriptor],
  ["panels","0..*", ResultsOrganizer.xpath(), ResultsOrganizer],
])
.uriBuilder({
  category: "sections",
  type: "results"
});

