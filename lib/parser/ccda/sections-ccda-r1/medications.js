"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var Processor = require('../processor');

var MedicationInformation = component.define("MedicationInformation")
    .fields([
        ["unencoded_name", "0..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
        ["product", "1..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
    ]);

var author = component.define("author")
    .fields([
    ["date_time", "0..1", "h:time", shared.EffectiveTime],
    ["identifiers", "1..*", "h:assignedAuthor/h:id", shared.Identifier],
    ["organization", "0..1", "h:assignedAuthor/h:representedOrganization", shared.Organization],
    ]);



var MedicationSupplyOrder = component.define("MedicationSupplyOrder")
    .fields([
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["repeatNumber", "0..1", "h:repeatNumber/@value"],
        ["quantity", "0..1", "h:quantity/@value"],
        ["author", "0..1", "h:author", author]
    ]);

var entry = component.define("entry")
    .templateRoot("2.16.840.1.113883.10.20.1.34")
    .fields([
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode/@code"],
        ["sig", "0..1", "h:text", shared.TextWithReference],
        ["product", "1..1", "h:product", MedicationInformation],
        ["supply", "0..1", "../h:supply", MedicationSupplyOrder],
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

var MedActivityRx = entry.define("Prescription")
    .withMood("INT");

var MedActivityHx = entry.define("MedActivityHx")
    .withMood("EVN");    

var medicationsSection = exports.medicationsSection = component.define("medicationsSection");
medicationsSection.templateRoot("2.16.840.1.113883.10.20.1.8");
medicationsSection.fields([
    ["entry", "0..*", MedActivityRx.xpath(), MedActivityRx]
]);
medicationsSection.cleanupStep(cleanup.replaceWithField('entry'));

exports.medicationsEntry = entry;


