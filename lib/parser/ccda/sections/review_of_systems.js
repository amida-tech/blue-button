"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");
var processor = require("@amida-tech/blue-button-xml").processor;


var exportReviewOfSystemsSection= function (version) {
  var sectionIDs = bbm.CCDA["sections" + version];
  var clinicalStatementsIDs = bbm.CCDA["statements" + version];

  var reviewOfSystemsSection = component.define("reviewOfSystems");
  reviewOfSystemsSection.templateRoot([
    sectionIDs.ReviewOfSystemsSection
  ])
  reviewOfSystemsSection.fields([
    ["code", "1..1", "h:code", shared.ConceptDescriptor],
    ["title", "1..1", "h:title", processor.asString],
    ["text", "1..1", "h:text", shared.asString],
  ])

  return [reviewOfSystemsSection];
}

exports.reviewOfSystemsSection = exportReviewOfSystemsSection;