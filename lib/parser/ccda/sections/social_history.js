"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");
var _ = require("lodash");

var exportSocialHistorySection = function (version) {
  var sectionIDs = bbm.CCDA["sections" + version];
  var clinicalStatementsIDs = bbm.CCDA["statements" + version];

  var tobaccoUse = component.define("tobaccoUse")
    .templateRoot([clinicalStatementsIDs.TobaccoUse])
    .fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
      ["value", "0..1", "h:value[@xsi:type='CD']/@displayName"],
      ["history_type", "1..1", "h:templateId/@root"],
    ]);

  // https://hl7.org/ccdasearch/templates/2.16.840.1.113883.10.20.22.4.109.html
  var characteristicsOfHome = component.define("characteristicsOfHome")
    .templateRoot(['2.16.840.1.113883.10.20.22.4.109'])
    .fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["value", "0..1", "h:value[@xsi:type='CD']/@displayName"],
      ["history_type", "1..1", "h:templateId/@root"],
    ]);

  var socialHistoryTemplateIds = [
    clinicalStatementsIDs.SocialHistoryObservation, // the correct templateId (smoking status)
    clinicalStatementsIDs.SmokingStatusObservation,
    "2.16.840.1.113883.10.22.4.78", // incorrect id published in 1.1 DSTU
  ];
  var socialHistoryObservation = component.define("socialHistoryObservation")
    .templateRoot(socialHistoryTemplateIds)
    .fields([
      //["value", "1..1", "h:code[@code!='ASSERTION']/@displayName"],//, shared.SimpleCode("2.16.840.1.113883.11.20.9.38")],
      //["value2", "1..1", "h:code[@code='ASSERTION']/@codeSystem"],//, shared.SimpleCode("2.16.840.1.113883.11.20.9.38")],
      ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["code2", "0..1", "h:code[@code='ASSERTION']/@codeSystem"],
      //["observation_value", "0..1", "h:value/@xsi:type"]
      ["value", "0..1", "h:value[@xsi:type='ST']/text() | h:value[@xsi:type='CD']/@displayName | h:value[@xsi:type='PQ']/@value"],
      //["observation_value2", "0..1", "h:value[@xsi:type='CD']/@displayName"]
      ["referencedValue", "0..1", "h:value[@xsi:type='ED']", shared.TextWithReference],
      ["nullCodeReplacementText", "0..1", "h:code/h:originalText", shared.TextWithReference],
      ["history_type", "1..1", "h:templateId/@root"],
    ])
    .cleanupStep(cleanup.replaceWithObject("code2", {
      "name": "Smoking Status"
    })).cleanupStep(cleanup.renameField("code2", "code"))
    .cleanupStep(cleanup.renameField("referencedValue", "value"))
    // custom step to replace nullFlavored code with text from h:originalText child
    .cleanupStep(function () {
      if (_.has(this, "js.nullCodeReplacementText")) {
        if (_.get(this, "js.code.code_system_name") === "Null Flavor" || !_.has(this, "js.code")) {
          this.js.code = {
            "name": this.js.nullCodeReplacementText
          };
        }
        delete this.js.nullCodeReplacementText;
      }
    })
    // custom step to put null flavor name on value field if present
    .cleanupStep(cleanup.replaceStringFieldWithNullFlavorName("value"));


  function xpathTemplateParent(id) {
    return ".//h:templateId[@root='" + id + "']/..";
  }

  // A subset of the handful of social history entry types are unioned together
  // here just like how it's done in the procedure section.
  var socialHistorySectionUnion = component.define("socialHistorySectionUnion")
  // template idea for socaial history entries smoking status meaingful user
  socialHistorySectionUnion.templateRoot(socialHistoryTemplateIds
    .concat(["2.16.840.1.113883.10.20.22.4.85", "2.16.840.1.113883.10.20.22.4.109"]))
  socialHistorySectionUnion.fields([
    // xpaths update - find template by ID, and go  up /.. a level
    [
      "smoking_statuses",
      "0..1",
      socialHistoryTemplateIds.map(xpathTemplateParent).join(' | '),
      socialHistoryObservation
    ],
    ["tobacco_use", "0..1", xpathTemplateParent("2.16.840.1.113883.10.20.22.4.85"), tobaccoUse],
    ["characteristics_of_home", "0..1", xpathTemplateParent("2.16.840.1.113883.10.20.22.4.109"), characteristicsOfHome]
  ])
  socialHistorySectionUnion.cleanupStep(cleanup.extractAllFields(["smoking_statuses", "tobacco_use", "characteristics_of_home"]));
  socialHistorySectionUnion.cleanupStep(function () {
    if (this.js) {
      var typeMap = socialHistoryTemplateIds.reduce(function(ids, curr) {
        ids[curr] = 'smoking';
        return ids;
      }, {
        "2.16.840.1.113883.10.20.22.4.85": "tobacco",
        "2.16.840.1.113883.10.20.22.4.109": "home"
      });

      var t = this.js['history_type'];
      this.js['history_type'] = typeMap[t];
    }
  });

  var socialHistorySection = component.define("socialHistorySection")
  socialHistorySection.templateRoot([
    sectionIDs.SocialHistorySection,
    // sectionIDs.SocialHistorySectionEntriesOptional
  ]);
  socialHistorySection.fields([
    ["entry", "0..*", socialHistorySectionUnion.xpath(), socialHistorySectionUnion]
  ])

  socialHistorySection.cleanupStep(cleanup.replaceWithField('entry'));
  return [socialHistorySection, socialHistoryObservation];
  // return [socialHistorySectionUnion];
};
exports.socialHistorySection = exportSocialHistorySection;
