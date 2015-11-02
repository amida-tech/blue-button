"use strict";

var shared = require('./shared');
var processor = require("blue-button-xml").processor;
var component = require("blue-button-xml").component;

var Author = component.define("Author")
    .fields([
        ["author", "0..*", "h:assignedAuthor", shared.assignedEntity],
        ["date_time", "1..1", "h:time", shared.EffectiveTime],
    ]);

var Performer = component.define("Performer")
    .fields([
        ["performer", "0..*", "h:assignedEntity", shared.assignedEntity],
        ["code", "0..1", "h:functionCode", shared.ConceptDescriptor],
    ]);

var ServiceEvent = component.define("ServiceEvent")
    .fields([
        ["code", "0..1", "h:code", shared.ConceptDescriptor],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["performer", "0..*", "h:performer", Performer],
    ]);

exports.header = component.define("Header")
    .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["confidentiality_code", "0..1", "h:confidentialityCode", shared.ConceptDescriptor],
        ["code", "0..1", "h:code", shared.ConceptDescriptor],
        ["template", "0..*", "h:templateId/@root", processor.asString],
        ["title", "0..1", "h:title", processor.asString],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],

        ["author", "0..1", "//h:author", Author],
        ["data_enterer", "0..1", "//h:dataEnterer/h:assignedEntity", shared.assignedEntity],
        ["informant", "0..1", "//h:informant/h:assignedEntity", shared.assignedEntity],

        ["custodian", "0..1", "//h:representedCustodianOrganization", shared.Organization],

        ["service_event", "0..1", "//h:documentationOf/h:serviceEvent", ServiceEvent]

    ]);
