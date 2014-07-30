"use strict";

var component = require("./component");

var shared = require("./shared");

var exportCCD = function(version) {

    var patient = require("./demographics").patient;
    var resultsSection = require("./sections" + version + "/results").resultsSection;
    var vitalSignsSection = require("./sections" + version + "/vitals").vitalSignsSection;
    var problemsSection = require("./sections" + version + "/problems").problemsSection;
    var immunizationsSection = require("./sections" + version + "/immunizations").immunizationsSection;
    var socialHistorySection = require("./sections" + version + "/social_history").socialHistorySection;
    var medicationsSection = require("./sections" + version + "/medications").medicationsSection;
    var allergiesSection = require("./sections" + version + "/allergies").allergiesSection;
    var encountersSection = require("./sections" + version + "/encounters").encountersSection;
    var proceduresSection = require("./sections" + version + "/procedures").proceduresSection;
    var plan_of_care_section = require("./sections" + version + "/plan_of_care").plan_of_care_section;
    var payers_section = require("./sections" + version +  "/payers").payers_section;

    return component.define("CCD")
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
        ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
        ["plan_of_care", "0..1", plan_of_care_section.xpath(), plan_of_care_section],
        ["payers", "0..1", payers_section.xpath(), payers_section],
    ]);
}

exports.CCD = exportCCD;
