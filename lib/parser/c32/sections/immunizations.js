"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");
var _ = require("lodash");

var augmentImmunizationStatus = function () {
  var tmpStatus = "";
  if (_.get(this, 'js.negation_ind') === "true") {
    tmpStatus = "refused";
  } else if (_.get(this, 'js.mood_code') === "INT") {
    tmpStatus = "pending";
  } else if (_.get(this, 'js.mood_code') === "EVN") {
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
      ["lot_number", "0..1", "h:manufacturedMaterial/h:lotNumberText"],
      ["manufacturer", "0..1", "h:manufacturerOrganization/h:name"],
    ]);

  var ImmunizationActivity = component.define("ImmunizationActivity")
    .templateRoot(["2.16.840.1.113883.3.88.11.83.13"])
    .fields([
      ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["status", "0..1", "./../h:substanceAdministration", ImmunizationStatus],
      ["sequence_number", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:observation/h:value"],
      ["product", "0..1", "h:consumable/h:manufacturedProduct", immunizationActivityProduct],
      ["administration", "0..1", "./../h:substanceAdministration", ImmunizationAdministration],
      ["performer", "0..1", "h:performer/h:assignedEntity", shared.assignedEntity],
      //Not in C32 Spec.
      //["instructions", "0..1", "h:entryRelationship[@typeCode='RSON']/h:act", ImmunizationInstructions],
      ["refusal_reason", "0..1", "h:entryRelationship[@typeCode='RSON']/h:act", shared.SimpleCode("2.16.840.1.113883.10.20.1.27")],
    ]);

  var immunizationsSection = component.define("immunizationsSection");
  immunizationsSection.templateRoot(["2.16.840.1.113883.3.88.11.83.117", "1.3.6.1.4.1.19376.1.5.3.1.3.23"]);
  immunizationsSection.fields([
    ["immunizations", "0..*", ImmunizationActivity.xpath(), ImmunizationActivity]
  ]);

  immunizationsSection.cleanupStep(cleanup.replaceWithField('immunizations'));

  return [immunizationsSection, ImmunizationActivity];
};

exports.immunizationsSection = exportImmunizationsSection;
exports.immunizationsEntry = exportImmunizationsSection;
