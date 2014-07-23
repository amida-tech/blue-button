"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");

var procedure = component.define('procedure');
procedure.fields([
    ["code", "1..1", "h:code", shared.ConceptDescriptor]
]);

var authorization = component.define('authorization');
authorization.fields([
    ["identifiers", "0..1", "h:id", shared.Identifier],
    ["procedure", "1..1", "h:procedure", procedure]
]);

var policy_holder = component.define('policy_holder');
policy_holder.fields([
    ["date_time", "0..1", "h:time", shared.effectiveTime],
    ["performer", "1..1", "h:participantRole", shared.assignedEntity]
]);

var participant = component.define('participant');
participant.fields([
    ["date_time", "0..1", "h:time", shared.effectiveTime],
    ["performer", "1..1", "h:participantRole", shared.assignedEntity]
]);

var guarantor = component.define('guarantor');
guarantor.fields([
    ["performer", "0..1", "h:performer/h:assignedEntity", shared.assignedEntity]
]);

var organization = component.define('organization');
organization.fields([
    ["name", "0:1", "h:name"],
    ["address", "0..1", "h:addr", shared.Address],
    ["identifiers", "1..*", "h:id", shared.Identifier],
    ["phone", "0..*", "h:telecom", shared.Phone],
    ["email", "0..*", "h:telecom[starts-with(@value,'mailto:')]", shared.Email]
]);

var insurance = component.define('insurance');
insurance.fields([
    ["performer", "0..1", "h:performer/h:assignedEntity", shared.assignedEntity]
]);

var policy = component.define('policy');
policy.fields([
    ["identifiers", "1..1", "h:id", shared.Identifier],
    ["code", "1..1", "h:code", shared.ConceptDescriptor],
    ["insurance", "1..1", "h:performer", insurance]
]);

var entry = component.define('entry');
entry.templateRoot(['2.16.840.1.113883.10.20.22.4.60']);
entry.fields([
    ["identifiers", "1..*", "h:id", shared.Identifier],
    ["policy", "1..1", "h:entryRelationship/h:act", policy],
    ["guarantor", "1..1", "h:performer", guarantor],
    ["participant", "1..1", "h:participant", participant],
    ["policy_holder", "1..1", "h:participant", policy_holder],
    ["authorization", "1..1", "h:entryRelationship/h:act", authorization]
]);

var payers_section = exports.payers_section = component.define('payers_section');
payers_section.templateRoot(['2.16.840.1.113883.10.20.22.2.18']);
payers_section.fields([
    ["entry", "0..*", entry.xpath(), entry]
]);
payers_section.cleanupStep(cleanup.replaceWithField('entry'));

exports.payers_entry = entry;
