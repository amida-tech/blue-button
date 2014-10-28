"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProblemsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    //These three elements aren't used right now, but can be refactored to use in standardized way.
    var AgeObservation = component.define("AgeObservation")
        .templateRoot("2.16.840.1.113883.10.20.1.38");

    var ProblemStatus = component.define("ProblemStatus")
        .templateRoot("2.16.840.1.113883.10.20.1.50")
        .fields([
            ["name", "0..1", "h:value/@displayName"],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ]);

    var ProblemObservation = component.define("ProblemObservation")
        .fields([
            ["code", "0..1", "../h:value", shared.ConceptDescriptor],
            ["problem_text", "0..1", "../h:text", shared.TextWithReference],
            ["date_time", "0..1", "../h:effectiveTime", shared.EffectiveTime],
        ]).cleanupStep(cleanup.augmentObservation).cleanupStep(cleanup.removeField("problem_text"));

    //TODO:  Cleanup/investigate negation status.
    var ProblemConcernAct = component.define("ProblemConcernAct")
        .fields([
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:entryRelationship/h:observation/h:id", shared.Identifier],
            ["negation_indicator", "0..1", "h:entryRelationship/h:observation", shared.NegationIndicator],
            ["problem", "1:1", "h:entryRelationship/h:observation/h:value", ProblemObservation],
            ["onset_age", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.1 13883.10.20.1.38']/../h:value/@value"],
            ["onset_age_unit", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.1 13883.10.20.1.38']/../h:value", shared.AgeDescriptor],
            ["status", "0..1", ProblemStatus.xpath(), ProblemStatus],
            //Patient Status not supported.
            //["patient_status", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
            ["source_list_identifiers", "0..*", "h:id", shared.Identifier],
        ]).withNegationStatus(true);
    //ProblemConcernAct.cleanupStep(cleanup.extractAllFields(['value']));

    var NonProblemObservation = ProblemConcernAct
        .define("ProblemObservation")
        .withNegationStatus(true);

    var ProblemOrganizer = component.define("ProblemOrganizer")
        .templateRoot(["2.16.840.1.113883.3.88.11.83.7"]);

    var problemsSection = component.define("problemsSection");
    problemsSection.templateRoot(["2.16.840.1.113883.3.88.11.83.103"]); // coded entries required
    problemsSection.fields([
        ["problems", "0..*", ProblemOrganizer.xpath(), ProblemConcernAct],
    ]);

    problemsSection.cleanupStep(cleanup.replaceWithField("problems"));
    return [problemsSection, ProblemConcernAct];
}

exports.problemsSection = exportProblemsSection;
exports.problemsEntry = exportProblemsSection;
