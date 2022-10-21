"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");
var _ = require("lodash");

var augmentImmunizationStatus = function () {
  var tmpStatus = "";
  if (_.get(this, "js.negation_ind") === "true") {
    tmpStatus = "refused";
  } else if (_.get(this, "js.mood_code") === "INT") {
    tmpStatus = "pending";
  } else if (_.get(this, "js.mood_code") === "EVN") {
    tmpStatus = "complete";
  } else {
    tmpStatus = "unknown";
  }
  this.js = tmpStatus;
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
      ["lot_number", "0..1", "h:manufacturedMaterial/h:lotNumberText/text()"],
      ["manufacturer", "0..1", "h:manufacturerOrganization/h:name/text()"],
    ]);

  var Indication = component.define("Indication")
    .fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
      ["value", "0..1", "h:value", shared.ConceptDescriptor]
    ]);

  var ImmunizationSeverityObservation = component.define("immunizationSeverityObservation")
    .fields([
      ["code", "0..1", "h:value", shared.ConceptDescriptor],
      ["interpretation", "0..1", "h:interpretationCode", shared.ConceptDescriptor]
    ]);

  var ImmunizationReaction = component.define("immunizationReaction");
  ImmunizationReaction.templateRoot(["2.16.840.1.113883.10.20.22.4.9"]);
  ImmunizationReaction.fields([
    ["identifiers", "0..*", "h:id", shared.Identifier],
    ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
    ["reaction", "1..1", "h:value", shared.ConceptDescriptor],
    ["free_text_reaction", "0..1", "h:text", shared.TextWithReference],
    ["severity", "0..1", "h:entryRelationship/h:observation", ImmunizationSeverityObservation]
  ]);
  ImmunizationReaction.cleanupStep(cleanup.promoteFreeTextIfNoReaction);

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
      ["indications", "0..*", "h:entryRelationship[@typeCode='RSON']/h:observation", Indication],
      ["reaction", "0..1", "h:entryRelationship[@typeCode='CAUS']/h:observation", ImmunizationReaction],
    ]).cleanupStep(function () { // Quick and dirty fix for when refusal_reason catches other observations in Vitera.
      if (this.js) { // Refusal reason should use the template id
        if (this.js.refusal_reason && (!_.get(this, "js.refusal_reason.js"))) {
          delete this.js.refusal_reason;
        }
      }
    });

  var immunizationsSection = component.define("immunizationsSection");
  immunizationsSection.templateRoot([sectionIDs.ImmunizationsSection, sectionIDs.ImmunizationsSectionEntriesOptional]);
  immunizationsSection.fields([
    ["immunizations", "0..*", ImmunizationActivity.xpath(), ImmunizationActivity]
  ]);

  immunizationsSection.cleanupStep(cleanup.replaceWithField('immunizations'));
  return [immunizationsSection, ImmunizationActivity];
};

exports.immunizationsSection = exportImmunizationsSection;
exports.immunizationsEntry = exportImmunizationsSection;
