var fs = require("fs");
var util = require("util");
var common = require("./common");

var Processor = require("./processor");
var OIDs = require("./oids");
var Component = require("./component");
var Cleanup = require("./cleanup");

var shared = require('./shared');

var Patient = require('./demographics').Patient;
var ResultsSection = require('./results').ResultsSection;
var VitalSignsSection = require('./vitals').VitalSignsSection;
var ProblemsSection = require('./problems').ProblemsSection;
var ImmunizationsSection = require('./immunizations').ImmunizationsSection;
var socialHistorySection = require('./socialHistory').socialHistorySection;
var MedicationsSection = require('./medications').MedicationsSection;
var allergiesSection = require('./allergies').allergiesSection;
var encountersSection = require('./encounters').encountersSection;
var proceduresSection = require('./procedures').proceduresSection;

var CCD = exports.CCD = Component.define("CCD")
.fields([
  ["sourceIds", "1..*", "h:id", shared.Identifier],
  ["demographics", "1..1", "//h:recordTarget/h:patientRole", Patient],
  ["vitals", "0..1", VitalSignsSection.xpath(), VitalSignsSection],
  ["results", "0..1", ResultsSection.xpath(), ResultsSection],
  ["medications", "0..1", MedicationsSection.xpath(), MedicationsSection],
  ["encounters", "0..1", encountersSection.xpath(), encountersSection],
  ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
  ["immunizations", "0..1", ImmunizationsSection.xpath(), ImmunizationsSection],
  ["socialHistory", "0..1", socialHistorySection.xpath(), socialHistorySection],
  ["problems", "0..1", ProblemsSection.xpath(), ProblemsSection],
  ["procedures", "0..1", proceduresSection.xpath(), proceduresSection]
]);