"use strict";

var component = require("@amida-tech/blue-button-xml").component;
var shared = require("./shared");

var exportC32 = function (version) {
  var patient = require("./demographics").patient;
  var allergiesSection = require("./sections/allergies").allergiesSection(version)[0];
  var vitalSignsSection = require("./sections/vitals").vitalSignsSection(version)[0];
  var resultsSection = require("./sections/results").resultsSection(version)[0];
  var problemsSection = require("./sections/problems").problemsSection(version)[0];
  var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
  var immunizationsSection = require("./sections/immunizations").immunizationsSection(version)[0];
  var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
  var encountersSection = require("./sections/encounters").encountersSection(version)[0];
  return component.define("C32")
    .fields([
      ["meta", "0..1", ".", shared.metaData],
      ["demographics", "1..1", "(/ | //h:recordTarget/h:patientRole)[last()]", patient],
      ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
      ["encounters", "0..1", encountersSection.xpath(), encountersSection],
      ["immunizations", "0..1", immunizationsSection.xpath(), immunizationsSection],
      ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
      ["problems", "0..1", problemsSection.xpath(), problemsSection],
      ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
      ["vitals", "0..1", vitalSignsSection.xpath(), vitalSignsSection],
      ["results", "0..1", resultsSection.xpath(), resultsSection]
    ]);

};

exports.C32 = exportC32;
