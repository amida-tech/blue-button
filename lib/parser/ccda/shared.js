"use strict";

var component = require("blue-button-xml").component;
var processor = require("blue-button-xml").processor;
var cleanup = require("./cleanup");
var common = require("blue-button-xml").common;

var commonShared = require('../common/shared');

var shared = module.exports = Object.create(commonShared);

var TextWithReference = shared.TextWithReference = component.define("TextWithReference");
TextWithReference.fields([
        ["text", "0..*", "text()"],
        ["reference", "0..1", "./h:reference/@value"],
    ])
    .cleanupStep(cleanup.resolveReference);

var NegationIndicator = shared.NegationIndicator = component.define("NegationIndicator");
NegationIndicator.fields([
        ["negation_indicator", "0..1", "@negationInd", processor.asBoolean]
    ]).cleanupStep(function () {
        //Flag missing negations as false.
        if (this.js) {
            if (!common.exists(this.js)) {
                this.js.negation_indicator = false;
            }
            if (this.js.negation_indicator === 'true') {
                this.js.negation_indicator = true;
            }
        }
    })
    .cleanupStep(cleanup.replaceWithField('negation_indicator'));

var conceptWoutTranslation = component.define("conceptWoutTranslation");
conceptWoutTranslation.fields([
    ["name", "0..1", "@displayName"],
    ["code", "1..1", "@code"],
    ["system", "1..1", "@codeSystem"],
    ["code_system_name", "0..1", "@codeSystemName"],
    ["nullFlavor", "0..1", "@nullFlavor"],
    ["original_text", "0..1", "h:originalText", TextWithReference]
]);
conceptWoutTranslation.cleanupStep(cleanup.augmentConcept);
conceptWoutTranslation.cleanupStep(cleanup.removeField('system'));

var ConceptDescriptor = shared.ConceptDescriptor = conceptWoutTranslation.define("ConceptDescriptor");
ConceptDescriptor.fields([
    ["translations", "0..*", "h:translation", conceptWoutTranslation],
]);

var AgeDescriptor = shared.AgeDescriptor = component.define("AgeDescriptor");
AgeDescriptor.fields([
        ["units", "0..1", "@unit"],
    ])
    .cleanupStep(cleanup.augmentAge);

var SimplifiedCode = shared.SimplifiedCode = ConceptDescriptor.define("SimpifiedCode")
    .cleanupStep(cleanup.augmentSimplifiedCode);

var PhysicalQuantity = shared.PhysicalQuantity = component.define("PhysicalQuantity")
    .fields([
        ["value", "1..1", "@value", processor.asFloat],
        ["unit", "0..1", "@unit"]
    ]);

var XsiTypedValue = shared.XsiTypedValue = component.define("XsiTypedValue");
XsiTypedValue.fields([
    ["type", "1..1", "@xsi:type"],
    ["physicalQuantityValue", "0..1", "./node()", PhysicalQuantity],
    ["textValue", "0..1", "./text()"],
    ["codeValue", "0..1", "./node()", ConceptDescriptor]
]);
XsiTypedValue.cleanupStep(cleanup.selectValueFields);

var EventOffset = shared.EventOffset = component.define("EventOffset")
    .fields([
        ["low", "0..1", "h:low", PhysicalQuantity],
        ["high", "0..1", "h:high", PhysicalQuantity],
        ["center", "0..1", "h:center", PhysicalQuantity],
        ["width", "0..1", "h:width", PhysicalQuantity],
    ]);

var EffectiveTime = shared.EffectiveTime = component.define("EffectiveTime")
    .fields([
        ["point", "0..1", "@value", processor.asTimestamp],
        ["point_resolution", "0..1", "@value", processor.asTimestampResolution],
        ["low", "0..1", "h:low/@value", processor.asTimestamp],
        ["low_resolution", "0..1", "h:low/@value", processor.asTimestampResolution],
        ["high", "0..1", "h:high/@value", processor.asTimestamp],
        ["high_resolution", "0..1", "h:high/@value", processor.asTimestampResolution],
        ["center", "0..1", "h:center/@value", processor.asTimestamp],
        ["center_resolution", "0..1", "h:center/@value", processor.asTimestampResolution]
    ])
    .cleanupStep(cleanup.augmentEffectiveTime);

var IndividualName = shared.IndividualName = component.define('IndividualName')
    .fields([
        ["prefix", "0..1", "h:prefix/text()"],
        ["middle", "0..*", "h:given/text()"],
        ["last", "0..1", "h:family/text()"],
        ["suffix", "0..1", "h:suffix/text()"],
        ["freetext_name", "0..1", "../h:name/text()", processor.asString]
    ]).cleanupStep(cleanup.augmentIndividualName);

var Address = shared.Address = component.define("Address")
    .fields([
        ["street_lines", "1..4", "h:streetAddressLine/text()"],
        ["city", "1..1", "h:city/text()", processor.asString],
        ["state", "0..1", "h:state/text()"],
        ["zip", "0..1", "h:postalCode/text()"],
        ["country", "0..1", "h:country/text()"],
        ["use", "0..1", "@use", shared.SimpleCode("2.16.840.1.113883.5.1119")]
    ]);

var Organization = shared.Organization = component.define("Organization")
    .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["name", "0..*", "h:name/text()"],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["phone", "0..*", shared.phone.xpath(), shared.phone]
    ]);

var assignedEntity = shared.assignedEntity = component.define("assignedEntity")
    .fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["name", "0..*", "h:assignedPerson/h:name", IndividualName],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["organization", "0..*", "h:representedOrganization", Organization],
        ["code", "0..*", "h:code", ConceptDescriptor],
    ]);

shared.serviceDeliveryLocation = component.define('serviceDeliveryLocation')
    .fields([
        ["name", "0:1", "h:playingEntity/h:name/text()"],
        ["location_type", "1..1", "h:code", ConceptDescriptor],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["phone", "0..*", shared.phone.xpath(), shared.phone]
    ]);
