"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");
var _ = require("lodash");

var exportProceduresSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    /*
    var organization = component.define('organization');
    organization.fields([
        ["name", "0:1", "h:name"],
        ["address", "0..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email]
    ]);

    //replaced with shared.assignedEntity to normalize with performer in other sections
    var provider = component.define('provider');
    provider.fields([
        ["address", "1..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["organization", "0..1", "h:representedOrganization", organization]
    ]);
    */

    var ProcedureSpecimen = component.define('ProcedureSpecimen')
        .fields([
            ["identifiers", "0..*", "h:specimenRole/h:id", shared.Identifier],
            ["code", "0..1", "h:specimenRole/h:specimenPlayingEntity/h:code", shared.ConceptDescriptor]
        ]);

    // ..
    var observationEntry = component.define('procedureObservation');
    observationEntry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode", shared.simplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["body_sites", "0..*", "h:targetSiteCode", shared.ConceptDescriptor],
        ["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performers", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ["procedure_type", "1..1", "h:templateId/@root"],
        ["value", "1..1", "h:value", shared.ConceptDescriptor],
    ]);
    observationEntry.cleanupStep(function () {
        if (this.js && _.has(this, "js.value") && _.isEmpty(this.js.value.js)) {
            delete this.js.value;
        }
    });

    var procedureEntry = component.define('procedureProcedure');
    procedureEntry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode", shared.simplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["body_sites", "0..*", "h:targetSiteCode", shared.ConceptDescriptor],
        ["specimen", "0..1", "h:specimen", ProcedureSpecimen],
        // should be
        // ["specimen", "0..*", "h:specimen", ProcedureSpecimen],
        ["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performers", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ["procedure_type", "1..1", "h:templateId/@root"],
    ]);

    var actEntry = component.define('procedureAct');
    actEntry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode", shared.simplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performers", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ["procedure_type", "1..1", "h:templateId/@root"],
    ]);

    var procedureUnion = component.define('procedureUnion');
    procedureUnion.templateRoot(['2.16.840.1.113883.10.20.22.4.12', '2.16.840.1.113883.10.20.22.4.13', '2.16.840.1.113883.10.20.22.4.14', clinicalStatementsIDs.ProcedureActivity]);
    procedureUnion.fields([
        ["actEntry", "0..1", ".//h:templateId[@root='2.16.840.1.113883.10.20.22.4.12']/..", actEntry],
        ["observationEntry", "0..1", ".//h:templateId[@root='2.16.840.1.113883.10.20.22.4.13']/..", observationEntry],
        ["procedureEntry", "0..1", ".//h:templateId[@root='2.16.840.1.113883.10.20.22.4.14']/..", procedureEntry],
    ]);
    procedureUnion.cleanupStep(cleanup.extractAllFields(["actEntry", "observationEntry", "procedureEntry"]));
    procedureUnion.cleanupStep(function () {
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
        ["entry", "0..*", procedureUnion.xpath(), procedureUnion]
    ]);
    proceduresSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [proceduresSection, procedureUnion];
};

exports.proceduresSection = exportProceduresSection;
exports.proceduresEntry = exportProceduresSection;
