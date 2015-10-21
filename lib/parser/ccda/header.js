"use strict";

var shared = require('./shared');
var processor = require("blue-button-xml").processor;
var component = require("blue-button-xml").component;

var Author = component.define("Author")
    .fields([
        ["author", "0..*", "h:assignedAuthor", shared.assignedEntity],
        ["date_time", "1..1", "h:time", shared.EffectiveTime],
    ]);

exports.header = component.define("Header")
    .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["confidentiality_code", "0..1", "h:confidentialityCode", shared.ConceptDescriptor],
        ["template", "0..1", "h:code", shared.ConceptDescriptor],
        ["title", "0..1", "h:title", processor.asString],
        //timestamp

        ["author", "0..1", "//h:author", Author],
        ["data_enterer", "0..1", "//h:dataEnterer/h:assignedEntity", shared.assignedEntity],
        ["informant", "0..1", "//h:informant/h:assignedEntity", shared.assignedEntity]

        //["custodian", "0..1", "//h:informant/h:assignedEntity", shared.assignedEntity],
        //["service_event", "0..1", "//h:serviceEvent", shared.assignedEntity],
        //service event performer

    ]);
