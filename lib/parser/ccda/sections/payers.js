"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportPayersSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var procedure = component.define('procedure');
    procedure.fields([
        ["code", "1..1", "h:code", shared.ConceptDescriptor]
    ]);

    var authorization = component.define('authorization');
    authorization.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["procedure", "1..1", "h:entryRelationship/h:procedure", procedure]
    ]);

    var policy_holder = component.define('policy_holder');
    policy_holder.fields([
        ["performer", "1..1", "h:participantRole", shared.assignedEntity]
    ]);

    var participant = component.define('participant');
    participant.fields([
        ["date_time", "0..1", "h:time", shared.EffectiveTime],
        ["code", "1..1", "h:participantRole/h:code", shared.ConceptDescriptor],
        ["performer", "1..1", "h:participantRole", shared.assignedEntity],
        ["name", "0..*", "h:participantRole/h:playingEntity/h:name", shared.IndividualName]
    ]);

    var guarantor = component.define('guarantor');
    guarantor.fields([
        ["code", "1..1", "../h:assignedEntity/h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "../h:assignedEntity/h:id", shared.Identifier],
        ["name", "0..*", "../h:assignedEntity/h:assignedPerson/h:name", shared.IndividualName],
        ["address", "0..*", "../h:assignedEntity/h:addr", shared.Address],
        ["email", "0..*", "../h:assignedEntity/h:telecom", shared.Email],
        ["phone", "0..*", "../h:assignedEntity/h:telecom", shared.Phone]
    ]);

    var organization = component.define('organization');
    organization.fields([
        ["address", "0..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", "h:telecom", shared.Phone],
        ["email", "0..*", "h:telecom[starts-with(@value,'mailto:')]", shared.Email]
    ]);

    var insurance = component.define('insurance');
    insurance.fields([
        ["code", "1..1", "h:assignedEntity/h:code", shared.ConceptDescriptor],
        ["performer", "0..1", "h:assignedEntity", shared.assignedEntity]
    ]);

    var policy = component.define('policy');
    policy.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["code", "1..1", "h:code", shared.ConceptDescriptor],
        ["insurance", "1..1", "h:performer", insurance]
    ]);

    var entry = component.define('entry');
    entry.templateRoot([clinicalStatementsIDs.CoverageActivity]);
    entry.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["policy", "1..1", "h:entryRelationship/h:act", policy],
        ["guarantor", "1..1", "h:entryRelationship/h:act/h:performer/h:templateId[not (@root='2.16.840.1.113883.10.20.22.4.87')]", guarantor],
        ["participant", "1..1", "h:entryRelationship/h:act/h:participant", participant],
        ["policy_holder", "1..1", "h:entryRelationship/h:act/h:participant[not (@typeCode='COV')]", policy_holder],
        ["authorization", "1..1", "h:entryRelationship/h:act/h:entryRelationship/h:act", authorization]
    ]);

    var payers_section = component.define('payers_section');
    payers_section.templateRoot([sectionIDs.PayersSection, sectionIDs.PayersSectionEntriesOptional]);
    payers_section.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    payers_section.cleanupStep(cleanup.replaceWithField('entry'));

    return [payers_section, entry];
}

exports.payers_section = exportPayersSection;
exports.payers_entry = exportPayersSection;
