"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");
var _ = require("lodash");

var exportSocialHistorySection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

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
            ["value", "0..1", "h:value[@xsi:type='ST']/text() | h:value[@xsi:type='CD']/@displayName"],
            //["observation_value2", "0..1", "h:value[@xsi:type='CD']/@displayName"]
            ["referencedValue", "0..1", "h:value[@xsi:type='ED']", shared.TextWithReference],
            // custom read of nullflavor to replace value field if present
            ["valueNullFlavor", "0..1", "h:value/@nullFlavor"],
            ["nullCodeReplacementText", "0..1", "h:code/h:originalText", shared.TextWithReference]
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
        .cleanupStep(cleanup.replaceAbsentFieldWithNullFlavor("value", "valueNullFlavor"));

    // when other flavors of social history is implemented (pregnancy, social observation, tobacco use)
    // this should probably be structured similar to procedures with types.  if another structure
    // is chosen procedures need to be updated as well.
    var socialHistorySection = component.define("socialHistorySection")
        .templateRoot([sectionIDs.SocialHistorySection, sectionIDs.SocialHistorySectionEntriesOptional])
        .fields([
            ["smoking_statuses", "0..*", socialHistoryObservation.xpath(), socialHistoryObservation]
        ]);
    socialHistorySection.cleanupStep(cleanup.replaceWithField('smoking_statuses'));

    return [socialHistorySection, socialHistoryObservation];
};
exports.socialHistorySection = exportSocialHistorySection;
