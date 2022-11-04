"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
var processor = require("@amida-tech/blue-button-xml").processor;
var bbm = require("@amida-tech/blue-button-meta");
var _ = require("lodash");

var exportMedicationsSection = function (version) {
  var sectionIDs = bbm.CCDA["sections" + version];
  var clinicalStatementsIDs = bbm.CCDA["statements" + version];

  // Common entries between ccda-r1.1 and ccda-r1.0

  /* 1. For the medication interval component, you may find that some of the fields
  below(xsi:type, alignment, event, event_offset) are not defined in ccda 1.1.
  specification and in many sample files.

  refer to this link: https://groups.google.com/forum/#!msg/ccda_samples/WawmwNMYT_8/pqnp5bG1IygJ

  2. This is about the frequency tag and institutionSpecified attribute:

  The period element can represent either timing between doses or frequency.
  Use @institutionSpecified to distinguish these: To specify an interval between doses
  (e.g., every 8 hours), set the value of @institutionSpecified to false or omit the attribute.
  To specify frequency of administration (e.g., 3 times per day), set the value
  of @institutionSpecified to true.

  source: http://wiki.siframework.org/CDA+-+Medications+Section

  */

    var MedicationSeverityObservation = component.define("immunizationSeverityObservation")
      .fields([
        ["code", "0..1", "h:value", shared.ConceptDescriptor],
        ["interpretation", "0..1", "h:interpretationCode", shared.ConceptDescriptor]
      ]);
    var MedicationReaction = component.define("medicationReaction")
      .templateRoot(["2.16.840.1.113883.10.20.22.4.9"])
      .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["reaction", "1..1", "h:value", shared.ConceptDescriptor],
        ["free_text_reaction", "0..1", "h:text", shared.TextWithReference],
        ["severity", "0..1", "h:entryRelationship/h:observation", MedicationSeverityObservation]
      ])
      .cleanupStep(cleanup.promoteFreeTextIfNoReaction);

  var MedicationInterval = component.define("MedicationInterval")
    .fields([
      ["phase", "0..1", "./h:phase", shared.EffectiveTime],
      ["period", "0..1", "./h:period", shared.PhysicalQuantity],
      ["alignment", "0..1", "./@alignment"],
      ["frequency", "0..1", "./@institutionSpecified", processor.asBoolean],
      ["event", "0..1", "./h:event/@code", shared.SimpleCode("2.16.840.1.113883.5.139")],
      ["event_offset", "0..1", "./h:offset", shared.EventOffset]
    ]);

  var MedicationAdministration = component.define("MedicationAdministration")
    .fields([
      ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
      ["site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
      ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor],
      ["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
      ["rate", "0..1", "h:rateQuantity", shared.PhysicalQuantity],
      ["dose_restriction", "0..1", "h:maxDoseQuantity", shared.PhysicalQuantity],
      ["interval", "0..1", "h:effectiveTime[@operator='A']", MedicationInterval],
    ]);

  var MedicationIndication = component.define("MedicationIndication")
    .fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
      ["value", "0..1", "h:value", shared.ConceptDescriptor]
    ]);

  var MedicationPrecondition = component.define("MedicationPrecondition")
    .fields([
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["text", "0..1", "h:text/text()"],
      ["value", "0..1", "h:value", shared.ConceptDescriptor]
    ]);

  var author = component.define("author")
    .fields([
      ["date_time", "0..1", "h:time", shared.EffectiveTime],
      ["identifiers", "0..*", "h:assignedAuthor/h:id", shared.Identifier],
      ["name", "0..1", "h:assignedAuthor/h:assignedPerson/h:name", shared.IndividualName],
      ["organization", "0..1", "h:assignedAuthor/h:representedOrganization", shared.Organization]
    ]);

  var MedicationInstructions = component.define("MedicationInstructions")
    .fields([
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["free_text", "0..1", "h:text/text()"]
    ]);

  // below entries differ between ccda-r1.1 and ccda-r1.0
  // ***************************************************************************
  // *                      ccda-r1.1 (LATEST VERSION)                         *
  // ***************************************************************************

  var immunizationMedicationInformation;
  var medicationInformation;
  var medicationSupplyOrder;
  var medicationActivity;
  var medicationsSection;
  var manufacturedMaterial;

  if (version === "") {

    manufacturedMaterial = component.define("manufacturedMaterial")
    .fields([
      ["code", "1..1", "h:manufacturedMaterial/h:code "],
      ["translation", "0..*", "h:manufacturedMaterial/h:translation"],
      ["lotNumberText", "0..*", "h:manufacturedMaterial/h:lotNumberText"],
      ["manufacturerOrganization", "0..1", "h:manufacturerOrganization"],
    ]);

    immunizationMedicationInformation = component.define("immunizationMedicationInformation")
    .templateRoot("2.16.840.1.113883.10.20.22.4.54")
    .fields([
      ["id", "0..*", "h:id"],
      ["manufacturedMaterial", "1..1", "h:manufacturedMaterial", manufacturedMaterial],
    ]);
    medicationInformation = component.define("medicationInformation")
      .templateRoot("2.16.840.1.113883.10.20.22.4.23")
      .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["unencoded_name", "0..1", "h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
        ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
        ["manufacturer", "0..1", "h:manufacturerOrganization/h:name/text()"],
        ["manufacturedMaterial", "1..1", "h:manufacturedMaterial", immunizationMedicationInformation]
      ]);

    medicationSupplyOrder = component.define("medicationSupplyOrder")
      .fields([
        ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["repeatNumber", "0..1", "h:repeatNumber/@value"],
        ["quantity", "0..1", "h:quantity/@value"],
        ["status", "0..1", "h:status/@code"],
        ["author", "0..1", "h:author", author],
        ["instructions", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:act", MedicationInstructions],
        ["product", "0..1", "h:product/h:manufacturedProduct", medicationInformation]
      ]);

    var MedicationPerformer = component.define("MedicationPerformer")
      .fields([
        ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
        ["address", "0..*", "h:assignedEntity/h:addr", shared.Address],
        ["phone", "0..*", "h:assignedEntity/" + shared.phone.xpath(), shared.phone],
        ["organization", "0..*", "h:assignedEntity/h:representedOrganization", shared.Organization]
      ]);
    /*
        var MedicationDrugVehicle = component.define("MedicationDrugVehicle")
            .templateRoot("2.16.840.1.113883.10.20.22.4.24")
            .fields([
                ["playingEntity", "0..1", "h:playingEntity/h:code", shared.ConceptDescriptor]
            ]).cleanupStep(cleanup.extractAllFields(["drug_vehicle"]));
*/

    var MedicationDispense = component.define("MedicationDispense")
      .templateRoot("2.16.840.1.113883.10.20.22.4.18")
      .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["performer", "0..1", "h:performer", MedicationPerformer],
        ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", medicationSupplyOrder],
        ["product", "0..1", "h:product/h:manufacturedProduct", medicationInformation]
      ]);

    medicationActivity = component.define("medicationActivity")
      .fields([
        ["date_time", "0..1", "h:effectiveTime[not (@operator='A')]", shared.EffectiveTime],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["status", "1..1", "./../h:substanceAdministration/@moodCode"],
        ["sig", "0..1", "h:text", shared.TextWithReference],
        ["product", "1..1", "h:consumable/h:manufacturedProduct", medicationInformation],
        ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", medicationSupplyOrder],
        ["reactions", "0..*", "h:entryRelationship[@typeCode='CAUS']/h:observation", MedicationReaction],
        ["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
        ["performer", "0..1", "h:performer", MedicationPerformer],
        ["drug_vehicle", "0..1", "h:participant[@typeCode='CSM']/h:participantRole/h:playingEntity[@classCode='MMAT']/h:code", shared.ConceptDescriptor],
        ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition],
        ["indication", "0..1", "h:entryRelationship[@typeCode='RSON']/h:observation", MedicationIndication],
        //["instructions", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply/*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.20']", MedicationInstructions],
        ["dispense", "0..1", MedicationDispense.xpath(), MedicationDispense],
        ["manufacturedMaterial", "1..1", "h:manufacturedMaterial", manufacturedMaterial]
      ])
      //.cleanupStep(Cleanup.extractAllFields(["medicationName"]))
      .cleanupStep(function () {

        //Cleanup Status.

        if (_.get(this, "js.status") === "EVN") {
          this.js.status = "Completed";
        }
        if (_.get(this, "js.status") === "INT") {
          this.js.status = "Prescribed";
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
    medicationActivity.setXPath(".//h:templateId[@root=\"2.16.840.1.113883.10.20.22.4.16\" and not(../@negationInd=\"true\")]/..");

    // ignore negationInd medications

    medicationsSection = component.define("medicationsSection")
      .templateRoot(["2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1"])
      .fields([
        ["medications", "0..*", medicationActivity.xpath(), medicationActivity]// seems to include all of activity and everything defined in it
      ]);
      // console.log(medicationsSection)
    medicationsSection.cleanupStep(cleanup.replaceWithField('medications'));
    return [medicationsSection, medicationActivity];

    // ***************************************************************************
    // *                      ccda-r1.0 (OLD VERSION)                            *
    // ***************************************************************************
  } else {
      manufacturedMaterial = component.define("manufacturedMaterial")
      .fields([
        ["code", "1..1", "h:manufacturedMaterial/h:code "],
        ["translation", "0..*", "h:manufacturedMaterial/h:translation"],
        ["lotNumberText", "0..*", "h:manufacturedMaterial/h:lotNumberText"],
        ["manufacturerOrganization", "0..1", "h:manufacturerOrganization"],
      ]);

      immunizationMedicationInformation = component.define("immunizationMedicationInformation")
      .templateRoot("2.16.840.1.113883.10.20.22.4.54")
      .fields([
        ["id", "0..*", "h:id"],
        ["manufacturedMaterial", "1..1", "h:manufacturedMaterial", manufacturedMaterial],
      ]);
      medicationInformation = component.define("medicationInformation")
        .templateRoot("2.16.840.1.113883.10.20.1.53")
        .fields([
          ["unencoded_name", "0..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
          ["product", "1..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code", immunizationMedicationInformation],
          // ["product", "1..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
        ]);

      medicationSupplyOrder = component.define("medicationSupplyOrder")
        .templateRoot("2.16.840.1.113883.10.20.1.34")
        .fields([
          ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
          ["repeatNumber", "0..1", "h:repeatNumber/@value"],
          ["quantity", "0..1", "h:quantity/@value"],
          ["author", "0..1", "h:author", author]
        ]);

      medicationActivity = component.define("Medications")
        .templateRoot(["2.16.840.1.113883.10.20.1.34", "2.16.840.1.113883.10.20.1.24"])
        .fields([
          ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
          ["identifiers", "0..*", "h:id", shared.Identifier],
          ["status", "1..1", "h:statusCode/@code"],
          ["sig", "0..1", "h:text", shared.TextWithReference],
          ["product", "1..1", "(h:product | h:consumable)", medicationInformation],
          ["supply", "0..1", "../h:supply", medicationSupplyOrder],
          ["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
          ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition]
        ])
        .cleanupStep(function () {

          //Cleanup Status.

          if (_.get(this, "js.status") === "EVN") {
            this.js.status = "Completed";
          }
          if (_.get(this, "js.status") === "INT") {
            this.js.status = "Prescribed";
          }
        });

      medicationsSection = component.define("medicationsSection");
      medicationsSection.templateRoot("2.16.840.1.113883.10.20.1.8");
      medicationsSection.fields([
        ["Medications", "0..*", medicationActivity.xpath(), medicationActivity]
      ]);
      medicationsSection.cleanupStep(cleanup.replaceWithField('medications'));
      return [medicationsSection, medicationActivity];
    }
};

exports.medicationsSection = exportMedicationsSection;
exports.medicationsEntry = exportMedicationsSection;
