"use strict";

var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");
var bbm = require("@amida-tech/blue-button-meta");
var _ = require("lodash");


var stupidCleanup = function (flist) { // We need cleanup function to become objects
  var r = function () {
    flist.forEach(function (k) {
      var tmp;
     
      if (this.js !== undefined && this.js !== null) {
        // console.log( this.js[k]);
        tmp = this.js[k];
        delete this.js[k];
      }
      if (tmp) { //HACK: added this if
        if (tmp.js) {
          Object.keys(tmp.js).forEach(function (m) {
            if (this.js[m] === undefined) {
              this.js[m] = tmp.js[m];
            }
          }, this);
        }
      }
    }, this);
  };
  return r;
};


var exportSocialHistorySection = function (version) {
  var sectionIDs = bbm.CCDA["sections" + version];
  var clinicalStatementsIDs = bbm.CCDA["statements" + version];

  var tobaccoUse = component.define("tobaccoUse")
    .templateRoot([clinicalStatementsIDs.TobaccoUse])
    .fields([
      ["identifiers", "0..*", "h:id", shared.Identifier],
      ["code", "0..1", "h:code", shared.ConceptDescriptor],
      ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
      ["value", "0..1", "h:value[@xsi:type='CD']/text()"],
      ["history_type", "1..1", "h:templateId/@root"],
    ])

  var socialHistoryObservation = component.define("socialHistoryObservation")
    .templateRoot([
      clinicalStatementsIDs.SocialHistoryObservation, // the correct templateId (smoking status)
      clinicalStatementsIDs.SmokingStatusObservation,
      "2.16.840.1.113883.10.22.4.78", // incorrect id published in 1.1 DSTU
    ])
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
  

  var socialHistorySectionUnion = component.define("socialHistorySectionUnion")
  // template idea for socaial history entries smoking status meaingful user
  socialHistorySectionUnion.templateRoot(["2.16.840.1.113883.10.20.22.4.78", "2.16.840.1.113883.10.20.22.4.85"])
  socialHistorySectionUnion.fields([
    // xpaths update - find template by ID, and go  up /.. a level
    ["smoking_statuses", "0..1", ".//h:templateId[@root='2.16.840.1.113883.10.20.22.4.78,']/..", socialHistoryObservation],
    ["tobacco_use", "0..1", ".//h:templateId[@root='2.16.840.1.113883.10.20.22.4.85']/..", tobaccoUse],
  ])
  // socialHistorySectionUnion.cleanupStep(cleanup.replaceWithField("smoking_statuses"));
  // socialHistorySectionUnion.cleanupStep(cleanup.extractAllFields(["smoking_statuses", "tobacco_use"]));
  socialHistorySectionUnion.cleanupStep(stupidCleanup(["smoking_statuses", "tobacco_use"]));
  socialHistorySectionUnion.cleanupStep(function () {
    if (this.js) {
      var typeMap = {
        "2.16.840.1.113883.10.20.22.4.78": "smoking",
        // [sectionIDs.SocialHistorySectionEntriesOptional]: "smoking",
        "2.16.840.1.113883.10.20.22.4.85": "tobacco",
      };
      var t = this.js['history_type'];
      this.js['history_type'] = typeMap[t];
    }
  });
  // when other flavors of social history is implemented (pregnancy, social observation, tobacco use)
  // this should probably be structured similar to procedures with types.  if another structure
  // is chosen procedures need to be updated as well.
  var socialHistorySection = component.define("socialHistorySection")
    socialHistorySection.templateRoot([
      sectionIDs.SocialHistorySection,
      // sectionIDs.SocialHistorySectionEntriesOptional
    ]);
    socialHistorySection.fields([
      ["entry", "0..*", socialHistorySectionUnion.xpath(), socialHistorySectionUnion]
    ])
  return [socialHistorySection, socialHistoryObservation];
};
exports.socialHistorySection = exportSocialHistorySection;
