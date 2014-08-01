"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var Processor = require('../processor');

var MedicationInformation = component.define("MedicationInformation")
    .templateRoot("2.16.840.1.113883.10.20.1.53")
    .fields([
        ["unencoded_name", "0..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
        ["product", "1..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
    ]);

var MedicationInterval = component.define("MedicationInterval")
    .fields([
        ["xsiType", "0..1", "./@xsi:type"],
        ["phase", "0..1", "./h:phase", shared.EffectiveTime],
        ["period", "0..1", "./h:period", shared.PhysicalQuantity],
        ["alignment", "0..1", "./@alignment"],
        ["frequency", "0..1", "./@institutionSpecified", Processor.asBoolean],
        ["event", "0..1", "./h:event/@code", shared.SimpleCode("2.16.840.1.113883.5.139")],
        ["event_offset", "0..1", "./h:offset", shared.EventOffset]
    ]).cleanupStep(cleanup.removeField('xsiType'))

var author = component.define("author")
    .fields([
        ["date_time", "0..1", "h:time", shared.EffectiveTime],
        ["identifiers", "1..*", "h:assignedAuthor/h:id", shared.Identifier],
        ["organization", "0..1", "h:assignedAuthor/h:representedOrganization", shared.Organization],
    ]);

var MedicationSupplyOrder = component.define("MedicationSupplyOrder")
    .templateRoot("2.16.840.1.113883.10.20.1.34")
    .fields([
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["repeatNumber", "0..1", "h:repeatNumber/@value"],
        ["quantity", "0..1", "h:quantity/@value"],
        ["author", "0..1", "h:author", author]
    ]);

var MedicationPrecondition = component.define("MedicationPrecondition")
    .fields([
        ["code", "0..1", "h:code", shared.ConceptDescriptor],
        ["text", "0..1", "h:text"],
        ["value", "0..1", "h:value", shared.ConceptDescriptor]
    ]);

var MedicationAdministration = component.define("MedicationAdministration")
    .templateRoot("2.16.840.1.113883.10.20.1.24")
    .fields([
        ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
        ["site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
        ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor],
        ["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
        ["rate", "0..1", "h:rateQuantity", shared.PhysicalQuantity],
        ["dose_restriction", "0..1", "h:maxDoseQuantity", shared.PhysicalQuantity],
        ["interval", "0..1", "h:effectiveTime[@operator='A']", MedicationInterval],
    ]);

var Medications = component.define("Medications")
    .templateRoot(["2.16.840.1.113883.10.20.1.34", "2.16.840.1.113883.10.20.1.24"])
    .fields([
         ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
         ["identifiers", "1..*", "h:id", shared.Identifier],
         ["status", "1..1", "h:statusCode/@code"],
         ["sig", "0..1", "h:text", shared.TextWithReference],
         ["product", "1..1", "(h:product | h:consumable)", MedicationInformation],
         ["supply", "0..1", "../h:supply", MedicationSupplyOrder],
         ["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
         ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition]
     ])
    .cleanupStep(function () {

        //Cleanup Status.

        if (this.js.status === "EVN") {
            this.js.status = "Completed";
        }
        if (this.js.status === "INT") {
            this.js.status = "Prescribed";
        }
    });

var MedActivityRx = Medications.define("Prescription")
    .withMood("INT");

var MedActivityHx = Medications.define("MedActivityHx")
    .withMood("EVN");

var medicationsSection = exports.medicationsSection = component.define("medicationsSection");
medicationsSection.templateRoot("2.16.840.1.113883.10.20.1.8");
medicationsSection.fields([
    ["Medications", "0..*", MedActivityRx.xpath(), MedActivityRx]
]);
medicationsSection.cleanupStep(cleanup.replaceWithField('Medications'));

exports.medicationsEntry = Medications;
