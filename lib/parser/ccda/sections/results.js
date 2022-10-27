"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");

var exportResultsSection = function (version) {
  var clinicalStatementsIDs = bbm.CCDA["statements" + version];
  var sectionIDs = bbm.CCDA["sections" + version];

  var author = component.define("author")
    .fields([
      ["date_time", "0..1", "h:time", shared.EffectiveTime],
      ["identifiers", "0..*", "h:assignedAuthor/h:id", shared.Identifier],
      ["name", "0..1",
        "h:assignedAuthor/h:assignedPerson/h:name", shared.IndividualName
      ],
      ["organization", "0..1",
        "h:assignedAuthor/h:representedOrganization", shared.Organization
      ]
    ]);

  var referenceRangeValue = component.define('referenceRangeValue')
    .fields([
      ["standard_value", "0..1", ".", shared.ConceptDescriptor],
      ["interpretation", "0..1", "../h:interpretationCode/@code"]
    ])
    .cleanupStep(cleanup.extractAllFields(["standard_value"]));

  var referenceRange = component.define('referenceRange')
    .fields([
      ["low", "0..1", "h:value/h:low/@value"],
      ["high", "0..1", "h:value/h:high/@value"],
      ["unit", "0..1", "h:value/h:low/@unit"],
      ["range", "0..1", "h:text/text()"],
      ["value", "0..1", "h:value[@xsi:type='CO']", referenceRangeValue]
    ]);

  var ResultObservation = component.define("ResultObservation")
    .templateRoot(clinicalStatementsIDs["ResultObservation"])
    .fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["result", "1..1", "h:code", shared.ConceptDescriptor],
      ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
      ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
      ["status", "1..1", "h:statusCode/@code"],
      ["text", "0..1", "h:value[@xsi:type='ST'] | h:value[@xsi:type='ED']", shared.TextWithReference],
      ["codedOrdinalText", "0..1", "h:value[@xsi:type='CO']/@displayName"],
      ["reference_range", "0..1", "h:referenceRange/h:observationRange", referenceRange],
      //["codedValue", "0..1", "h:value[@xsi:type='CD']", shared.ConceptDescriptor],
      //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
      ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.ConceptDescriptor],
    ]);
  ResultObservation.cleanupStep(cleanup.replaceStringFieldWithNullFlavorName("text"));
  //ResultObservation.cleanupStep(cleanup.extractAllFields(['resultName']));
  ResultObservation.cleanupStep(cleanup.renameField("codedOrdinalText", "text"));

  // TODO: Accomodating both PQ and CD values needed
  ResultObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));
  //ResultObservation.cleanupStep(cleanup.extractAllFields(['codedValue']));

  var ResultsOrganizer = component.define("ResultsOrganizer")
    .templateRoot(clinicalStatementsIDs["ResultOrganizer"])
    .fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["result_set", "0..1", "h:code", shared.ConceptDescriptor],
      ["results", "1..*", ResultObservation.xpath(), ResultObservation],
      ["author", "0..1", "h:author", author]
    ]);
  //ResultsOrganizer.cleanupStep(cleanup.extractAllFields(['panelName']));

  var resultsSection = component.define("resultsSection");
  resultsSection.templateRoot([sectionIDs.ResultsSection, sectionIDs.ResultsSectionEntriesOptional]); // .1 for "entries required"
  resultsSection.fields([
    ["panels", "0..*", ResultsOrganizer.xpath(), ResultsOrganizer]
  ]);
  resultsSection.cleanupStep(cleanup.replaceWithField('panels'));

  return [resultsSection, ResultsOrganizer];
};

exports.resultsSection = exportResultsSection;
exports.resultsEntry = exportResultsSection;
