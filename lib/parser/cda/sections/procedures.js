"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProceduresSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var entry = component.define('entry');
    entry.templateRoot(["2.16.840.1.113883.10.20.1.29"]);
    entry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode", shared.SimplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["body_sites", "0..*", "h:targetSiteCode", shared.ConceptDescriptor],

        //Doesn't appear in sample data.
        //["specimen", "0..1", "h:specimen", ProcedureSpecimen],
        //Doesn't appear in sample data.
        //["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performer", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        //Doesn't appear in sample data.
        //["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ['procedure_type', "1..1", "h:templateId/@root"]
    ]);

    entry.cleanupStep(function () {
        var typeMap = {
            "2.16.840.1.113883.3.88.11.83.17": "procedure" // ccda-r1
        };
        var t = this.js['procedure_type'];
        this.js['procedure_type'] = typeMap[t];
    });

    var proceduresSection = component.define('proceduresSection');
    proceduresSection.templateRoot(["2.16.840.1.113883.10.20.1.12"]);
    proceduresSection.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    proceduresSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [proceduresSection, entry];
}

exports.proceduresSection = exportProceduresSection;
exports.proceduresEntry = exportProceduresSection;
