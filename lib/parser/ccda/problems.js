var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");

var AgeObservation = Component.define("AgeObservation")
.templateRoot("2.16.840.1.113883.10.20.22.4.31");

var ProblemStatus = Component.define("ProblemStatus")
.templateRoot("2.16.840.1.113883.10.20.22.4.6");

var HealthStatus = Component.define("HealthStatus")
.templateRoot("2.16.840.1.113883.10.20.22.4.5");

var ProblemObservation = Component.define("ProblemObservation")
.templateRoot("2.16.840.1.113883.10.20.22.4.4")
.fields([
  ["somethin","1..*", "h:id", shared.Identifier],
  ["problemType","1..1", "h:code", shared.ConceptDescriptor],
  ["problemName","1..1", "h:value", shared.ConceptDescriptor],
  ["freeTextProblemName","0..1", "h:text", shared.TextWithReference],
  ["dateRange", "1..1", "h:effectiveTime", shared.EffectiveTime],
  ["resolved","1..1", "h:effectiveTime", Processor.pathExists("./@high")],
  ["ageAtOnset", "0..1", 
    AgeObservation.xpath() + "/h:value", 
    shared.PhysicalQuantity],
  ["problemStatus","0..1", 
    ProblemStatus.xpath() + "/h:value", 
    shared.ConceptDescriptor],
  ["healthStatus","0..1", 
    HealthStatus.xpath() + "/h:value", 
    shared.ConceptDescriptor]
]);

var NonProblemObservation = ProblemObservation
.define("mattProblemObservation")
.withNegationStatus(true);


//TODO:  Cleanup/investigate negation status.
var mattProblemObservation = Component.define("mattProblemObservation")
.templateRoot("2.16.840.1.113883.10.20.22.4.4")
.fields([
  ["date", "0..2", "h:entryRelationship/h:observation/h:effectiveTime", shared.EffectiveTime],
  ["identifiers", "1..*", "h:entryRelationship/h:observation/h:id", shared.Identifier],
  ["negation_indicator", "0..1", "h:entryRelationship/h:observation/@negationInd"],
  ["name","1..1", "h:entryRelationship/h:observation/h:value/@displayName"],
  ["code","1..1", "h:entryRelationship/h:observation/h:value/@code"],
  ["code_system","1..1", "h:entryRelationship/h:observation/h:value/@codeSystem"],
  ["onset_age","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value/@value"],
  ["onset_age_units","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value/@unit"],
  ["status","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.6']/../h:value/@displayName"],
  ["patient_status","0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
  ["source_list_identifiers","1..*", "h:id", shared.Identifier],
]);

var ProblemOrganizer = Component.define("ProblemOrganizer")
.templateRoot("2.16.840.1.113883.10.20.22.4.3")
.fields([
  ["sourceIds","1..*", "h:id", shared.Identifier],
  ["dateRange", "1..1", "h:effectiveTime", shared.EffectiveTime],
  ["concernStatus", "1..1", "h:statusCode/@code", shared.SimpleCode("2.16.840.1.113883.11.20.9.19")],
  ["problems", "1..*", ProblemObservation.xpath(), ProblemObservation],
  ["nonProblems", "0..*", NonProblemObservation.xpath(), NonProblemObservation],
  ["mattIds", "1..*", "h:entryRelationship/h:observation/h:id", shared.Identifier]
]);


exports.ProblemsSection = Component.define("ProblemsSection")
.templateRoot("2.16.840.1.113883.10.20.22.2.5.1") // coded entries required
.fields([
  ["problems","0..*", ProblemOrganizer.xpath(), mattProblemObservation],
]);

