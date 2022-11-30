"use strict";

// NOTE: allergies section not present in ccda-r1.0, so just kept
// templateIds hard-coded with ccda-r1.1 values
var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component;
var cleanup = require("../cleanup");
var processor = require("@amida-tech/blue-button-xml").processor;
var _ = require("lodash");

var exportAllergiesSection = function (version) {

  var allergySeverityObservation = component.define("allergySeverityObservation")
    .fields([

      //VA Mod, per file no coding, so shim into code name.
      //["code", "0..1", "h:value", shared.ConceptDescriptor],
      ["code.name", "0..1", "h:text", shared.TextWithReference]
      //Interpretation not in C32 Spec.
      //["interpretation", "0..1", "h:interpretationCode", shared.ConceptDescriptor]
    ]);

  var allergyReaction = component.define("allergyReaction");
  allergyReaction.templateRoot(["2.16.840.1.113883.10.20.1.54"]);
  allergyReaction.fields([
    ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
    ["reaction.name", "1..1", "h:text", shared.TextWithReference],
    //Reaction Severity not included in C32 Spec.
    //["severity", "0..1", "h:entryRelationship/h:observation", allergySeverityObservation]
  ]);

  var allergenDescriptor = component.define('allergenDescriptor');
  allergenDescriptor.fields([

    ["name", "0..1", "h:name/text()"],
    ["code", "0..1", "h:code", shared.ConceptDescriptor]
  ]).cleanupStep(function () {

    //Custom VA C32 Shim.
    if (_.get(this, "js.code")) {
      if (_.get(this, "js.code.js.name") === "Coded Allergy Name Not Available") {
        delete this.js.code;
      }
    }

  });

  /*
  var allergyStatusObservation = component.define("allergyStatusObservation");
  allergyStatusObservation.fields([
      ["code", "0..1", "@code"],
      ["status", "0..1", "@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.80.68")],
  ]);
  */

  var allergyObservation = component.define("allergyObservation"); // this is status observation
  allergyObservation.templateRoot(["2.16.840.1.113883.10.20.1.18"]);
  allergyObservation.fields([
    ["identifiers", "0..*", "h:id", shared.Identifier],
    //NOTE: Negation Id (per PragueExpat)
    ["negation_indicator", "0..1", "./@negationInd", processor.asBoolean],
    //NOTE allergen must be optional in case of negationInd = true (per PragueExpat)
    ["allergen", "0..1", "h:participant/h:participantRole/h:playingEntity", allergenDescriptor], // (see above) - was 1..1 //Require (optional in spec)

    ["intolerance", "0..1", "h:code", shared.ConceptDescriptor],
    ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],

    //Status not included on C32.
    //["status", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.22.4.28']/h:value", shared.ConceptDescriptor],
    ["reactions", "0..*", allergyReaction.xpath(), allergyReaction],
    ["severity", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.1.55']", allergySeverityObservation]
  ]);

  var problemAct = component.define('problemAct');
  problemAct.templateRoot(['2.16.840.1.113883.3.88.11.83.6']);
  problemAct.fields([
    ["identifiers", "0..*", "h:id", shared.Identifier],
    ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
    ["problemStatus", "1..1", "h:statusCode/@code"],
    ["observation", "1..1", allergyObservation.xpath(), allergyObservation] // Ignore observation cardinality (in spec can be more than 1)
  ]);
  problemAct.cleanupStep(cleanup.allergiesProblemStatusToHITSP);

  var allergiesSection = component.define('allergiesSection');
  allergiesSection.templateRoot(['2.16.840.1.113883.3.88.11.83.102']);
  allergiesSection.fields([
    ["problemAct", "1..*", problemAct.xpath(), problemAct]
  ]);
  allergiesSection.cleanupStep(cleanup.replaceWithField(["problemAct"]));

  return [allergiesSection, problemAct];
};
exports.allergiesSection = exportAllergiesSection;
exports.allergiesEntry = exportAllergiesSection;
