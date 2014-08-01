"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");

//These three elements aren't used right now, but can be refactored to use in standardized way.
var AgeObservation = component.define("AgeObservation")
    .templateRoot("2.16.840.1.113883.10.20.22.4.31");

var ProblemStatus = component.define("ProblemStatus")
    .templateRoot("2.16.840.1.113883.10.20.22.4.6");

var HealthStatus = component.define("HealthStatus")
    .templateRoot("2.16.840.1.113883.10.20.22.4.5");

var entry = component.define("entry")
    .templateRoot("2.16.840.1.113883.10.20.1.27")
    .fields([
        ["date_time", "0..1", "h:entryRelationship/h:observation/h:effectiveTime", shared.EffectiveTime],
        ["identifiers", "1..*", "h:entryRelationship/h:observation/h:id", shared.Identifier],
        ["negation_indicator", "0..1", "h:entryRelationship/h:observation", shared.NegationIndicator],
        ["problem", "1:1", "h:entryRelationship/h:observation/h:value", shared.ConceptDescriptor],
        ["onset_age", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value/@value"],
        ["onset_age_unit", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value", shared.AgeDescriptor],
        ["status", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId/../h:statusCode/@code"],
        ["patient_status", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
        ["source_list_identifiers", "1..*", "h:id", shared.Identifier],
    ]).withNegationStatus(true);

var NonProblemObservation = entry
    .define("ProblemObservation")
    .withNegationStatus(true);

var ProblemOrganizer = component.define("ProblemOrganizer")
    .templateRoot("2.16.840.1.113883.10.20.22.4.3");

var problemsSection = exports.problemsSection = component.define("problemsSection");
problemsSection.templateRoot("2.16.840.1.113883.10.20.1.11"); // coded entries required
problemsSection.fields([
    ["problems", "0..*", entry.xpath(), entry],
]);

problemsSection.cleanupStep(cleanup.replaceWithField("problems"));

exports.problemsEntry = entry;
