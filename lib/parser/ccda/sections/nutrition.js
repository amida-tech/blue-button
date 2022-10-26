"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
// var processor = require("@amida-tech/blue-button-xml").processor;

/* var bbm = require("@amida-tech/blue-button-meta");
var _ = require("lodash"); */









// this needs work or the model needs or both


var exportNutritionSection = function (version) {

  var nutritionalStatusObservation;
  var nutritionSection;
  var nutritionAssessment;
  var authorParticipation;
  var representedOrganization;
  var assignedAuthor;
  var assignedPerson;
  // if (version === "") {//default version -- version not used anywhere -- not using the if statement
  // if (version === "") {//default version -- version not used anywhere -- not using the if statement

  representedOrganization = component.define("representedOrganization")
    .fields([
      ["id", "0..*", "h:root", shared.Identifier],
      ["name", "0..*", "h:name"],
      ["telecom", "0..*", "h:telecom"],
      ["addr", "0..*", "h:addr", shared.Address],
    ]);
    assignedPerson = component.define("assignedPerson")
      .fields([
        ["name", "0..*", "h.name"]
      ]);
    assignedAuthor = component.define("assignedAuthor")
    .fields([
      ["id", "0..*", "h:root", shared.Identifier],
      ["code", "0..1", "h:code"],
      ["assignedPerson", "0..1", "h:assignedPerson", assignedPerson],
      ["representedOrganization", "0..1", "h:representedOrganization", representedOrganization]
    ]);
    authorParticipation = component.define("authorParticipation")
      .templateRoot("2.16.840.1.113883.10.20.22.4.119")
      .fields([
        // ["identifiers", "1..*", "h:id", shared.Identifier],
        ["templateId", "1..1", "h:templateId[@root='2.16.840.1.113883.10.20.22.4.119']"],
        ["time", "1..1", "h:time", shared.EffectiveTime],
        ["assignedAuthor", "1..1", "h:assignedAuthor", assignedAuthor],
        ["name", "0..*", "h:name", [shared.assignedEntity, shared.IndividualName] ]
      ]);

    nutritionAssessment = component.define("nutritionAssessment")
      .templateRoot("2.16.840.1.113883.10.20.22.4.138")
      .fields([
        // ["identifiers", "1..*", "h:id", shared.Identifier],
        ["templateId", "1..1", "h:templateId[@root='2.16.840.1.113883.10.20.22.4.138']"],
/*         ["moodCode", "1..1", "h:observation[@moodCode='EVN']"],
        ["classCode", "1..1", "h:observation[@classCode='OBS']"], */
        ["code", "1..1", "h:code[@code='75303-8', @codeSystem='2.16.840.1.113883.6.1']"],
        ["id", "1..*", "@root"],
        // ["codeSystem", "1..1", "h:observation[]"],
        ["statusCode", "1..1", "h:statusCode[ @code='completed']"],
        ["effectiveTime", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["entryRelationship", "1..1", "h:entryRelationship[@typeCode='SUBJ']"],
        ["value", "1..1", "h:value"],
        ["assignedAuthor", "1..1", "h:assignedAuthor", authorParticipation]
      ]);
    nutritionalStatusObservation = component.define("nutritionalStatusObservation")
      .templateRoot("2.16.840.1.113883.10.20.22.4.124")
      .fields([
        // ["identifiers", "1..*", "h:id", shared.Identifier],
        ["templateId", "1..1", "h:templateId[@root='2.16.840.1.113883.10.20.22.4.124']"],
        ["id", "1..*", "@root"],
        // ["moodCode", "1..1", "h:observation[@moodCode='EVN']"],
        // ["classCode", "1..1", "h:observation[@classCode='OBS']"],
        // ["codeSystem", "1..1", "h:observation[@codeSystem='2.16.840.1.113883.6.1']"],
        ["statusCode", "1..1", "h:statusCode[@code='completed']"],
        ["entryRelationship", "1..1", "h:entryRelationship[@typeCode='SUBJ']", nutritionAssessment],
        ["code", "1..1", "h:code[@code='75305-3',@codeSystem='2.16.840.1.113883.6.1']"],
        ["effectiveTime", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["value", "1..1", "h:value"],
        // ["title", "1..1", "h:title"],
        // ["nutritionAssessment", "1..1", "h:observation", nutritionAssessment]
      ]);

    nutritionSection = component.define("nutritionSection")
      .templateRoot("2.16.840.1.113883.10.20.22.2.57")
      .fields([
        ["templateId", "1..1", "h:id[@root='2.16.840.1.113883.10.20.22.2.57']", shared.Identifier],
        ["code", "1..1", "h:code[@code='61144-2', @codeSystem='2.16.840.1.113883.6.1']", shared.TextWithReference],
        // , "1..1", "h:codeSystem", shared.ConceptDescriptor],
        ["title", "1..1", "h:title"],
        ["text", "1..1", "h:paragraph"],
        ["entry", "1..1", "h:observation", nutritionalStatusObservation],
        // ["observation", "1..1", "h:observation", nutritionalStatusObservation]
      ]);
      // console.log(authorParticipation, nutritionalAssessment, nutritionalStatusObservation, nutritionSection)
    nutritionSection.cleanupStep(cleanup.replaceWithField('nutrition'));
    return nutritionSection;
};

exports.nutritionSection = exportNutritionSection;
exports.nutritionEntry = exportNutritionSection;

/*
{
  TextWithReference: {
  },
  NegationIndicator: {
  },
  ConceptDescriptor: {
  },
  AgeDescriptor: {
  },
  SimplifiedCode: {
  },
  PhysicalQuantity: {
  },
  XsiTypedValue: {
  },
  EventOffset: {
  },
  EffectiveTime: {
  },
  IndividualName: {
  },
  Address: {
  },
  Organization: {
  },
  assignedEntity: {
  },
  serviceDeliveryLocation: {
  }
} */