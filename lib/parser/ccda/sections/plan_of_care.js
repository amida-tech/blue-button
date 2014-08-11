"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportPlanOfCareSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var date_time = component.define('date_time');
    date_time.fields([
        ["point", "1..1", "h:effectiveTime", shared.EffectiveTime]
    ]);

    var entry = component.define('entry');
    // observation, act, encounter, procedure
    entry.templateRoot(['2.16.840.1.113883.10.20.22.4.44',
        '2.16.840.1.113883.10.20.22.4.39',
        '2.16.840.1.113883.10.20.22.4.40',
        '2.16.840.1.113883.10.20.22.4.41',
        clinicalStatementsIDs.PlanOfCareActivity
    ]);
    entry.fields([
        ["plan", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ['type', "1..1", "h:templateId/@root"]
    ]);

    entry.cleanupStep(function () {
        var typeMap = {
            "2.16.840.1.113883.10.20.22.4.44": "observation", // ccda
            "2.16.840.1.113883.10.20.22.4.39": "act",
            "2.16.840.1.113883.10.20.22.4.40": "encounter",
            "2.16.840.1.113883.10.20.22.4.41": "procedure",
            "2.16.840.1.113883.10.20.1.25": "observation", // ccda-r1
            "2.16.840.1.113883.3.62.3.16.1": "act"
        };
        var t = this.js['type'];
        this.js['type'] = typeMap[t];
    });

    var plan_of_care_section = component.define('plan_of_care_section');
    plan_of_care_section.templateRoot([sectionIDs.PlanOfCareSection, sectionIDs.PlanOfCareSectionEntriesOptional]);
    plan_of_care_section.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    plan_of_care_section.cleanupStep(cleanup.replaceWithField('entry'));

    return [plan_of_care_section, entry];
}

exports.plan_of_care_section = exportPlanOfCareSection;
exports.plan_of_care_entry = exportPlanOfCareSection;
