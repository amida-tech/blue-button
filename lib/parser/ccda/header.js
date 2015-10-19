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
        ["confidentialityCode", "0..1", "h:confidentialityCode", shared.ConceptDescriptor],
        ["template", "0..1", "h:code", shared.ConceptDescriptor],

        ["author", "0..1", "//h:author", Author],
        ["data_enterer", "0..1", "//h:dataEnterer/h:assignedEntity", shared.assignedEntity],
        ["informant", "0..1", "//h:informant/h:assignedEntity", shared.assignedEntity],

    ]);
