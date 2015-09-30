"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var processor = require("blue-button-xml").processor;
var bbm = require("blue-button-meta");
var _ = require("lodash");

var exportMedicationsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

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
            //["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
            ["rate", "0..1", "h:rateQuantity", shared.PhysicalQuantity],
            ["dose_restriction", "0..1", "h:maxDoseQuantity", shared.PhysicalQuantity],
            //["interval", "0..1", "h:effectiveTime[@operator='A']", MedicationInterval],
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
            ["text", "0..1", "h:text"],
            ["value", "0..1", "h:value", shared.ConceptDescriptor]
        ]);

    var author = component.define("author")
        .fields([
            ["date_time", "0..1", "h:time", shared.EffectiveTime],
            ["identifiers", "0..*", "h:assignedAuthor/h:id", shared.Identifier],
            [version === "" ? "name" : "organization", "0..1",
                "(h:assignedAuthor/h:representedOrganization | h:assignedAuthor/h:assignedPerson/h:name)[last()]", (version === "" ? shared.IndividualName : shared.Organization)
            ]
        ]);

    var MedicationInformation = component.define("MedicationInformation")
        .templateRoot("2.16.840.1.113883.10.20.22.4.23")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["unencoded_name", "0..1", "h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
            ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
            ["manufacturer", "0..1", "h:manufacturerOrganization/h:name"]
        ]);

    var MedicationSupplyOrder = component.define("MedicationSupplyOrder")
        .fields([
            ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["repeatNumber", "0..1", "h:repeatNumber/@value"],
            ["quantity", "0..1", "h:quantity/@value"],
            ["status", "0..1", "h:status/@code"],
            ["author", "0..1", "h:author", author] //, instructions use references, which are not supported (also samples don't have good data for it)
            //["instructions", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:act", MedicationInstructions]
        ]);

    var MedicationPerformer = component.define("MedicationPerformer")
        .fields([
            ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
            ["address", "0..*", "h:assignedEntity/h:addr", shared.Address],
            ["phone", "0..1", "h:assignedEntity/" + shared.phone.xpath(), shared.phone],
            ["organization", "0..*", "h:assignedEntity/h:representedOrganization", shared.Organization]
        ]);
    /*
        var MedicationDrugVehicle = component.define("MedicationDrugVehicle")
            .templateRoot("2.16.840.1.113883.10.20.22.4.24")
            .fields([
                ["playingEntity", "0..1", "h:playingEntity/h:code", shared.ConceptDescriptor]
            ]).cleanupStep(cleanup.extractAllFields(["drug_vehicle"]));
*/
    var MedicationInstructions = component.define("MedicationInstructions")
        .fields([
            ["code", "0..1", "../h:code", shared.ConceptDescriptor],
            ["freeText", "0..1", "../h:text", shared.TextWithReference]
        ]);

    var MedicationDispense = component.define("MedicationDispense")
        .templateRoot("2.16.840.1.113883.10.20.22.4.18")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["performer", "0..1", "h:performer", MedicationPerformer],
            ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", MedicationSupplyOrder]
        ]);

    var MedicationActivity = component.define("MedicationActivity")
        .templateRoot("2.16.840.1.113883.3.88.11.83.8")
        .fields([
            ["date_time", "0..1", "h:effectiveTime[not (@operator='A')]", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["status", "1..1", "./../h:substanceAdministration/@moodCode"],
            ["sig", "0..1", "h:text", shared.TextWithReference],
            ["product", "1..1", "h:consumable/h:manufacturedProduct", MedicationInformation],
            ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", MedicationSupplyOrder],
            ["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
            ["performer", "0..1", "h:performer", MedicationPerformer],
            ["drug_vehicle", "0..1", "h:participant[@typeCode='CSM']/h:participantRole/h:playingEntity[@classCode='MMAT']/h:code", shared.ConceptDescriptor],
            ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition],
            ["indication", "0..1", "h:entryRelationship[@typeCode='RSON']/h:observation", MedicationIndication],
            //["instructions", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply/*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.20']", MedicationInstructions],
            ["dispense", "0..1", MedicationDispense.xpath(), MedicationDispense]
        ])
        //.cleanupStep(Cleanup.extractAllFields(["medicationName"]))
        .cleanupStep(function () {

            this.js.identifiers = _.filter(this.js.identifiers, function (identifier) {
                if (identifier) {
                    if (identifier.js === null) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            });

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

    var medicationsSection = component.define("medicationsSection");
    medicationsSection.templateRoot(["2.16.840.1.113883.3.88.11.83.112", "1.3.6.1.4.1.19376.1.5.3.1.3.19"]);
    medicationsSection.fields([
        ["medications", "0..*", MedicationActivity.xpath(), MedicationActivity]
    ]);
    medicationsSection.cleanupStep(cleanup.replaceWithField('medications'));
    return [medicationsSection, MedicationActivity];

};

exports.medicationsSection = exportMedicationsSection;
exports.medicationsEntry = exportMedicationsSection;
