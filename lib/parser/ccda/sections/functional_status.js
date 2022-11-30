"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");

var exportFunctionalStatusSection = function (version) {
  var sectionIDs = bbm.CCDA["sections" + version];
  var clinicalStatementsIDs = bbm.CCDA["statements" + version];

  var status = component.define('functionalStatusEntry');
  status.templateRoot([clinicalStatementsIDs.FunctionalStatusProblemObservation, clinicalStatementsIDs.CognitiveStatusProblemObservation]);
  status.fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["type", "1..1", "h:code", shared.ConceptDescriptor],
      ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
      ["code", "0..1", "h:value", shared.ConceptDescriptor],
      ["status", "0..1", "./@negationInd"]
    ])
    // cleanup to map present @negationInd to {"status": "negative"},
    // and absent @negationInd to {"status": "completed"}
    .cleanupStep(cleanup.replaceWithObject("status", "negative"))
    .cleanupStep(function () {
      if (this.js && !this.js["status"]) {
        this.js["status"] = "completed";
      }
    });

  var functionalStatusSection = component.define('functionalStatusSection');
  functionalStatusSection.templateRoot([sectionIDs.FunctionalStatusSection]);
  functionalStatusSection.fields([
    ["statuses", "0..*", status.xpath(), status]
  ]);
  functionalStatusSection.cleanupStep(cleanup.replaceWithField(["statuses"]));
  return [functionalStatusSection, status];
};
exports.functionalStatusSection = exportFunctionalStatusSection;
exports.functionStatusEntry = exportFunctionalStatusSection;
