"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportVitalSignsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var VitalSignObservation = component.define("VitalSignObservation")
        .templateRoot(clinicalStatementsIDs.VitalSignObservation)
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier], //this one is stripped out by "paredown" cleanup step in component.js
            ["vital", "1..1", "h:code", shared.ConceptDescriptor],
            //["identifiers","0..*", "h:id", shared.Identifier], //dup with first line
            ["status", "1..1", "h:statusCode/@code"],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
            //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
            ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
        ]);
    //VitalSignObservation.cleanupStep(cleanup.extractAllFields(['code']));
    VitalSignObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));

    var vitalSignsSection = component.define("vitalSignsSection");
    vitalSignsSection.templateRoot([sectionIDs.VitalSignsSection, sectionIDs.VitalSignsSectionEntriesOptional]);
    vitalSignsSection.fields([
        ["entry", "0..*", VitalSignObservation.xpath(), VitalSignObservation]
    ]);
    vitalSignsSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [vitalSignsSection, VitalSignObservation];
}

// var VitalSignObservation = component.define("VitalSignObservation")
//     .templateRoot(clinicalStatementsIDs.VitalSignObservation)
//     .fields([
//         ["identifiers", "0..*", "h:id", shared.Identifier], //this one is stripped out by "paredown" cleanup step in component.js
//         ["vital", "1..1", "h:code", shared.ConceptDescriptor],
//         //["identifiers","1..*", "h:id", shared.Identifier], //dup with first line
//         ["status", "1..1", "h:statusCode/@code"],
//         ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
//         ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
//         //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
//         ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
//     ]);
//   //VitalSignObservation.cleanupStep(cleanup.extractAllFields(['code']));
//   VitalSignObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));

/*
  //Vitals organizer is not used (flattened out in JSON model)
  var VitalSignsOrganizer = component.define("VitalSignsOrganizer")
  .templateRoot("2.16.840.1.113883.10.20.22.4.26")
  .fields([
    ["panelName","0..1", "h:code", shared.ConceptDescriptor],
    ["sourceIds","1..*", "h:id", shared.Identifier],
    ["vitals", "1..*", VitalSignObservation.xpath(), VitalSignObservation]
  ]);
  
  
  exports.VitalSignsSection = Component.define("VitalSignsSection")
  .templateRoot("2.16.840.1.113883.10.20.22.2.4.1")
  .fields([
    //["name","0..1", "h:code", shared.ConceptDescriptor],
    //["panels","0..*", VitalSignsOrganizer.xpath(), VitalSignsOrganizer],
    ["vitals","0..*", VitalSignObservation.xpath(), VitalSignObservation],
  ]);
  */

exports.vitalSignsSection = exportVitalSignsSection;

exports.vitalSignsEntry = exportVitalSignsSection;
