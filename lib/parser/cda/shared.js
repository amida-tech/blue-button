"use strict";

var component = require("blue-button-xml").component;
var processor = require("blue-button-xml").processor;
var cleanup = require("./cleanup");
var common = require("blue-button-xml").common;

var shared = module.exports = {}

var Identifier = shared.Identifier = component.define("Identifier")
    .fields([
        ["identifier", "1..1", "@root"],
        ["extension", "0..1", "@extension"],
    ]);

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
        } else {
            this.js = {
                negation_indicator: false
            };
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

var SimpleCode = shared.SimpleCode = function (oid) {
    var r = component.define("SimpleCode." + oid);
    r.fields([]);
    r.cleanupStep(cleanup.augmentSimpleCode(oid));
    return r;
};

var SimplifiedCode = shared.SimplifiedCode = ConceptDescriptor.define("SimpifiedCode")
    .cleanupStep(cleanup.augmentSimplifiedCode);

var SimplifiedCodeOID = shared.SimplifiedCodeOID = function (oid) {
    var r = ConceptDescriptor.define("SC " + oid);
    r.cleanupStep(cleanup.augmentSimplifiedCodeOID(oid));
    return r;
};

var PhysicalQuantity = shared.PhysicalQuantity = component.define("PhysicalQuantity")
    .fields([
        ["value", "1..1", "@value", processor.asFloat],
        ["unit", "0..1", "@unit"]
    ]);

var EventOffset = shared.EventOffset = component.define("EventOffset")
    .fields([
        ["low", "0..1", "h:/low", PhysicalQuantity],
        ["high", "0..1", "h:/high", PhysicalQuantity],
        ["center", "0..1", "h:/center", PhysicalQuantity],
        ["width", "0..1", "h:/width", PhysicalQuantity],
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
        ["prefix", "0..1", "h:prefix"],
        ["middle", "0..*", "h:given"],
        ["last", "0..1", "h:family"],
        ["suffix", "0..1", "h:suffix"],
        ["freetext_name", "0..1", "../h:name", processor.asString]
    ]).cleanupStep(cleanup.augmentIndividualName);

var Address = shared.Address = component.define("Address")
    .fields([
        ["street_lines", "1..4", "h:streetAddressLine/text()"],
        ["city", "1..1", "h:city/text()", processor.asString],
        ["state", "0..1", "h:state/text()"],
        ["zip", "0..1", "h:postalCode/text()"],
        ["country", "0..1", "h:country/text()"],
        ["use", "0..1", "@use", SimpleCode("2.16.840.1.113883.5.1119")]
    ]);

var Email = shared.Email = component.define("Email")
    .fields([
        ["address", "1..1", "@value"],
        ["type", "0..1", "@use", SimpleCode("2.16.840.1.113883.5.1119")]
    ]).cleanupStep(function () {
        if (this.js && this.js.address) {
            if (this.js.address.substring(0, 7) === "mailto:") {
                this.js.address = this.js.address.substring(7);
                //NOTE: type for email should be empty (per PragueExpat)
                if (this.js.type) {
                    this.js.type = '';
                }
            } else {
                this.js = {};
            }
        }

        if (!this.js.number) {
            this.js = {};
        }
    }).cleanupStep(cleanup.clearNulls);

var Phone = shared.Phone = component.define("Phone")
    .fields([
        ["number", "1..1", "@value"],
        ["type", "0..1", "@use", SimpleCode("2.16.840.1.113883.5.1119")]
    ]).cleanupStep(function () {
        if (this.js && this.js.number) {
            if (this.js.number.substring(0, 4) === "tel:") {
                this.js.number = this.js.number.substring(4);
            }
            //Remove emails as phone numbers.
            if (this.js.number.substring(0, 7) === "mailto:") {
                this.js = {};
            }
        }

        if (!this.js.number) {
            this.js = {};
        }

    }).cleanupStep(cleanup.clearNulls);

var Organization = shared.Organization = component.define("Organization")
    .fields([
        ["identifiers", "0..*", "h:id", Identifier],
        ["name", "0..*", "h:name"],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", "h:telecom", Email],
        ["phone", "0..*", "h:telecom", Phone]
    ]);

var assignedEntity = shared.assignedEntity = component.define("assignedEntity")
    .fields([
        ["identifiers", "0..*", "h:id", Identifier],
        ["name", "0..*", "h:assignedPerson/h:name", IndividualName],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", "h:telecom", Email],
        ["phone", "0..*", "h:telecom", Phone],
        ["organization", "0..*", "h:representedOrganization", Organization],
        ["code", "0..*", "h:code", ConceptDescriptor],
    ]);
/* shimmed because it;'s pretty much the same as assignedEntity above. '
var Provider = shared.Provider = component.define('Provider')
    .fields([
        ["address", "1..1", "h:addr", Address],
        ["identifiers", "1..*", "h:id", Identifier],
        ["phone", "0..*", "h:telecom", Phone],
        ["email", "0..*", "h:telecom", Email],
        ["organization", "0..1", "h:representedOrganization", Organization]
    ]);
*/
shared.serviceDeliveryLocation = component.define('serviceDeliveryLocation')
    .fields([
        ["name", "0:1", "h:playingEntity/h:name"],
        ["location_type", "1..1", "h:code", ConceptDescriptor],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", "h:telecom", Email],
        ["phone", "0..*", "h:telecom", Phone]
    ]);
