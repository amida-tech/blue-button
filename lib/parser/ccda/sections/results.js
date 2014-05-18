"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");

var ResultObservation = component.define("ResultObservation")
    .templateRoot("2.16.840.1.113883.10.20.22.4.2")
    .fields([
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["resultName", "1..1", "h:code", shared.ConceptDescriptor],
        ["date", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
        //["codedValue", "0..1", "h:value[@xsi:type='CD']", shared.ConceptDescriptor],
        ["freeTextValue", "0..1", "h:text", shared.TextWithReference],
        ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
    ]);
ResultObservation.cleanupStep(cleanup.extractAllFields(['resultName']));

// TODO: Accomodating both PQ and CD values needed
ResultObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));
//ResultObservation.cleanupStep(cleanup.extractAllFields(['codedValue']));


var ResultsOrganizer = component.define("ResultsOrganizer")
    .templateRoot("2.16.840.1.113883.10.20.22.4.1")
    .fields([
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["panelName", "0..1", "h:code", shared.ConceptDescriptor],
        ["results", "1..*", ResultObservation.xpath(), ResultObservation]
    ]);
ResultsOrganizer.cleanupStep(cleanup.extractAllFields(['panelName']));

var resultsSection = exports.resultsSection = component.define("resultsSection");
resultsSection.templateRoot(['2.16.840.1.113883.10.20.22.2.3', '2.16.840.1.113883.10.20.22.2.3.1']); // .1 for "entries required"
resultsSection.fields([
    ["panels", "0..*", ResultsOrganizer.xpath(), ResultsOrganizer]
]);
resultsSection.cleanupStep(cleanup.replaceWithField('panels'));
