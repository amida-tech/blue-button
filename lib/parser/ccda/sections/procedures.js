"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProceduresSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    /*
    var organization = component.define('organization');
    organization.fields([
        ["name", "0:1", "h:name"],
        ["address", "0..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", "h:telecom", shared.Phone],
        ["email", "0..*", "h:telecom", shared.Email]
    ]);

    //replaced with shared.assignedEntity to normalize with performer in other sections
    var provider = component.define('provider');
    provider.fields([
        ["address", "1..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", "h:telecom", shared.Phone],
        ["email", "0..*", "h:telecom", shared.Email],
        ["organization", "0..1", "h:representedOrganization", organization]
    ]);
    */

    var ProcedureSpecimen = component.define('ProcedureSpecimen')
        .fields([
            ["identifiers", "0..*", "h:specimenRole/h:id", shared.Identifier],
            ["code", "0..1", "h:specimenRole/h:specimenPlayingEntity/h:code", shared.ConceptDescriptor]
        ]);

    var entry = component.define('entry');
    entry.templateRoot(['2.16.840.1.113883.10.20.22.4.12', '2.16.840.1.113883.10.20.22.4.13', '2.16.840.1.113883.10.20.22.4.14', clinicalStatementsIDs.ProcedureActivity]);
    entry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode", shared.SimplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["body_sites", "0..*", "h:targetSiteCode", shared.ConceptDescriptor],
        ["specimen", "0..1", "h:specimen", ProcedureSpecimen],
        ["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performer", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ['procedure_type', "1..1", "h:templateId/@root"]
    ]);

    entry.cleanupStep(function () {
        var typeMap = {
            "2.16.840.1.113883.10.20.22.4.12": "act", // ccda
            "2.16.840.1.113883.10.20.22.4.13": "observation",
            "2.16.840.1.113883.10.20.22.4.14": "procedure",
            "2.16.840.1.113883.10.20.1.29": "procedure" // ccda-r1
        };
        var t = this.js['procedure_type'];
        this.js['procedure_type'] = typeMap[t];
    });

    var proceduresSection = component.define('proceduresSection');
    proceduresSection.templateRoot([sectionIDs.ProceduresSection, sectionIDs.ProceduresSectionEntriesOptional]);
    proceduresSection.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    proceduresSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [proceduresSection, entry];
}

exports.proceduresSection = exportProceduresSection;
exports.proceduresEntry = exportProceduresSection;
