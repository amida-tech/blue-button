"use strict";

var Component = require("./component");
var Processor = require('./processor');
var Cleanup = require("./cleanup");
var common = require("./common");

var Identifier = exports.Identifier = Component.define("Identifier")
    .fields([
        ["identifier", "1..1", "@root"],
        ["extension", "0..1", "@extension"],
    ]);

var TextWithReference = exports.TextWithReference = Component.define("TextWithReference");
TextWithReference.fields([
    ["text", "0..*", "text()"],
    ["reference", "0..1", "./h:reference/@value"],
])
    .cleanupStep(Cleanup.resolveReference);

var NegationIndicator = exports.NegationIndicator = Component.define("NegationIndicator");
NegationIndicator.fields([
    ["negation_indicator", "0..1", "@negationInd", Processor.asBoolean]
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
    .cleanupStep(Cleanup.replaceWithField('negation_indicator'));

var conceptWoutTranslation = Component.define("conceptWoutTranslation");
conceptWoutTranslation.fields([
    ["name", "0..1", "@displayName"],
    ["code", "1..1", "@code"],
    ["system", "1..1", "@codeSystem"],
    ["code_system_name", "0..1", "@codeSystemName"],
    ["nullFlavor", "0..1", "@nullFlavor"],
]);
conceptWoutTranslation.cleanupStep(Cleanup.augmentConcept);
conceptWoutTranslation.cleanupStep(Cleanup.removeField('system'));

var ConceptDescriptor = exports.ConceptDescriptor = conceptWoutTranslation.define("ConceptDescriptor");
ConceptDescriptor.fields([
    ["translations", "0..*", "h:translation", conceptWoutTranslation],
]);

var AgeDescriptor = exports.AgeDescriptor = Component.define("AgeDescriptor");
AgeDescriptor.fields([
    ["units", "0..1", "@unit"],
])
    .cleanupStep(Cleanup.augmentAge);

var SimpleCode = exports.SimpleCode = function (oid) {
    var r = Component.define("SimpleCode." + oid);
    r.fields([]);
    r.cleanupStep(Cleanup.augmentSimpleCode(oid));
    return r;
};

var augmentSimplifiedCode = function () {
    if (this.js) {
        // TODO: look up; don't trust the name to be present...
        this.js = this.js.name;
    }
};

var SimplifiedCode = exports.SimplifiedCode = ConceptDescriptor.define("SimpifiedCode")
    .cleanupStep(augmentSimplifiedCode);

var augmentSimplifiedCodeOID = function (oid) {
    var f = function () {
        if (this.js) {
            if (this.js.name) {
                this.js = this.js.name;
            } else if (this.js.code) {
                var name = OIDs[oid].table[this.js.code];
                if (name) this.js = name;
            } else {
                this.js = null;
            }
        }
    };
    return f;
}

var SimplifiedCodeOID = exports.SimplifiedCodeOID = function (oid) {
    var r = ConceptDescriptor.define("SC " + oid);
    r.cleanupStep(augmentSimplifiedCodeOID(oid));
    return r;
};

var SimplifiedCodeSystem = exports.SimplifiedCodeSystem = ConceptDescriptor.define("SimplifiedCodeSystem")
    .cleanupStep(function () {
        if (this.js) {
            this.js = this.js.code_system;
        }
    });

var PhysicalQuantity = exports.PhysicalQuantity = Component.define("PhysicalQuantity")
    .fields([
        ["value", "1..1", "@value", Processor.asFloat],
        ["unit", "0..1", "@unit"]
    ]);

var EventOffset = exports.EventOffset = Component.define("EventOffset")
    .fields([
        ["low", "0..1", "h:/low", PhysicalQuantity],
        ["high", "0..1", "h:/high", PhysicalQuantity],
        ["center", "0..1", "h:/center", PhysicalQuantity],
        ["width", "0..1", "h:/width", PhysicalQuantity],
    ]);

var EffectiveTime = exports.EffectiveTime = Component.define("EffectiveTime")
    .fields([
        ["point", "0..1", "@value", Processor.asTimestamp],
        ["point_resolution", "0..1", "@value", Processor.asTimestampResolution],
        ["low", "0..1", "h:low/@value", Processor.asTimestamp],
        ["low_resolution", "0..1", "h:low/@value", Processor.asTimestampResolution],
        ["high", "0..1", "h:high/@value", Processor.asTimestamp],
        ["high_resolution", "0..1", "h:high/@value", Processor.asTimestampResolution],
        ["operator", "0..1", "./@operator"],
        ["xsitype", "0..1", "./@xsi:type"],
        ["period", "0..1", "./h:period", PhysicalQuantity],
        ["center", "0..1", "h:center/@value", Processor.asTimestamp],
        ["center_resolution", "0..1", "h:center/@value", Processor.asTimestampResolution],

        //TODO: kill element when no subelements and only nullFlavor is present
        ["null_flavor", "0..1", "./@nullFlavor", Processor.asString]

        //["precise","0..1", "./@institutionSpecified", Processor.asBoolean],
    ])
    .cleanupStep(Cleanup.removeField('xsiType'))
    .cleanupStep(Cleanup.augmentEffectiveTime);

var IndividualName = exports.IndividualName = Component.define('IndividualName')
    .fields([
        ["prefix", "0..1", "h:prefix"],
        ["middle", "0..*", "h:given"],
        ["last", "0..1", "h:family"],
        ["suffix", "0..1", "h:suffix"],
        ["freetext_name", "0..1", "../h:name", Processor.asString]
    ]).cleanupStep(Cleanup.augmentIndividualName);

var Address = exports.Address = Component.define("Address")
    .fields([
        ["street_lines", "1..4", "h:streetAddressLine/text()"],
        ["city", "1..1", "h:city/text()", Processor.asString],
        ["state", "0..1", "h:state/text()"],
        ["zip", "0..1", "h:postalCode/text()"],
        ["country", "0..1", "h:country/text()"],
        ["use", "0..1", "@use", SimpleCode("2.16.840.1.113883.5.1119")]
    ]);

var Email = exports.Email = Component.define("Email")
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
    });

var Phone = exports.Phone = Component.define("Phone")
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
    });

var Organization = exports.Organization = Component.define("Organization")
    .fields([
        ["identifiers", "0..*", "h:id", Identifier],
        ["name", "0..*", "h:name"],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", "h:telecom", Email],
        ["phone", "0..*", "h:telecom", Phone]
    ]);

var assignedEntity = exports.assignedEntity = Component.define("assignedEntity")
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
var Provider = exports.Provider = Component.define('Provider')
    .fields([
        ["address", "1..1", "h:addr", Address],
        ["identifiers", "1..*", "h:id", Identifier],
        ["phone", "0..*", "h:telecom", Phone],
        ["email", "0..*", "h:telecom", Email],
        ["organization", "0..1", "h:representedOrganization", Organization]
    ]);
*/
exports.serviceDeliveryLocation = Component.define('serviceDeliveryLocation')
    .fields([
        ["name", "0:1", "h:playingEntity/h:name"],
        ["location_type", "1..1", "h:code", ConceptDescriptor],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", "h:telecom", Email],
        ["phone", "0..*", "h:telecom", Phone]
    ]);
