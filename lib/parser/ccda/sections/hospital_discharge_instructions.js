"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component.withNullFlavor();
var processor = require("blue-button-xml").processor;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportHospitalDischargeInstructionsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var hospital_discharge_instructions_section = component.define("HospitalDischargeInstructionsSection");
    hospital_discharge_instructions_section.templateRoot([sectionIDs.HospitalDischargeInstructionsSection]);
    hospital_discharge_instructions_section.fields([
        //["code", "1..1", "h:code", shared.ConceptDescriptor],
        ["title", "0..1", "h:title", shared.TextWithReference],
        ["text", "0..1", "h:text", processor.asXmlString]

    ]);
    return [hospital_discharge_instructions_section];
};

exports.hospital_discharge_instructions_section = exportHospitalDischargeInstructionsSection;
