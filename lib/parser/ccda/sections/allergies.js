"use strict";

var shared = require("../shared");
var component = require("../component");
var cleanup = require("../cleanup");

var severityField = ["severity", "0:1",
    "*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.8']/../h:value/@code",
    shared.SimpleCode("2.16.840.1.113883.3.88.12.3221.6.8")
];

var allergyReaction = component.define("allergyReaction");
allergyReaction.templateRoot(["2.16.840.1.113883.10.20.22.4.9"]);
allergyReaction.fields([
    ["reaction", "1..1", "h:value", shared.ConceptDescriptor],
    severityField
]);

var allergenDescriptor = shared.ConceptDescriptor.define('allergenDescriptor');
allergenDescriptor.fields([
        ["name", "0..1", "h:originalText", shared.TextWithReference, 'epic']
    ]);

var allergyObservation = component.define("allergyObservation");
allergyObservation.templateRoot(["2.16.840.1.113883.10.20.22.4.7"]);
allergyObservation.fields([
    ["identifiers", "1..*", "h:id", shared.Identifier],
    ["allergen", "1..1", "h:participant/h:participantRole/h:playingEntity/h:code", allergenDescriptor], // Require (optional in spec)
    severityField, ["status", "0..1", "*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.28']/../h:value/@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.80.68")],
    ["reaction", "0..*", allergyReaction.xpath(), allergyReaction]
]);

var problemAct = component.define('problemAct');
problemAct.templateRoot(['2.16.840.1.113883.10.20.22.4.30']);
problemAct.fields([
    ["date", "1..1", "h:effectiveTime", shared.EffectiveTime],
    ["observation", "1..1", allergyObservation.xpath(), allergyObservation] // Ignore observation cardinality (in spec can be more than 1)
]);
problemAct.cleanupStep(cleanup.extractAllFields(['observation']));

var allergiesSection = exports.allergiesSection = component.define('allergiesSection');
allergiesSection.templateRoot(['2.16.840.1.113883.10.20.22.2.6', '2.16.840.1.113883.10.20.22.2.6.1']);
allergiesSection.fields([
    ["problemAct", "1..*", problemAct.xpath(), problemAct]
]);
allergiesSection.cleanupStep(cleanup.replaceWithField(["problemAct"]));

exports.allergiesEntry = problemAct;