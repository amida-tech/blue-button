"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var processor = require("@amida-tech/blue-button-xml").processor;
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");

var exportHospitalDischargeMedicationsSection = function (version) {
  var medication_activity = require('./medications').medicationsSection(version)[1];
  var sectionIDs = bbm.CCDA["sections" + version];
  var clinicalStatementsIDs = bbm.CCDA["statements" + version];

  var hospital_discharge_medications_section = component.define("HospitalDischargeMedicationsSection");
  hospital_discharge_medications_section.templateRoot([sectionIDs.HospitalDischargeMedicationsSection, sectionIDs.HospitalDischargeMedicationsSectionEntriesOptional]);
  hospital_discharge_medications_section.fields([
    ["medications", "0..*", medication_activity.xpath(), medication_activity]
  ]);
  hospital_discharge_medications_section.cleanupStep(cleanup.replaceWithField("medications"));
  return [hospital_discharge_medications_section, medication_activity];
};

exports.hospital_discharge_medications_section = exportHospitalDischargeMedicationsSection;
