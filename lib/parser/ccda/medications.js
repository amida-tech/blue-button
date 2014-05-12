var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");
var Cleanup = require("./cleanup");


var MedicationInformation = Component.define("MedicationInformation")
.templateRoot("2.16.840.1.113883.10.20.22.4.23")
.fields([
  ["identifiers","0..1", "h:id", shared.Identifier],
  ["unencoded_name", "0..1", "h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
  ["product","1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor]
]).cleanupStep(function() {

  if (this.js.unencoded_name) {
    this.js.product.js.unencoded_name = this.js.unencoded_name;
    delete this.js.unencoded_name;
  }
  if (this.js.identifiers) {
    this.js.product.js.identifers = this.js.identifiers;
    delete this.js.identifiers;
  }

  if (this.js.product) {
    this.js = this.js.product.js;
  }

});


var MedicationAdministration = Component.define("MedicationAdministration")
.fields([
  ["route","0..1", "h:routeCode", shared.ConceptDescriptor],
  ["site","0..1", "h:approachSiteCode", shared.ConceptDescriptor],
  ["form","0..1", "h:administrationUnitCode", shared.ConceptDescriptor],
  ["dose","0..1", "h:doseQuantity", shared.PhysicalQuantity],
  ["rate","0..1", "h:rateQuantity", shared.PhysicalQuantity],
  ["dose_restriction","0..1", "h:maxDoseQuantity", shared.PhysicalQuantity]
]);


var MedicationPrecondition = Component.define("MedicationPrecondition")
.fields([
  ["code","0..1", "h:code", shared.ConceptDescriptor],
  ["text","0..1", "h:text"],
  ["value","0..1", "h:value", shared.ConceptDescriptor]
]);

var MedicationActivity = Component.define("MedicationActivity")
.templateRoot("2.16.840.1.113883.10.20.22.4.16")
.fields([
  ["date", "0..2", "h:effectiveTime[not (@operator='A')]", shared.EffectiveTime],
  ["identifiers","1..*", "h:id", shared.Identifier],
  ["status", "1..1", "./../h:substanceAdministration/@moodCode"],
  ["sig","0..1", "h:text", shared.TextWithReference],
  ["product", "1..1", "h:consumable/h:manufacturedProduct", MedicationInformation],
  ["administration", "0..1", "./../h:substanceAdministration", MedicationAdministration],
  ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition]
])
//.cleanupStep(Cleanup.extractAllFields(["medicationName"]))
.cleanupStep(function(){

  //Cleanup Status.


  if (this.js.status === "EVN") {
    this.js.status = "Completed"
  }
  if (this.js.status === "INT") {
    this.js.status = "Prescribed"
  }

  // separate out two effectiveTimes

/*
  // 1.  startDate --- endDate
  var range = this.js.times.filter(function(t){
    return -1 === ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
  });

  // 2.  dosing interval
  var period= this.js.times.filter(function(t){
    return -1 !== ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
  });

  delete this.js.times;

  if (range.length > 0) {
    this.js.dateRange = range[0];
  }

  if (period.length > 0) {
    this.js.dosePeriod = period[0].js.period;
  }*/

});

var MedActivityRx = MedicationActivity.define("Prescription")
.withMood("INT");

var MedActivityHx = MedicationActivity.define("MedActivityHx")
.withMood("EVN");

exports.MedicationsSection = Component.define("MedicationsSection")
.templateRoot(["2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1"])
.fields([
  ["medications","0..*", MedActivityRx.xpath(), MedActivityRx],
  //["medicationsReported","0..*", MedActivityHx.xpath(), MedActivityHx],
])
//.cleanupStep(Cleanup.ensureMutuallyExclusive([
//  "medicationsPrescribed",
//  "medicationsReported", 
//]));
