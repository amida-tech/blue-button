"use strict";

var component = require("./component");

var shared = require("./shared");

var patient = require("./demographics").patient;
var resultsSection = require("./sections/results").resultsSection;
var vitalSignsSection = require("./sections/vitals").vitalSignsSection;
var problemsSection = require("./sections/problems").problemsSection;
var immunizationsSection = require("./sections/immunizations").immunizationsSection;
var socialHistorySection = require("./sections/social_history").socialHistorySection;
var medicationsSection = require("./sections/medications").medicationsSection;
var allergiesSection = require("./sections/allergies").allergiesSection;
var encountersSection = require("./sections/encounters").encountersSection;
var proceduresSection = require("./sections/procedures").proceduresSection;

exports.CCD = component.define("CCD")
    .fields([
        ["identifiers", "1..*", "h:id", shared.identifier],
        ["demographics", "1..1", "//h:recordTarget/h:patientRole", patient],
        ["vitals", "0..1", vitalSignsSection.xpath(), vitalSignsSection],
        ["results", "0..1", resultsSection.xpath(), resultsSection],
        ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
        ["encounters", "0..1", encountersSection.xpath(), encountersSection],
        ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
        ["immunizations", "0..1", immunizationsSection.xpath(), immunizationsSection],
        ["social_history", "0..1", socialHistorySection.xpath(), socialHistorySection],
        ["problems", "0..1", problemsSection.xpath(), problemsSection],
        ["procedures", "0..1", proceduresSection.xpath(), proceduresSection]
    ]);
