"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProvidersSection = function (version) {

    var providers = component.define("providers")
        .templateRoot(["2.16.840.1.113883.5.90"])
        .fields([
            ["date_time", "0..1", "h:time", shared.EffectiveTime],
            ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
            ["type", "0..1", "h:assignedEntity/h:code", shared.ConceptDescriptor],
            ["role", "0..1", "h:functionCode/h:code", shared.ConceptDescriptor],
            ["name", "0..1", "h:assignedEntity/h:assignedPerson/h:name", shared.IndividualName],
            ["addresses", "0..*", "h:assignedEntity/h:addr", shared.Address],
            ["phone", "0..*", "h:assignedEntity/h:telecom", shared.phone],
            ["email", "0..*", "h:assignedEntity/h:telecom", shared.email],
            ["organization", "0..1", "h:assignedEntity/h:representedOrganization", shared.Organization]
        ]);

    return [providers]
}

exports.providersSection = exportProvidersSection;
