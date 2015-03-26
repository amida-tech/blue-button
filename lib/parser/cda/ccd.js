"use strict";

var component = require("blue-button-xml").component;
var shared = require("./shared");

var exportCCD = function (version) {
    var patient = require("./demographics").patient;
    var resultsSection = require("./sections/results").resultsSection(version)[0];
    var problemsSection = require("./sections/problems").problemsSection(version)[0];
    var encountersSection = require("./sections/encounters").encountersSection(version)[0];
    var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
    var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
    var providersSection = require("./sections/providers").providersSection(version)[0];
    var payers_section = require("./sections/payers").payers_section(version)[0];

    return component.define("CCD")
        .fields([
            ["doc_identifiers", "0..*", "h:id", shared.Identifier],
            ["confidentiality", '0..1', "h:confidentialityCode", shared.SimplifiedCodeOID("2.16.840.1.113883.5.25")],
            ["demographics", "1..1", "(/ | //h:recordTarget/h:patientRole)[last()]", patient],
            ["providers", "0..*", "//h:documentationOf/h:serviceEvent/h:performer", providersSection],
            ["problems", "0..1", problemsSection.xpath(), problemsSection],
            ["encounters", "0..1", encountersSection.xpath(), encountersSection],
            ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
            ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
            ["results", "0..1", resultsSection.xpath(), resultsSection],
            ["payers", "0..1", payers_section.xpath(), payers_section],
        ]);

};

exports.CCD = exportCCD;
