var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");
var cleanup = require("./cleanup");


//These three elements aren't used right now, but can be refactored to use in standardized way.
var AgeObservation = Component.define("AgeObservation")
.templateRoot("2.16.840.1.113883.10.20.22.4.31");

var ProblemStatus = Component.define("ProblemStatus")
.templateRoot("2.16.840.1.113883.10.20.22.4.6");

var HealthStatus = Component.define("HealthStatus")
.templateRoot("2.16.840.1.113883.10.20.22.4.5");

//TODO:  Cleanup/investigate negation status.
var ProblemObservation = Component.define("ProblemObservation")
.templateRoot("2.16.840.1.113883.10.20.22.4.4")
.fields([
  ["date", "0..1", "h:entryRelationship/h:observation/h:effectiveTime", shared.EffectiveTime],
  ["identifiers", "1..*", "h:entryRelationship/h:observation/h:id", shared.Identifier],
  ["negation_indicator", "0..1", "h:entryRelationship/h:observation", shared.NegationIndicator],
  ["value", "1:1", "h:entryRelationship/h:observation/h:value", shared.ConceptDescriptor],
  ["onset_age","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value/@value"],
  ["onset_age_unit","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value", shared.AgeDescriptor],
  ["status","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.6']/../h:value/@displayName"],
  ["patient_status","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
  ["source_list_identifiers","1..*", "h:id", shared.Identifier],
]).withNegationStatus(true);
ProblemObservation.cleanupStep(cleanup.extractAllFields(['value']));

var NonProblemObservation = ProblemObservation
.define("ProblemObservation")
.withNegationStatus(true);


var ProblemOrganizer = Component.define("ProblemOrganizer")
.templateRoot("2.16.840.1.113883.10.20.22.4.3");


exports.ProblemsSection = Component.define("ProblemsSection")
.templateRoot("2.16.840.1.113883.10.20.22.2.5.1") // coded entries required
.fields([
  ["problems","0..*", ProblemOrganizer.xpath(), ProblemObservation],
]);

