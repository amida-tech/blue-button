"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var processor = require("blue-button-xml").processor;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportHospitalDischargeMedicationsSection = function (version) {
    var medication_activity = require('./medications')(version)[1];
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    // NOTE we could omit this entire middle component and reach into
    // medication activity xpaths from the section level
    var discharge_medication = component.define("DischargeMedication")
        .templateRoot(clinicalStatementsIDs.DischargeMedication)
        .fields([
            ["entry", "1..1", medication_activity]
        ])
        .cleanupStep(cleanup.replaceWithField("entry"));

    var hospital_discharge_medications_section = component.define("HospitalDischargeMedicationsSection");
    hospital_discharge_medications_section.templateRoot([sectionIDs.HospitalDischargeMedicationsSection, sectionIDs.HospitalDischargeMedicationsSectionEntriesOptional]);
    hospital_discharge_medications_section.fields([
        ["medications", "0..*", discharge_medication.xpath(), discharge_medication]
    ]);
    hospital_discharge_medications_section.cleanupStep(cleanup.replaceWithField("medications"));
    return [hospital_discharge_medications_section];
};

exports.hospital_discharge_medications_section = exportHospitalDischargeMedicationsSection;
