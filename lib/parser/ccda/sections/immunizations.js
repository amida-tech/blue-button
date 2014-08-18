"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var augmentImmunizationStatus = function () {
    var tmpStatus = "";
    if (this.js.negation_ind === "true") {
        tmpStatus = "refused";
    } else if (this.js.mood_code === "INT") {
        tmpStatus = "pending";
    } else if (this.js.mood_code === "EVN") {
        tmpStatus = "complete";
    } else {
        tmpStatus = "unknown";
    }
    this.js = tmpStatus;
};

augmentImmunizationStatus.replaceSchema = function () {
    return "string";
};

var exportImmunizationsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var ImmunizationStatus = component.define("ImmunizationStatus")
        .fields([
            ["mood_code", "0..1", "./@moodCode"],
            ["negation_ind", "0..1", "./@negationInd"],
        ]).cleanupStep(augmentImmunizationStatus);

    var ImmunizationAdministration = component.define("ImmunizationAdministration")
        .fields([
            ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
            ["body_site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
            ["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
            ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor]
        ]);

    var ImmunizationInstructions = component.define("MedicationInstructions")
        .fields([
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["free_text", "0..1", "h:text", shared.TextWithReference]
        ]);

    var immunizationActivityProduct = component.define('immunizationActivityProduct')
        .fields([
            ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
            ["lot_number", "0..1", "h:manufacturedMaterial/h:lotNumberText"],
            ["manufacturer", "0..1", "h:manufacturerOrganization/h:name"],
        ]);

    var ImmunizationActivity = component.define("ImmunizationActivity")
        .templateRoot([clinicalStatementsIDs.ImmunizationActivity, clinicalStatementsIDs.MedicationActivity])
        .fields([
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["status", "0..1", "./../h:substanceAdministration", ImmunizationStatus],
            ["sequence_number", "0..1", "h:repeatNumber/@value"],
            ["product", "0..1", "h:consumable/h:manufacturedProduct", immunizationActivityProduct],
            ["administration", "0..1", "./../h:substanceAdministration", ImmunizationAdministration],
            ["performer", "0..1", "h:performer/h:assignedEntity", shared.assignedEntity],
            ["instructions", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:act", ImmunizationInstructions],
            ["refusal_reason", "0..1", "h:entryRelationship/h:observation/h:code/@code", shared.SimpleCode("2.16.840.1.113883.5.8")],
        ]);

    var immunizationsSection = component.define("immunizationsSection");
    immunizationsSection.templateRoot([sectionIDs.ImmunizationsSection, sectionIDs.ImmunizationsSectionEntriesOptional]);
    immunizationsSection.fields([
        ["immunizations", "0..*", ImmunizationActivity.xpath(), ImmunizationActivity]
    ]);

    immunizationsSection.cleanupStep(cleanup.replaceWithField('immunizations'));
    return [immunizationsSection, ImmunizationActivity]
}

exports.immunizationsSection = exportImmunizationsSection;
exports.immunizationsEntry = exportImmunizationsSection;
