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

var MedicationAdministration = component.define("MedicationAdministration")
    .fields([
        ["dose", "0..1", "h:quantity", shared.PhysicalQuantity],
        ["author", "0..1", "h:author", author],
    ]);

var entry = component.define("entry")
    .templateRoot("2.16.840.1.113883.10.20.1.34")
    .fields([
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode"],
        ["sig", "0..1", "h:text", shared.TextWithReference],
        ["product", "1..1", "h:product", MedicationInformation],
        ["administration", "0..1", "../h:supply", MedicationAdministration],
    ]);

var medicationsSection = exports.medicationsSection = component.define("medicationsSection");
medicationsSection.templateRoot("2.16.840.1.113883.10.20.1.8");
medicationsSection.fields([
    ["entry", "0..*", entry.xpath(), entry]
]);
medicationsSection.cleanupStep(cleanup.replaceWithField('entry'));

exports.medicationsEntry = entry;


