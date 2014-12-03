require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var parseCMS = require("blue-button-cms");

var componentRouter = require("./parser/router").componentRouter;
var xmlParser = require("blue-button-xml").xmlUtil;
var util = require("util");
var sense = require("./sense.js");

//add model/package version to metadata
var version = require("../package.json").version;

//insert sections list into metadata
function sections(data) {
    if (!data.meta) {
        data.meta = {};
    }

    if (data.data.doc_identifiers) {
        data.meta.identifiers = data.data.doc_identifiers;
        delete data.data.doc_identifiers;
    }
    data.meta.sections = Object.keys(data.data);
    return data;
}

function parseText(txt) {
    //txt must be a string
    if (!txt || typeof (txt) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    return sections(parseCMS.parseText(txt));

}

function parseXml(doc, options) {
    //data must be an object
    if (!doc || typeof (doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    var componentParser = componentRouter(options.component, sense.senseXml(doc));

    if (!componentParser) {
        var msg = util.format("Component %s is not supported.", options.component);
        //callback(new Error(msg)); //TODO:revise this use of callbacks
        return {
            "errors": new Error(msg)
        };
    }
    var ret = componentParser.instance();

    ret.run(doc, options.sourceKey);
    ret.cleanupTree(options.sourceKey); // first build the data objects up 
    return sections({
        "data": ret.toJSON(),
        "meta": {
            "version": version
        },
        "errors": ret.errors
    });

}

function parseString(data, options) {
    //data must be a string
    if (!data || typeof (data) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    if (arguments.length === 1) {
        options = {};
    }

    var doc = xmlParser.parse(data);
    return parseXml(doc, options);
}

module.exports = {
    //parse_retired: parse_retired,
    parseXml: parseXml,
    parseString: parseString,
    parseText: parseText
};

},{"../package.json":90,"./parser/router":42,"./sense.js":43,"blue-button-cms":"blue-button-cms","blue-button-xml":"blue-button-xml","util":88}],2:[function(require,module,exports){
"use strict";

var component = require("blue-button-xml").component;
var shared = require("./shared");

var exportC32 = function (version) {
    var patient = require("./demographics").patient;
    var allergiesSection = require("./sections/allergies").allergiesSection(version)[0];
    var vitalSignsSection = require("./sections/vitals").vitalSignsSection(version)[0];
    var resultsSection = require("./sections/results").resultsSection(version)[0];
    var problemsSection = require("./sections/problems").problemsSection(version)[0];
    var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
    var immunizationsSection = require("./sections/immunizations").immunizationsSection(version)[0];
    var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
    var encountersSection = require("./sections/encounters").encountersSection(version)[0];
    return component.define("C32")
        .fields([
            ["doc_identifiers", "0..*", "h:id", shared.Identifier],
            ["demographics", "1..1", "(/ | //h:recordTarget/h:patientRole)[last()]", patient],
            ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
            ["encounters", "0..1", encountersSection.xpath(), encountersSection],
            ["immunizations", "0..1", immunizationsSection.xpath(), immunizationsSection],
            ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
            ["problems", "0..1", problemsSection.xpath(), problemsSection],
            ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
            ["vitals", "0..1", vitalSignsSection.xpath(), vitalSignsSection],
            ["results", "0..1", resultsSection.xpath(), resultsSection]
        ]);

}

exports.C32 = exportC32;

},{"./demographics":4,"./sections/allergies":5,"./sections/encounters":6,"./sections/immunizations":7,"./sections/medications":8,"./sections/problems":9,"./sections/procedures":10,"./sections/results":11,"./sections/vitals":12,"./shared":13,"blue-button-xml":"blue-button-xml"}],3:[function(require,module,exports){
"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.augmentObservation = function () {

    if (this.js.problem_text.js) {
        if (!this.js.code.js.name) {
            this.js.code.js.name = this.js.problem_text.js;
        }
    }

};

},{"../common/cleanup":40}],4:[function(require,module,exports){
"use strict";

var shared = require('./shared');
var processor = require("blue-button-xml").processor;
var component = require("blue-button-xml").component;

var Guardian = component.define("Guardian")
    .fields([
        ["relation", "0..1", "h:code", shared.SimplifiedCode],
        ["addresses", "0..*", "h:addr", shared.Address],
        ["names", "1..*", "h:guardianPerson/h:name", shared.IndividualName],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
    ]);

var LanguageCommunication = component.define("LanguageCommunication")
    .fields([
        ["language", "1..1", "h:languageCode/@code"],
        ["preferred", "1..1", "h:preferenceInd/@value", processor.asBoolean],
        ["mode", "0..1", "h:modeCode", shared.SimplifiedCode],
        ["proficiency", "0..1", "h:proficiencyLevelCode", shared.SimplifiedCode]
    ]);

var augmentRaceEthnicity = function () {
    //Ethnicity only exists to account for hispanic/latino; using to override race if needed.
    //The actually have the same coding system too.
    if (this.js && this.js.ethnicity) { //HACK: addded if
        if (this.js.ethnicity.js.code === "2135-2") {
            this.js = this.js.ethnicity.js.name;
        } else {
            if (this.js.race.js.code) {
                this.js = this.js.race.js.name;
            }
        }
    }
};

var RaceEthnicity = component.define("RaceEthnicity")
    .fields([
        ["race", "0..1", "h:raceCode", shared.ConceptDescriptor],
        ["ethnicity", "0..1", "h:ethnicGroupCode", shared.ConceptDescriptor]
    ]).cleanupStep(augmentRaceEthnicity);

exports.patient = component.define("Patient")
    .fields([
        ["name", "1..1", "h:patient/h:name", shared.IndividualName],
        ["dob", "1..1", "h:patient/h:birthTime", shared.EffectiveTime],
        ["gender", "1..1", "h:patient/h:administrativeGenderCode", shared.SimplifiedCode],
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["marital_status", "0..1", "h:patient/h:maritalStatusCode", shared.SimplifiedCode],
        ["addresses", "0..*", "h:addr", shared.Address],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["race_ethnicity", "0..1", "h:patient", RaceEthnicity],
        ["languages", "0..*", "h:patient/h:languageCommunication", LanguageCommunication],
        ["religion", "0..1", "h:patient/h:religiousAffiliationCode/@code", shared.SimpleCode("2.16.840.1.113883.5.1076")],
        ["birthplace", "0..1", "h:patient/h:birthplace/h:place/h:addr", shared.Address],
        ["guardians", "0..*", "h:patient/h:guardian", Guardian]
    ]);

},{"./shared":13,"blue-button-xml":"blue-button-xml"}],5:[function(require,module,exports){
"use strict";

// NOTE: allergies section not present in ccda-r1.0, so just kept
// templateIds hard-coded with ccda-r1.1 values
var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var processor = require("blue-button-xml").processor;

var exportAllergiesSection = function (version) {

    var allergySeverityObservation = component.define("allergySeverityObservation")
        .fields([

            //VA Mod, per file no coding, so shim into code name.
            //["code", "0..1", "h:value", shared.ConceptDescriptor],
            ["code.name", "0..1", "h:text", shared.TextWithReference]
            //Interpretation not in C32 Spec.
            //["interpretation", "0..1", "h:interpretationCode", shared.ConceptDescriptor]
        ]);

    var allergyReaction = component.define("allergyReaction");
    allergyReaction.templateRoot(["2.16.840.1.113883.10.20.1.54"]);
    allergyReaction.fields([
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["reaction.name", "1..1", "h:text", shared.TextWithReference],
        //Reaction Severity not included in C32 Spec.
        //["severity", "0..1", "h:entryRelationship/h:observation", allergySeverityObservation]
    ]);

    var allergenDescriptor = component.define('allergenDescriptor');
    allergenDescriptor.fields([

        ["name", "0..1", "h:name/text()"],
        ["code", "0..1", "h:code", shared.ConceptDescriptor]
    ]).cleanupStep(function () {

        //Custom VA C32 Shim.
        if (this.js.code) {
            if (this.js.code.js.name === "Coded Allergy Name Not Available") {
                delete this.js.code;
            }
        }

    });

    /*
    var allergyStatusObservation = component.define("allergyStatusObservation");
    allergyStatusObservation.fields([
        ["code", "0..1", "@code"],
        ["status", "0..1", "@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.80.68")],
    ]);
    */

    var allergyObservation = component.define("allergyObservation"); // this is status observation
    allergyObservation.templateRoot(["2.16.840.1.113883.10.20.1.18"]);
    allergyObservation.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        //NOTE: Negation Id (per PragueExpat)
        ["negation_indicator", "0..1", "./@negationInd", processor.asBoolean],
        //NOTE allergen must be optional in case of negationInd = true (per PragueExpat)
        ["allergen", "0..1", "h:participant/h:participantRole/h:playingEntity", allergenDescriptor], // (see above) - was 1..1 //Require (optional in spec)

        ["intolerance", "0..1", "h:code", shared.ConceptDescriptor],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],

        //Status not included on C32.
        //["status", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.22.4.28']/h:value", shared.ConceptDescriptor],
        ["reactions", "0..*", allergyReaction.xpath(), allergyReaction],
        ["severity", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.1.55']", allergySeverityObservation]
    ]);

    var problemAct = component.define('problemAct');
    problemAct.templateRoot(['2.16.840.1.113883.3.88.11.83.6']);
    problemAct.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["observation", "1..1", allergyObservation.xpath(), allergyObservation] // Ignore observation cardinality (in spec can be more than 1)
    ]);
    //problemAct.cleanupStep(cleanup.extractAllFields(['observation']));

    var allergiesSection = component.define('allergiesSection');
    allergiesSection.templateRoot(['2.16.840.1.113883.3.88.11.83.102']);
    allergiesSection.fields([
        ["problemAct", "1..*", problemAct.xpath(), problemAct]
    ]);
    allergiesSection.cleanupStep(cleanup.replaceWithField(["problemAct"]));

    return [allergiesSection, problemAct];
}
exports.allergiesSection = exportAllergiesSection;
exports.allergiesEntry = exportAllergiesSection;

},{"../cleanup":3,"../shared":13,"blue-button-xml":"blue-button-xml"}],6:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportEncountersSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    /*var finding = component.define("finding");
    finding.templateRoot([clinicalStatementsIDs.Indication]);
    finding.fields([
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["value", "1..1", "h:value", shared.ConceptDescriptor],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime]
    ]);*/
    //finding.cleanupStep(cleanup.extractAllFields(['value']));

    // Iff needed add this later by refactoring Problem Observation from Problems.  They should share.
    //var diagnosis = component.define("diagnosis");
    //finding.templateRoot(['2.16.840.1.113883.10.20.22.4.80']);
    //finding.fields([
    //  ["code", "1..1", "h:code", shared.ConceptDescriptor]
    //]);
    //finding.cleanupStep(cleanup.extractAllFields(['code']));

    var activity = component.define('activity');
    activity.templateRoot(["2.16.840.1.113883.10.20.1.2", "2.16.840.1.113883.3.88.11.83.16"]);
    activity.fields([
        ["encounter", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["performers", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation]

        //No findings in C32 Spec.
        //["findings", "0..*", finding.xpath(), finding] //,
        //["diagnoses", "0..*", diagnosis.xpath(), diagnosis]
    ]);

    var encountersSection = component.define('encountersSection');
    encountersSection.templateRoot(["2.16.840.1.113883.3.88.11.83.127", "1.3.6.1.4.1.19376.1.5.3.1.1.5.3.3"]);
    encountersSection.fields([
        ["activity", "0..*", activity.xpath(), activity]
    ]);
    encountersSection.cleanupStep(cleanup.replaceWithField(["activity"]));
    return [encountersSection, activity];
}
exports.encountersSection = exportEncountersSection;
exports.encountersEntry = exportEncountersSection;

},{"../cleanup":3,"../shared":13,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],7:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var augmentImmunizationStatus = function () {
    var tmpStatus = "";
    if (this.js.negation_ind === "true") {
        tmpStatus = "refused";
    } else if (this.js.mood_code === "INT") {
        tmpStatus = "pending";
    } else if (this.js.mood_code === "EVN") {
        tmpStatus = "complete";
    } else {
        tmpStatus = "unknown";
    }
    this.js = tmpStatus;
};

var exportImmunizationsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var ImmunizationStatus = component.define("ImmunizationStatus")
        .fields([
            ["mood_code", "0..1", "./@moodCode"],
            ["negation_ind", "0..1", "./@negationInd"],
        ]).cleanupStep(augmentImmunizationStatus);

    var ImmunizationAdministration = component.define("ImmunizationAdministration")
        .fields([
            ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
            ["body_site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
            ["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
            ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor]
        ]);

    var ImmunizationInstructions = component.define("MedicationInstructions")
        .fields([
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["free_text", "0..1", "h:text", shared.TextWithReference]
        ]);

    var immunizationActivityProduct = component.define('immunizationActivityProduct')
        .fields([
            ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
            ["lot_number", "0..1", "h:manufacturedMaterial/h:lotNumberText"],
            ["manufacturer", "0..1", "h:manufacturerOrganization/h:name"],
        ]);

    var ImmunizationActivity = component.define("ImmunizationActivity")
        .templateRoot(["2.16.840.1.113883.3.88.11.83.13"])
        .fields([
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["status", "0..1", "./../h:substanceAdministration", ImmunizationStatus],
            ["sequence_number", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:observation/h:value"],
            ["product", "0..1", "h:consumable/h:manufacturedProduct", immunizationActivityProduct],
            ["administration", "0..1", "./../h:substanceAdministration", ImmunizationAdministration],
            ["performer", "0..1", "h:performer/h:assignedEntity", shared.assignedEntity],
            //Not in C32 Spec.
            //["instructions", "0..1", "h:entryRelationship[@typeCode='RSON']/h:act", ImmunizationInstructions],
            ["refusal_reason", "0..1", "h:entryRelationship[@typeCode='RSON']/h:act", shared.SimpleCode("2.16.840.1.113883.10.20.1.27")],
        ]);

    var immunizationsSection = component.define("immunizationsSection");
    immunizationsSection.templateRoot(["2.16.840.1.113883.3.88.11.83.117", "1.3.6.1.4.1.19376.1.5.3.1.3.23"]);
    immunizationsSection.fields([
        ["immunizations", "0..*", ImmunizationActivity.xpath(), ImmunizationActivity]
    ]);

    immunizationsSection.cleanupStep(cleanup.replaceWithField('immunizations'));

    return [immunizationsSection, ImmunizationActivity]
}

exports.immunizationsSection = exportImmunizationsSection;
exports.immunizationsEntry = exportImmunizationsSection;

},{"../cleanup":3,"../shared":13,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],8:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var processor = require("blue-button-xml").processor;
var bbm = require("blue-button-meta");
var _ = require("underscore");

var exportMedicationsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var MedicationInterval = component.define("MedicationInterval")
        .fields([
            ["phase", "0..1", "./h:phase", shared.EffectiveTime],
            ["period", "0..1", "./h:period", shared.PhysicalQuantity],
            ["alignment", "0..1", "./@alignment"],
            ["frequency", "0..1", "./@institutionSpecified", processor.asBoolean],
            ["event", "0..1", "./h:event/@code", shared.SimpleCode("2.16.840.1.113883.5.139")],
            ["event_offset", "0..1", "./h:offset", shared.EventOffset]
        ]);

    var MedicationAdministration = component.define("MedicationAdministration")
        .fields([
            ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
            ["site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
            ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor],
            //["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
            ["rate", "0..1", "h:rateQuantity", shared.PhysicalQuantity],
            ["dose_restriction", "0..1", "h:maxDoseQuantity", shared.PhysicalQuantity],
            //["interval", "0..1", "h:effectiveTime[@operator='A']", MedicationInterval],
        ]);

    var MedicationIndication = component.define("MedicationIndication")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["value", "0..1", "h:value", shared.ConceptDescriptor]
        ]);

    var MedicationPrecondition = component.define("MedicationPrecondition")
        .fields([
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["text", "0..1", "h:text"],
            ["value", "0..1", "h:value", shared.ConceptDescriptor]
        ]);

    var author = component.define("author")
        .fields([
            ["date_time", "0..1", "h:time", shared.EffectiveTime],
            ["identifiers", "0..*", "h:assignedAuthor/h:id", shared.Identifier],
            [version == "" ? "name" : "organization", "0..1",
                "(h:assignedAuthor/h:representedOrganization | h:assignedAuthor/h:assignedPerson/h:name)[last()]", (version == "" ? shared.IndividualName : shared.Organization)
            ]
        ]);

    var MedicationInformation = component.define("MedicationInformation")
        .templateRoot("2.16.840.1.113883.10.20.22.4.23")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["unencoded_name", "0..1", "h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
            ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
            ["manufacturer", "0..1", "h:manufacturerOrganization/h:name"]
        ]);

    var MedicationSupplyOrder = component.define("MedicationSupplyOrder")
        .fields([
            ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["repeatNumber", "0..1", "h:repeatNumber/@value"],
            ["quantity", "0..1", "h:quantity/@value"],
            ["status", "0..1", "h:status/@code"],
            ["author", "0..1", "h:author", author] //, instructions use references, which are not supported (also samples don't have good data for it)
            //["instructions", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:act", MedicationInstructions]
        ]);

    var MedicationPerformer = component.define("MedicationPerformer")
        .fields([
            ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
            ["address", "0..*", "h:assignedEntity/h:addr", shared.Address],
            ["phone", "0..1", "h:assignedEntity/" + shared.phone.xpath(), shared.phone],
            ["organization", "0..*", "h:assignedEntity/h:representedOrganization", shared.Organization]
        ]);
    /*
        var MedicationDrugVehicle = component.define("MedicationDrugVehicle")
            .templateRoot("2.16.840.1.113883.10.20.22.4.24")
            .fields([
                ["playingEntity", "0..1", "h:playingEntity/h:code", shared.ConceptDescriptor]
            ]).cleanupStep(cleanup.extractAllFields(["drug_vehicle"]));
*/
    var MedicationInstructions = component.define("MedicationInstructions")
        .fields([
            ["code", "0..1", "../h:code", shared.ConceptDescriptor],
            ["freeText", "0..1", "../h:text", shared.TextWithReference]
        ]);

    var MedicationDispense = component.define("MedicationDispense")
        .templateRoot("2.16.840.1.113883.10.20.22.4.18")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["performer", "0..1", "h:performer", MedicationPerformer],
            ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", MedicationSupplyOrder]
        ]);

    var MedicationActivity = component.define("MedicationActivity")
        .templateRoot("2.16.840.1.113883.3.88.11.83.8")
        .fields([
            ["date_time", "0..1", "h:effectiveTime[not (@operator='A')]", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["status", "1..1", "./../h:substanceAdministration/@moodCode"],
            ["sig", "0..1", "h:text", shared.TextWithReference],
            ["product", "1..1", "h:consumable/h:manufacturedProduct", MedicationInformation],
            ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", MedicationSupplyOrder],
            ["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
            ["performer", "0..1", "h:performer", MedicationPerformer],
            ["drug_vehicle", "0..1", "h:participant[@typeCode='CSM']/h:participantRole/h:playingEntity[@classCode='MMAT']/h:code", shared.ConceptDescriptor],
            ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition],
            ["indication", "0..1", "h:entryRelationship[@typeCode='RSON']/h:observation", MedicationIndication],
            //["instructions", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply/*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.20']", MedicationInstructions],
            ["dispense", "0..1", MedicationDispense.xpath(), MedicationDispense]
        ])
        //.cleanupStep(Cleanup.extractAllFields(["medicationName"]))
        .cleanupStep(function () {

            this.js.identifiers = _.filter(this.js.identifiers, function (identifier) {
                if (identifier.js === null) {
                    return false;
                } else {
                    return true;
                }
            })

            //Cleanup Status.

            if (this.js.status === "EVN") {
                this.js.status = "Completed";
            }
            if (this.js.status === "INT") {
                this.js.status = "Prescribed";
            }

            // separate out two effectiveTimes

            /*
          // 1.  startDate --- endDate
          var range = this.js.times.filter(function(t){
            return -1 === ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
          });

          // 2.  dosing interval
          var period= this.js.times.filter(function(t){
            return -1 !== ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
          });

          delete this.js.times;

          if (range.length > 0) {
            this.js.dateRange = range[0];
          }

          if (period.length > 0) {
            this.js.dosePeriod = period[0].js.period;
          }*/

        });

    var medicationsSection = component.define("medicationsSection");
    medicationsSection.templateRoot(["2.16.840.1.113883.3.88.11.83.112", "1.3.6.1.4.1.19376.1.5.3.1.3.19"]);
    medicationsSection.fields([
        ["medications", "0..*", MedicationActivity.xpath(), MedicationActivity]
    ]);
    medicationsSection.cleanupStep(cleanup.replaceWithField('medications'));
    return [medicationsSection, MedicationActivity];

}

exports.medicationsSection = exportMedicationsSection;
exports.medicationsEntry = exportMedicationsSection;

},{"../cleanup":3,"../shared":13,"blue-button-meta":44,"blue-button-xml":"blue-button-xml","underscore":89}],9:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProblemsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    //These three elements aren't used right now, but can be refactored to use in standardized way.
    var AgeObservation = component.define("AgeObservation")
        .templateRoot("2.16.840.1.113883.10.20.1.38");

    var ProblemStatus = component.define("ProblemStatus")
        .templateRoot("2.16.840.1.113883.10.20.1.50")
        .fields([
            ["name", "0..1", "h:value/@displayName"],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ]);

    var ProblemObservation = component.define("ProblemObservation")
        .fields([
            ["code", "0..1", "../h:value", shared.ConceptDescriptor],
            ["problem_text", "0..1", "../h:text", shared.TextWithReference],
            ["date_time", "0..1", "../h:effectiveTime", shared.EffectiveTime],
        ]).cleanupStep(cleanup.augmentObservation).cleanupStep(cleanup.removeField("problem_text"));

    //TODO:  Cleanup/investigate negation status.
    var ProblemConcernAct = component.define("ProblemConcernAct")
        .fields([
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:entryRelationship/h:observation/h:id", shared.Identifier],
            ["negation_indicator", "0..1", "h:entryRelationship/h:observation", shared.NegationIndicator],
            ["problem", "1:1", "h:entryRelationship/h:observation/h:value", ProblemObservation],
            ["onset_age", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.1 13883.10.20.1.38']/../h:value/@value"],
            ["onset_age_unit", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.1 13883.10.20.1.38']/../h:value", shared.AgeDescriptor],
            ["status", "0..1", ProblemStatus.xpath(), ProblemStatus],
            //Patient Status not supported.
            //["patient_status", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
            ["source_list_identifiers", "0..*", "h:id", shared.Identifier],
        ]).withNegationStatus(true);
    //ProblemConcernAct.cleanupStep(cleanup.extractAllFields(['value']));

    var NonProblemObservation = ProblemConcernAct
        .define("ProblemObservation")
        .withNegationStatus(true);

    var ProblemOrganizer = component.define("ProblemOrganizer")
        .templateRoot(["2.16.840.1.113883.3.88.11.83.7"]);

    var problemsSection = component.define("problemsSection");
    problemsSection.templateRoot(["2.16.840.1.113883.3.88.11.83.103"]); // coded entries required
    problemsSection.fields([
        ["problems", "0..*", ProblemOrganizer.xpath(), ProblemConcernAct],
    ]);

    problemsSection.cleanupStep(cleanup.replaceWithField("problems"));
    return [problemsSection, ProblemConcernAct];
}

exports.problemsSection = exportProblemsSection;
exports.problemsEntry = exportProblemsSection;

},{"../cleanup":3,"../shared":13,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],10:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProceduresSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var entry = component.define('entry');
    entry.templateRoot(["2.16.840.1.113883.3.88.11.83.17", "1.3.6.1.4.1.19376.1.5.3.1.4.19"]);
    entry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        //Not C32 Supported.
        //["status", "1..1", "h:statusCode", shared.SimplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["body_sites", "0..*", "h:targetSiteCode", shared.ConceptDescriptor],

        //Not C32 Supported.
        //["specimen", "0..1", "h:specimen", ProcedureSpecimen],
        //Not C32 Supported.
        //["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performer", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        //Not C32 Supported.
        //["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ['procedure_type', "1..1", "h:templateId/@root"]
    ]);

    entry.cleanupStep(function () {
        var typeMap = {
            "2.16.840.1.113883.3.88.11.83.17": "procedure" // ccda-r1
        };
        var t = this.js['procedure_type'];
        this.js['procedure_type'] = typeMap[t];
    });

    var proceduresSection = component.define('proceduresSection');
    proceduresSection.templateRoot(["2.16.840.1.113883.10.20.1.12"]);
    proceduresSection.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    proceduresSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [proceduresSection, entry];
}

exports.proceduresSection = exportProceduresSection;
exports.proceduresEntry = exportProceduresSection;

},{"../cleanup":3,"../shared":13,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],11:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportResultsSection = function (version) {
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];
    var sectionIDs = bbm.CCDA["sections" + version];

    var referenceRange = component.define('referenceRange')
        .fields([
            ["low", "0..1", "h:value/h:low/@value"],
            ["high", "0..1", "h:value/h:high/@value"],
            ["unit", "0..1", "h:value/h:low/@unit"],
            ["range", "0..1", "h:text/text()"]
        ]);

    var ResultObservation = component.define("ResultObservation")
        .templateRoot("2.16.840.1.113883.3.88.11.83.15.1")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result", "1..1", "h:code", shared.ConceptDescriptor],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            //["physicalQuantity.text", "1..1", "h:value[@xsi:type='ST']", shared.PhysicalQuantity],
            ["status", "1..1", "h:statusCode/@code"],
            ["text", "0..1", "h:value[@xsi:type='ST']/text()"],
            ["reference_range", "0..1", "h:referenceRange/h:observationRange", referenceRange],
            //["codedValue", "0..1", "h:value[@xsi:type='CD']", shared.ConceptDescriptor],
            //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
            ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
        ]);
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['resultName']));

    // TODO: Accomodating both PQ and CD values needed
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['codedValue']));

    var ResultsOrganizer = component.define("ResultsOrganizer")
        .templateRoot("2.16.840.1.113883.10.20.1.32")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result_set", "0..1", "h:code", shared.ConceptDescriptor],
            ["results", "1..*", ResultObservation.xpath(), ResultObservation]
        ]);

    var resultsSection = component.define("resultsSection");
    resultsSection.templateRoot(['2.16.840.1.113883.3.88.11.83.122']); // .1 for "entries required"
    resultsSection.fields([
        ["panels", "0..*", ResultsOrganizer.xpath(), ResultsOrganizer]
    ]);
    resultsSection.cleanupStep(cleanup.replaceWithField('panels'));

    return [resultsSection, ResultsOrganizer];
}

exports.resultsSection = exportResultsSection;
exports.resultsEntry = exportResultsSection;

},{"../cleanup":3,"../shared":13,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],12:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportVitalSignsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var VitalSignObservation = component.define("VitalSignObservation")
        .templateRoot("2.16.840.1.113883.3.88.11.83.14")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier], //this one is stripped out by "paredown" cleanup step in component.js
            ["vital", "1..1", "h:code", shared.ConceptDescriptor],
            //["identifiers","0..*", "h:id", shared.Identifier], //dup with first line
            ["status", "1..1", "h:statusCode/@code"],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
            //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
            ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
        ]);
    //VitalSignObservation.cleanupStep(cleanup.extractAllFields(['code']));
    VitalSignObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));

    var vitalSignsSection = component.define("vitalSignsSection");
    vitalSignsSection.templateRoot(["2.16.840.1.113883.3.88.11.83.119"]);
    vitalSignsSection.fields([
        ["entry", "0..*", VitalSignObservation.xpath(), VitalSignObservation]
    ]);
    vitalSignsSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [vitalSignsSection, VitalSignObservation];
}

// var VitalSignObservation = component.define("VitalSignObservation")
//     .templateRoot(clinicalStatementsIDs.VitalSignObservation)
//     .fields([
//         ["identifiers", "0..*", "h:id", shared.Identifier], //this one is stripped out by "paredown" cleanup step in component.js
//         ["vital", "1..1", "h:code", shared.ConceptDescriptor],
//         //["identifiers","1..*", "h:id", shared.Identifier], //dup with first line
//         ["status", "1..1", "h:statusCode/@code"],
//         ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
//         ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
//         //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
//         ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
//     ]);
//   //VitalSignObservation.cleanupStep(cleanup.extractAllFields(['code']));
//   VitalSignObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));

/*
  //Vitals organizer is not used (flattened out in JSON model)
  var VitalSignsOrganizer = component.define("VitalSignsOrganizer")
  .templateRoot("2.16.840.1.113883.10.20.22.4.26")
  .fields([
    ["panelName","0..1", "h:code", shared.ConceptDescriptor],
    ["sourceIds","1..*", "h:id", shared.Identifier],
    ["vitals", "1..*", VitalSignObservation.xpath(), VitalSignObservation]
  ]);
  
  
  exports.VitalSignsSection = Component.define("VitalSignsSection")
  .templateRoot("2.16.840.1.113883.10.20.22.2.4.1")
  .fields([
    //["name","0..1", "h:code", shared.ConceptDescriptor],
    //["panels","0..*", VitalSignsOrganizer.xpath(), VitalSignsOrganizer],
    ["vitals","0..*", VitalSignObservation.xpath(), VitalSignObservation],
  ]);
  */

exports.vitalSignsSection = exportVitalSignsSection;

exports.vitalSignsEntry = exportVitalSignsSection;

},{"../cleanup":3,"../shared":13,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],13:[function(require,module,exports){
"use strict";

var component = require("blue-button-xml").component;
var processor = require("blue-button-xml").processor;
var cleanup = require("./cleanup");
var common = require("blue-button-xml").common;

var commonShared = require('../common/shared');

var shared = module.exports = Object.create(commonShared);

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
        ["prefix", "0..1", "h:prefix/text()"],
        ["middle", "0..*", "h:given/text()"],
        ["last", "0..1", "h:family/text()"],
        ["suffix", "0..1", "h:suffix/text()"],
        ["freetext_name", "0..1", "../h:name/text()", processor.asString]
    ]).cleanupStep(cleanup.augmentIndividualName).cleanupStep(cleanup.clearNulls);

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
        ["identifiers", "0..*", "h:id", Identifier],
        ["name", "0..*", "h:name/text()"],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["phone", "0..*", shared.phone.xpath(), shared.phone]
    ]);

var assignedEntity = shared.assignedEntity = component.define("assignedEntity")
    .fields([
        ["identifiers", "0..*", "h:id", Identifier],
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

},{"../common/shared":41,"./cleanup":3,"blue-button-xml":"blue-button-xml"}],14:[function(require,module,exports){
"use strict";

var component = require("blue-button-xml").component;
var shared = require("./shared");

var exportCCD = function (version) {
    var patient = require("./demographics").patient;
    var resultsSection = require("./sections/results").resultsSection(version)[0];
    var vitalSignsSection = require("./sections/vitals").vitalSignsSection(version)[0];
    var problemsSection = require("./sections/problems").problemsSection(version)[0];
    var immunizationsSection = require("./sections/immunizations").immunizationsSection(version)[0];
    var socialHistorySection = require("./sections/social_history").socialHistorySection(version)[0];
    var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
    var allergiesSection = require("./sections/allergies").allergiesSection(version)[0];
    var encountersSection = require("./sections/encounters").encountersSection(version)[0];
    var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
    var plan_of_care_section = require("./sections/plan_of_care").plan_of_care_section(version)[0];
    var payers_section = require("./sections/payers").payers_section(version)[0];

    return component.define("CCD")
        .fields([
            ["doc_identifiers", "0..*", "h:id", shared.Identifier],
            ["demographics", "1..1", "(/ | //h:recordTarget/h:patientRole)[last()]", patient],
            ["vitals", "0..1", vitalSignsSection.xpath(), vitalSignsSection],
            ["results", "0..1", resultsSection.xpath(), resultsSection],
            ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
            ["encounters", "0..1", encountersSection.xpath(), encountersSection],
            ["allergies", "0..1", allergiesSection.xpath(), allergiesSection],
            ["immunizations", "0..1", immunizationsSection.xpath(), immunizationsSection],
            ["social_history", "0..1", socialHistorySection.xpath(), socialHistorySection],
            ["problems", "0..1", problemsSection.xpath(), problemsSection],
            ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
            ["plan_of_care", "0..1", plan_of_care_section.xpath(), plan_of_care_section],
            ["payers", "0..1", payers_section.xpath(), payers_section],
        ]);
}

exports.CCD = exportCCD;

},{"./demographics":16,"./sections/allergies":17,"./sections/encounters":18,"./sections/immunizations":19,"./sections/medications":20,"./sections/payers":21,"./sections/plan_of_care":22,"./sections/problems":23,"./sections/procedures":24,"./sections/results":25,"./sections/social_history":26,"./sections/vitals":27,"./shared":28,"blue-button-xml":"blue-button-xml"}],15:[function(require,module,exports){
"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

},{"../common/cleanup":40}],16:[function(require,module,exports){
"use strict";

var shared = require('./shared');
var processor = require("blue-button-xml").processor;
var component = require("blue-button-xml").component;

var Guardian = component.define("Guardian")
    .fields([
        ["relation", "0..1", "h:code", shared.SimplifiedCode],
        ["addresses", "0..*", "h:addr", shared.Address],
        ["names", "1..*", "h:guardianPerson/h:name", shared.IndividualName],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
    ]);

var LanguageCommunication = component.define("LanguageCommunication")
    .fields([
        ["language", "1..1", "h:languageCode/@code"],
        ["preferred", "1..1", "h:preferenceInd/@value", processor.asBoolean],
        ["mode", "0..1", "h:modeCode", shared.SimplifiedCode],
        ["proficiency", "0..1", "h:proficiencyLevelCode", shared.SimplifiedCode]
    ]);

var augmentRaceEthnicity = function () {
    //Ethnicity only exists to account for hispanic/latino; using to override race if needed.
    //The actually have the same coding system too.

    if (this.js && (this.js.ethnicity || this.js.race)) { //HACK: addded if
        if (this.js.ethnicity && (this.js.ethnicity.js.code === "2135-2")) {
            this.js = this.js.ethnicity.js.name;
        } else if (this.js.race) { //FIX: if race is nullFlavor fallback to ethnicity
            if (this.js.race.js.code) {
                this.js = this.js.race.js.name;
            }
        } else {
            this.js = this.js.ethnicity.js.name;
        }
    }
};

var RaceEthnicity = component.define("RaceEthnicity")
    .fields([
        ["race", "0..1", "h:raceCode", shared.ConceptDescriptor],
        ["ethnicity", "0..1", "h:ethnicGroupCode", shared.ConceptDescriptor]
    ]).cleanupStep(augmentRaceEthnicity);

module.exports.patient = component.define("Patient")
    .fields([
        ["name", "1..1", "h:patient/h:name", shared.IndividualName],
        ["dob", "1..1", "h:patient/h:birthTime", shared.EffectiveTime],
        ["gender", "1..1", "h:patient/h:administrativeGenderCode", shared.SimplifiedCode],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["marital_status", "0..1", "h:patient/h:maritalStatusCode", shared.SimplifiedCode],
        ["addresses", "0..*", "h:addr", shared.Address],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["race_ethnicity", "0..1", "h:patient", RaceEthnicity],
        ["languages", "0..*", "h:patient/h:languageCommunication", LanguageCommunication],
        ["religion", "0..1", "h:patient/h:religiousAffiliationCode/@code", shared.SimpleCode("2.16.840.1.113883.5.1076")],
        ["birthplace", "0..1", "h:patient/h:birthplace/h:place/h:addr", shared.Address],
        ["guardians", "0..*", "h:patient/h:guardian", Guardian]
    ]);

},{"./shared":28,"blue-button-xml":"blue-button-xml"}],17:[function(require,module,exports){
"use strict";

// NOTE: allergies section not present in ccda-r1.0, so just kept
// templateIds hard-coded with ccda-r1.1 values
var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var Processor = require("blue-button-xml").processor;

var exportAllergiesSection = function (version) {

    var allergySeverityObservation = component.define("allergySeverityObservation")
        .fields([
            ["code", "0..1", "h:value", shared.ConceptDescriptor],
            //["name", "0..1", "@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.3221.6.8")]
            ["interpretation", "0..1", "h:interpretationCode", shared.ConceptDescriptor]
        ]);

    var allergyReaction = component.define("allergyReaction");
    allergyReaction.templateRoot(["2.16.840.1.113883.10.20.22.4.9"]);
    allergyReaction.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["reaction", "1..1", "h:value", shared.ConceptDescriptor],
        ["severity", "0..1", "h:entryRelationship/h:observation", allergySeverityObservation]
    ]);

    var allergenDescriptor = shared.ConceptDescriptor.define('allergenDescriptor');
    allergenDescriptor.fields([
        ["name", "0..1", "h:originalText", shared.TextWithReference, 'epic']
    ]);

    /*
    var allergyStatusObservation = component.define("allergyStatusObservation");
    allergyStatusObservation.fields([
        ["code", "0..1", "@code"],
        ["status", "0..1", "@code", shared.SimpleCode("2.16.840.1.113883.3.88.12.80.68")],
    ]);
    */

    var allergyObservation = component.define("allergyObservation"); // this is status observation
    allergyObservation.templateRoot(["2.16.840.1.113883.10.20.22.4.7"]);
    allergyObservation.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        //NOTE: Negation Id (per PragueExpat)
        ["negation_indicator", "0..1", "./@negationInd", Processor.asBoolean],
        //NOTE allergen must be optional in case of negationInd = true (per PragueExpat)
        ["allergen", "0..1", "h:participant/h:participantRole/h:playingEntity/h:code", allergenDescriptor], // (see above) - was 1..1 //Require (optional in spec)

        ["intolerance", "0..1", "h:value", shared.ConceptDescriptor],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],

        ["status", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.22.4.28']/h:value", shared.ConceptDescriptor],
        ["reactions", "0..*", allergyReaction.xpath(), allergyReaction],
        ["severity", "0..1", "h:entryRelationship/h:observation[h:templateId/@root='2.16.840.1.113883.10.20.22.4.8']", allergySeverityObservation]
    ]);

    var problemAct = component.define('problemAct');
    problemAct.templateRoot(['2.16.840.1.113883.10.20.22.4.30']);
    problemAct.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["observation", "1..1", allergyObservation.xpath(), allergyObservation] // Ignore observation cardinality (in spec can be more than 1)
    ]);
    //problemAct.cleanupStep(cleanup.extractAllFields(['observation']));

    var allergiesSection = component.define('allergiesSection');
    allergiesSection.templateRoot(['2.16.840.1.113883.10.20.22.2.6', '2.16.840.1.113883.10.20.22.2.6.1']);
    allergiesSection.fields([
        ["problemAct", "1..*", problemAct.xpath(), problemAct]
    ]);
    allergiesSection.cleanupStep(cleanup.replaceWithField(["problemAct"]));

    return [allergiesSection, problemAct];
}
exports.allergiesSection = exportAllergiesSection;
exports.allergiesEntry = exportAllergiesSection;

},{"../cleanup":15,"../shared":28,"blue-button-xml":"blue-button-xml"}],18:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportEncountersSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var finding = component.define("finding");
    finding.templateRoot([clinicalStatementsIDs.Indication]);
    finding.fields([
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["value", "1..1", "h:value", shared.ConceptDescriptor],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime]
    ]);
    //finding.cleanupStep(cleanup.extractAllFields(['value']));

    // Iff needed add this later by refactoring Problem Observation from Problems.  They should share.
    //var diagnosis = component.define("diagnosis");
    //finding.templateRoot(['2.16.840.1.113883.10.20.22.4.80']);
    //finding.fields([
    //  ["code", "1..1", "h:code", shared.ConceptDescriptor]
    //]);
    //finding.cleanupStep(cleanup.extractAllFields(['code']));

    var activity = component.define('activity');
    activity.templateRoot([clinicalStatementsIDs.EncounterActivities, clinicalStatementsIDs.EncounterActivity]);
    activity.fields([
        ["encounter", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["performers", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ["findings", "0..*", finding.xpath(), finding] //,
        //["diagnoses", "0..*", diagnosis.xpath(), diagnosis]
    ]);

    var encountersSection = component.define('encountersSection');
    encountersSection.templateRoot([sectionIDs.EncountersSection, sectionIDs.EncountersSectionEntriesOptional]);
    encountersSection.fields([
        ["activity", "0..*", activity.xpath(), activity]
    ]);
    encountersSection.cleanupStep(cleanup.replaceWithField(["activity"]));
    return [encountersSection, activity];
}
exports.encountersSection = exportEncountersSection;
exports.encountersEntry = exportEncountersSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],19:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var augmentImmunizationStatus = function () {
    var tmpStatus = "";
    if (this.js.negation_ind === "true") {
        tmpStatus = "refused";
    } else if (this.js.mood_code === "INT") {
        tmpStatus = "pending";
    } else if (this.js.mood_code === "EVN") {
        tmpStatus = "complete";
    } else {
        tmpStatus = "unknown";
    }
    this.js = tmpStatus;
};

var exportImmunizationsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var ImmunizationStatus = component.define("ImmunizationStatus")
        .fields([
            ["mood_code", "0..1", "./@moodCode"],
            ["negation_ind", "0..1", "./@negationInd"],
        ]).cleanupStep(augmentImmunizationStatus);

    var ImmunizationAdministration = component.define("ImmunizationAdministration")
        .fields([
            ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
            ["body_site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
            ["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
            ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor]
        ]);

    var ImmunizationInstructions = component.define("MedicationInstructions")
        .fields([
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["free_text", "0..1", "h:text", shared.TextWithReference]
        ]);

    var immunizationActivityProduct = component.define('immunizationActivityProduct')
        .fields([
            ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
            ["lot_number", "0..1", "h:manufacturedMaterial/h:lotNumberText/text()"],
            ["manufacturer", "0..1", "h:manufacturerOrganization/h:name/text()"],
        ]);

    var ImmunizationActivity = component.define("ImmunizationActivity")
        .templateRoot([clinicalStatementsIDs.ImmunizationActivity, clinicalStatementsIDs.MedicationActivity])
        .fields([
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["status", "0..1", "./../h:substanceAdministration", ImmunizationStatus],
            ["sequence_number", "0..1", "h:repeatNumber/@value"],
            ["product", "0..1", "h:consumable/h:manufacturedProduct", immunizationActivityProduct],
            ["administration", "0..1", "./../h:substanceAdministration", ImmunizationAdministration],
            ["performer", "0..1", "h:performer/h:assignedEntity", shared.assignedEntity],
            ["instructions", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:act", ImmunizationInstructions],
            ["refusal_reason", "0..1", "h:entryRelationship/h:observation/h:code/@code", shared.SimpleCode("2.16.840.1.113883.5.8")],
        ]).cleanupStep(function () { // Quick and dirty fix for when refusal_reason catches other observations in Vitera.
            if (this.js) { // Refusal reason should use the template id
                if (this.js.refusal_reason && (!this.js.refusal_reason.js)) {
                    delete this.js.refusal_reason;
                }
            }
        });

    var immunizationsSection = component.define("immunizationsSection");
    immunizationsSection.templateRoot([sectionIDs.ImmunizationsSection, sectionIDs.ImmunizationsSectionEntriesOptional]);
    immunizationsSection.fields([
        ["immunizations", "0..*", ImmunizationActivity.xpath(), ImmunizationActivity]
    ]);

    immunizationsSection.cleanupStep(cleanup.replaceWithField('immunizations'));
    return [immunizationsSection, ImmunizationActivity]
}

exports.immunizationsSection = exportImmunizationsSection;
exports.immunizationsEntry = exportImmunizationsSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],20:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var processor = require("blue-button-xml").processor;
var bbm = require("blue-button-meta");

var exportMedicationsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    // Common entries between ccda-r1.1 and ccda-r1.0

    /* 1. For the medication interval component, you may find that some of the fields
    below(xsi:type, alignment, event, event_offset) are not defined in ccda 1.1.
    specification and in many sample files.

    refer to this link: https://groups.google.com/forum/#!msg/ccda_samples/WawmwNMYT_8/pqnp5bG1IygJ

    2. This is about the frequency tag and institutionSpecified attribute:

    The period element can represent either timing between doses or frequency.
    Use @institutionSpecified to distinguish these: To specify an interval between doses
    (e.g., every 8 hours), set the value of @institutionSpecified to false or omit the attribute.
    To specify frequency of administration (e.g., 3 times per day), set the value
    of @institutionSpecified to true.

    source: http://wiki.siframework.org/CDA+-+Medications+Section

    */
    var MedicationInterval = component.define("MedicationInterval")
        .fields([
            ["phase", "0..1", "./h:phase", shared.EffectiveTime],
            ["period", "0..1", "./h:period", shared.PhysicalQuantity],
            ["alignment", "0..1", "./@alignment"],
            ["frequency", "0..1", "./@institutionSpecified", processor.asBoolean],
            ["event", "0..1", "./h:event/@code", shared.SimpleCode("2.16.840.1.113883.5.139")],
            ["event_offset", "0..1", "./h:offset", shared.EventOffset]
        ]);

    var MedicationAdministration = component.define("MedicationAdministration")
        .fields([
            ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
            ["site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
            ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor],
            ["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
            ["rate", "0..1", "h:rateQuantity", shared.PhysicalQuantity],
            ["dose_restriction", "0..1", "h:maxDoseQuantity", shared.PhysicalQuantity],
            ["interval", "0..1", "h:effectiveTime[@operator='A']", MedicationInterval],
        ]);

    var MedicationIndication = component.define("MedicationIndication")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["value", "0..1", "h:value", shared.ConceptDescriptor]
        ]);

    var MedicationPrecondition = component.define("MedicationPrecondition")
        .fields([
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["text", "0..1", "h:text/text()"],
            ["value", "0..1", "h:value", shared.ConceptDescriptor]
        ]);

    var author = component.define("author")
        .fields([
            ["date_time", "0..1", "h:time", shared.EffectiveTime],
            ["identifiers", "0..*", "h:assignedAuthor/h:id", shared.Identifier],
            [version == "" ? "name" : "organization", "0..1",
                "(h:assignedAuthor/h:representedOrganization | h:assignedAuthor/h:assignedPerson/h:name)[last()]", (version == "" ? shared.IndividualName : shared.Organization)
            ]
        ]);

    // below entries differ between ccda-r1.1 and ccda-r1.0
    // ***************************************************************************
    // *                      ccda-r1.1 (LATEST VERSION)                         *
    // ***************************************************************************
    if (version == "") {
        var MedicationInformation = component.define("MedicationInformation")
            .templateRoot("2.16.840.1.113883.10.20.22.4.23")
            .fields([
                ["identifiers", "0..*", "h:id", shared.Identifier],
                ["unencoded_name", "0..1", "h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
                ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
                ["manufacturer", "0..1", "h:manufacturerOrganization/h:name/text()"]
            ]);

        var MedicationSupplyOrder = component.define("MedicationSupplyOrder")
            .fields([
                ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
                ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
                ["repeatNumber", "0..1", "h:repeatNumber/@value"],
                ["quantity", "0..1", "h:quantity/@value"],
                ["status", "0..1", "h:status/@code"],
                ["author", "0..1", "h:author", author] //, instructions use references, which are not supported (also samples don't have good data for it)
                //["instructions", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:act", MedicationInstructions]
            ]);

        var MedicationPerformer = component.define("MedicationPerformer")
            .fields([
                ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
                ["address", "0..*", "h:assignedEntity/h:addr", shared.Address],
                ["phone", "0..1", "h:assignedEntity/" + shared.phone.xpath(), shared.phone],
                ["organization", "0..*", "h:assignedEntity/h:representedOrganization", shared.Organization]
            ]);
        /*
        var MedicationDrugVehicle = component.define("MedicationDrugVehicle")
            .templateRoot("2.16.840.1.113883.10.20.22.4.24")
            .fields([
                ["playingEntity", "0..1", "h:playingEntity/h:code", shared.ConceptDescriptor]
            ]).cleanupStep(cleanup.extractAllFields(["drug_vehicle"]));
*/
        var MedicationInstructions = component.define("MedicationInstructions")
            .fields([
                ["code", "0..1", "../h:code", shared.ConceptDescriptor],
                ["freeText", "0..1", "../h:text", shared.TextWithReference]
            ]);

        var MedicationDispense = component.define("MedicationDispense")
            .templateRoot("2.16.840.1.113883.10.20.22.4.18")
            .fields([
                ["identifiers", "0..*", "h:id", shared.Identifier],
                ["performer", "0..1", "h:performer", MedicationPerformer],
                ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", MedicationSupplyOrder]
            ]);

        var MedicationActivity = component.define("MedicationActivity")
            .templateRoot("2.16.840.1.113883.10.20.22.4.16")
            .fields([
                ["date_time", "0..1", "h:effectiveTime[not (@operator='A')]", shared.EffectiveTime],
                ["identifiers", "0..*", "h:id", shared.Identifier],
                ["status", "1..1", "./../h:substanceAdministration/@moodCode"],
                ["sig", "0..1", "h:text", shared.TextWithReference],
                ["product", "1..1", "h:consumable/h:manufacturedProduct", MedicationInformation],
                ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", MedicationSupplyOrder],
                ["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
                ["performer", "0..1", "h:performer", MedicationPerformer],
                ["drug_vehicle", "0..1", "h:participant[@typeCode='CSM']/h:participantRole/h:playingEntity[@classCode='MMAT']/h:code", shared.ConceptDescriptor],
                ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition],
                ["indication", "0..1", "h:entryRelationship[@typeCode='RSON']/h:observation", MedicationIndication],
                //["instructions", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply/*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.20']", MedicationInstructions],
                ["dispense", "0..1", MedicationDispense.xpath(), MedicationDispense]
            ])
            //.cleanupStep(Cleanup.extractAllFields(["medicationName"]))
            .cleanupStep(function () {

                //Cleanup Status.

                if (this.js.status === "EVN") {
                    this.js.status = "Completed";
                }
                if (this.js.status === "INT") {
                    this.js.status = "Prescribed";
                }

                // separate out two effectiveTimes

                /*
          // 1.  startDate --- endDate
          var range = this.js.times.filter(function(t){
            return -1 === ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
          });

          // 2.  dosing interval
          var period= this.js.times.filter(function(t){
            return -1 !== ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
          });

          delete this.js.times;

          if (range.length > 0) {
            this.js.dateRange = range[0];
          }

          if (period.length > 0) {
            this.js.dosePeriod = period[0].js.period;
          }*/

            });

        var medicationsSection = component.define("medicationsSection");
        medicationsSection.templateRoot(["2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1"]);
        medicationsSection.fields([
            ["medications", "0..*", MedicationActivity.xpath(), MedicationActivity]
        ]);
        medicationsSection.cleanupStep(cleanup.replaceWithField('medications'));
        return [medicationsSection, MedicationActivity];

        // ***************************************************************************
        // *                      ccda-r1.0 (OLD VERSION)                            *
        // ***************************************************************************
    } else {

        var MedicationInformation = component.define("MedicationInformation")
            .templateRoot("2.16.840.1.113883.10.20.1.53")
            .fields([
                ["unencoded_name", "0..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
                ["product", "1..1", "h:manufacturedProduct/h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
            ]);

        var MedicationSupplyOrder = component.define("MedicationSupplyOrder")
            .templateRoot("2.16.840.1.113883.10.20.1.34")
            .fields([
                ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
                ["repeatNumber", "0..1", "h:repeatNumber/@value"],
                ["quantity", "0..1", "h:quantity/@value"],
                ["author", "0..1", "h:author", author]
            ]);

        var MedicationActivity = component.define("Medications")
            .templateRoot(["2.16.840.1.113883.10.20.1.34", "2.16.840.1.113883.10.20.1.24"])
            .fields([
                ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
                ["identifiers", "0..*", "h:id", shared.Identifier],
                ["status", "1..1", "h:statusCode/@code"],
                ["sig", "0..1", "h:text", shared.TextWithReference],
                ["product", "1..1", "(h:product | h:consumable)", MedicationInformation],
                ["supply", "0..1", "../h:supply", MedicationSupplyOrder],
                ["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
                ["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition]
            ])
            .cleanupStep(function () {

                //Cleanup Status.

                if (this.js.status === "EVN") {
                    this.js.status = "Completed";
                }
                if (this.js.status === "INT") {
                    this.js.status = "Prescribed";
                }
            });

        var medicationsSection = component.define("medicationsSection");
        medicationsSection.templateRoot("2.16.840.1.113883.10.20.1.8");
        medicationsSection.fields([
            ["Medications", "0..*", MedicationActivity.xpath(), MedicationActivity]
        ]);
        medicationsSection.cleanupStep(cleanup.replaceWithField('medications'));
        return [medicationsSection, MedicationActivity];
    }
}

exports.medicationsSection = exportMedicationsSection;
exports.medicationsEntry = exportMedicationsSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],21:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
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
        ["email", "0..*", "../h:assignedEntity/" + shared.email.xpath(), shared.email],
        ["phone", "0..*", "../h:assignedEntity/" + shared.phone.xpath(), shared.phone]
    ]);

    var organization = component.define('organization');
    organization.fields([
        ["address", "0..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email]
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

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],22:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportPlanOfCareSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var date_time = component.define('date_time');
    date_time.fields([
        ["point", "1..1", "h:effectiveTime", shared.EffectiveTime]
    ]);

    var entry = component.define('entry');
    // observation, act, encounter, procedure
    entry.templateRoot(['2.16.840.1.113883.10.20.22.4.44',
        '2.16.840.1.113883.10.20.22.4.39',
        '2.16.840.1.113883.10.20.22.4.40',
        '2.16.840.1.113883.10.20.22.4.41',
        clinicalStatementsIDs.PlanOfCareActivity
    ]);
    entry.fields([
        ["plan", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ['type', "1..1", "h:templateId/@root"]
    ]);

    entry.cleanupStep(function () {
        var typeMap = {
            "2.16.840.1.113883.10.20.22.4.44": "observation", // ccda
            "2.16.840.1.113883.10.20.22.4.39": "act",
            "2.16.840.1.113883.10.20.22.4.40": "encounter",
            "2.16.840.1.113883.10.20.22.4.41": "procedure",
            "2.16.840.1.113883.10.20.1.25": "observation", // ccda-r1
            "2.16.840.1.113883.3.62.3.16.1": "act"
        };
        var t = this.js['type'];
        this.js['type'] = typeMap[t];
    });

    var plan_of_care_section = component.define('plan_of_care_section');
    plan_of_care_section.templateRoot([sectionIDs.PlanOfCareSection, sectionIDs.PlanOfCareSectionEntriesOptional]);
    plan_of_care_section.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    plan_of_care_section.cleanupStep(cleanup.replaceWithField('entry'));

    return [plan_of_care_section, entry];
}

exports.plan_of_care_section = exportPlanOfCareSection;
exports.plan_of_care_entry = exportPlanOfCareSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],23:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProblemsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    //These three elements aren't used right now, but can be refactored to use in standardized way.
    var AgeObservation = component.define("AgeObservation")
        .templateRoot("2.16.840.1.113883.10.20.22.4.31");

    var ProblemStatus = component.define("ProblemStatus")
        .templateRoot("2.16.840.1.113883.10.20.22.4.6")
        .fields([
            ["name", "0..1", "h:value/@displayName"],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ]);

    var HealthStatus = component.define("HealthStatus")
        .templateRoot("2.16.840.1.113883.10.20.22.4.5");

    var ProblemObservation = component.define("ProblemObservation2")
        .fields([
            //["name", "0..1", "@displayName"],
            //["code", "1..1", "@code"],
            //["system", "1..1", "@codeSystem"],
            //["code_system_name", "0..1", "@codeSystemName"],
            //["nullFlavor", "0..1", "@nullFlavor"],
            ["code", "0..1", "../h:value", shared.ConceptDescriptor],
            ["date_time", "0..1", "../h:effectiveTime", shared.EffectiveTime],
        ]);
    //.cleanupStep(cleanup.augmentConcept).cleanupStep(cleanup.removeField('system'));

    //TODO:  Cleanup/investigate negation status.
    var ProblemConcernAct = component.define("ProblemConcernAct")
        .templateRoot([clinicalStatementsIDs.ProblemObservation])
        .fields([
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:entryRelationship/h:observation/h:id", shared.Identifier],
            ["negation_indicator", "0..1", "h:entryRelationship/h:observation", shared.NegationIndicator],
            ["problem", "1:1", "h:entryRelationship/h:observation/h:value", ProblemObservation],
            ["onset_age", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value/@value"],
            ["onset_age_unit", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.31']/../h:value", shared.AgeDescriptor],
            ["status", "0..1", ProblemStatus.xpath(), ProblemStatus],
            ["patient_status", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
            ["source_list_identifiers", "0..*", "h:id", shared.Identifier],
        ]).withNegationStatus(true);
    //ProblemConcernAct.cleanupStep(cleanup.extractAllFields(['value']));

    var NonProblemObservation = ProblemConcernAct
        .define("ProblemObservation")
        .withNegationStatus(true);

    var ProblemOrganizer = component.define("ProblemOrganizer")
        .templateRoot([clinicalStatementsIDs.ProblemAct, clinicalStatementsIDs.ProblemConcernAct]);

    var problemsSection = component.define("problemsSection");
    problemsSection.templateRoot(["2.16.840.1.113883.10.20.22.2.5.1", "2.16.840.1.113883.10.20.1.11"]); // coded entries required
    problemsSection.fields([
        ["problems", "0..*", ProblemOrganizer.xpath(), ProblemConcernAct],
    ]);

    problemsSection.cleanupStep(cleanup.replaceWithField("problems"));
    return [problemsSection, ProblemConcernAct];
}

exports.problemsSection = exportProblemsSection;
exports.problemsEntry = exportProblemsSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],24:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProceduresSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    /*
    var organization = component.define('organization');
    organization.fields([
        ["name", "0:1", "h:name"],
        ["address", "0..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email]
    ]);

    //replaced with shared.assignedEntity to normalize with performer in other sections
    var provider = component.define('provider');
    provider.fields([
        ["address", "1..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["organization", "0..1", "h:representedOrganization", organization]
    ]);
    */

    var ProcedureSpecimen = component.define('ProcedureSpecimen')
        .fields([
            ["identifiers", "0..*", "h:specimenRole/h:id", shared.Identifier],
            ["code", "0..1", "h:specimenRole/h:specimenPlayingEntity/h:code", shared.ConceptDescriptor]
        ]);

    var entry = component.define('entry');
    entry.templateRoot(['2.16.840.1.113883.10.20.22.4.12', '2.16.840.1.113883.10.20.22.4.13', '2.16.840.1.113883.10.20.22.4.14', clinicalStatementsIDs.ProcedureActivity]);
    entry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode", shared.SimplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["body_sites", "0..*", "h:targetSiteCode", shared.ConceptDescriptor],
        ["specimen", "0..1", "h:specimen", ProcedureSpecimen],
        ["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performer", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ['procedure_type', "1..1", "h:templateId/@root"]
    ]);

    entry.cleanupStep(function () {
        var typeMap = {
            "2.16.840.1.113883.10.20.22.4.12": "act", // ccda
            "2.16.840.1.113883.10.20.22.4.13": "observation",
            "2.16.840.1.113883.10.20.22.4.14": "procedure",
            "2.16.840.1.113883.10.20.1.29": "procedure" // ccda-r1
        };
        var t = this.js['procedure_type'];
        this.js['procedure_type'] = typeMap[t];
    });

    var proceduresSection = component.define('proceduresSection');
    proceduresSection.templateRoot([sectionIDs.ProceduresSection, sectionIDs.ProceduresSectionEntriesOptional]);
    proceduresSection.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    proceduresSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [proceduresSection, entry];
}

exports.proceduresSection = exportProceduresSection;
exports.proceduresEntry = exportProceduresSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],25:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportResultsSection = function (version) {
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];
    var sectionIDs = bbm.CCDA["sections" + version];

    var referenceRange = component.define('referenceRange')
        .fields([
            ["low", "0..1", "h:value/h:low/@value"],
            ["high", "0..1", "h:value/h:high/@value"],
            ["unit", "0..1", "h:value/h:low/@unit"],
            ["range", "0..1", "h:text/text()"]
        ]);

    var ResultObservation = component.define("ResultObservation")
        .templateRoot(clinicalStatementsIDs["ResultObservation"])
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result", "1..1", "h:code", shared.ConceptDescriptor],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
            ["status", "1..1", "h:statusCode/@code"],
            ["reference_range", "0..1", "h:referenceRange/h:observationRange", referenceRange],
            //["codedValue", "0..1", "h:value[@xsi:type='CD']", shared.ConceptDescriptor],
            //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
            ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
        ]);
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['resultName']));

    // TODO: Accomodating both PQ and CD values needed
    ResultObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['codedValue']));

    var ResultsOrganizer = component.define("ResultsOrganizer")
        .templateRoot(clinicalStatementsIDs["ResultOrganizer"])
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result_set", "0..1", "h:code", shared.ConceptDescriptor],
            ["results", "1..*", ResultObservation.xpath(), ResultObservation]
        ]);
    //ResultsOrganizer.cleanupStep(cleanup.extractAllFields(['panelName']));

    var resultsSection = component.define("resultsSection");
    resultsSection.templateRoot([sectionIDs.ResultsSection, sectionIDs.ResultsSectionEntriesOptional]); // .1 for "entries required"
    resultsSection.fields([
        ["panels", "0..*", ResultsOrganizer.xpath(), ResultsOrganizer]
    ]);
    resultsSection.cleanupStep(cleanup.replaceWithField('panels'));

    return [resultsSection, ResultsOrganizer];
}

exports.resultsSection = exportResultsSection;
exports.resultsEntry = exportResultsSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],26:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportSocialHistorySection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var socialHistoryObservation = component.define("socialHistoryObservation")
        .templateRoot([
            clinicalStatementsIDs.SocialHistoryObservation, // the correct templateId (smoking status)
            clinicalStatementsIDs.SmokingStatusObservation,
            "2.16.840.1.113883.10.22.4.78", // incorrect id published in 1.1 DSTU
        ])
        .fields([
            //["value", "1..1", "h:code[@code!='ASSERTION']/@displayName"],//, shared.SimpleCode("2.16.840.1.113883.11.20.9.38")],
            //["value2", "1..1", "h:code[@code='ASSERTION']/@codeSystem"],//, shared.SimpleCode("2.16.840.1.113883.11.20.9.38")],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["code2", "0..1", "h:code[@code='ASSERTION']/@codeSystem"],
            //["observation_value", "0..1", "h:value/@xsi:type"]
            ["value", "0..1", "h:value[@xsi:type='ST']/text() | h:value[@xsi:type='CD']/@displayName"]
            //["observation_value2", "0..1", "h:value[@xsi:type='CD']/@displayName"]
        ]).cleanupStep(cleanup.replaceWithObject("code2", {
            "name": "Smoking Status"
        })).cleanupStep(cleanup.renameField("code2", "code"));

    // when other flavors of social history is implemented (pregnancy, social observation, tobacco use) 
    // this should probably be structured similar to procedures with types.  if another structure
    // is chosen procedures need to be updated as well.
    var socialHistorySection = component.define("socialHistorySection")
        .templateRoot([sectionIDs.SocialHistorySection, sectionIDs.SocialHistorySectionEntriesOptional])
        .fields([
            ["smoking_statuses", "0..*", socialHistoryObservation.xpath(), socialHistoryObservation]
        ]);
    socialHistorySection.cleanupStep(cleanup.replaceWithField('smoking_statuses'));

    return [socialHistorySection, socialHistoryObservation];
}
exports.socialHistorySection = exportSocialHistorySection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],27:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportVitalSignsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var VitalSignObservation = component.define("VitalSignObservation")
        .templateRoot(clinicalStatementsIDs.VitalSignObservation)
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier], //this one is stripped out by "paredown" cleanup step in component.js
            ["vital", "1..1", "h:code", shared.ConceptDescriptor],
            //["identifiers","0..*", "h:id", shared.Identifier], //dup with first line
            ["status", "1..1", "h:statusCode/@code"],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
            //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
            ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
        ]);
    //VitalSignObservation.cleanupStep(cleanup.extractAllFields(['code']));
    VitalSignObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));

    var vitalSignsSection = component.define("vitalSignsSection");
    vitalSignsSection.templateRoot([sectionIDs.VitalSignsSection, sectionIDs.VitalSignsSectionEntriesOptional]);
    vitalSignsSection.fields([
        ["entry", "0..*", VitalSignObservation.xpath(), VitalSignObservation]
    ]);
    vitalSignsSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [vitalSignsSection, VitalSignObservation];
}

// var VitalSignObservation = component.define("VitalSignObservation")
//     .templateRoot(clinicalStatementsIDs.VitalSignObservation)
//     .fields([
//         ["identifiers", "0..*", "h:id", shared.Identifier], //this one is stripped out by "paredown" cleanup step in component.js
//         ["vital", "1..1", "h:code", shared.ConceptDescriptor],
//         //["identifiers","1..*", "h:id", shared.Identifier], //dup with first line
//         ["status", "1..1", "h:statusCode/@code"],
//         ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
//         ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
//         //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
//         ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
//     ]);
//   //VitalSignObservation.cleanupStep(cleanup.extractAllFields(['code']));
//   VitalSignObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));

/*
  //Vitals organizer is not used (flattened out in JSON model)
  var VitalSignsOrganizer = component.define("VitalSignsOrganizer")
  .templateRoot("2.16.840.1.113883.10.20.22.4.26")
  .fields([
    ["panelName","0..1", "h:code", shared.ConceptDescriptor],
    ["sourceIds","1..*", "h:id", shared.Identifier],
    ["vitals", "1..*", VitalSignObservation.xpath(), VitalSignObservation]
  ]);
  
  
  exports.VitalSignsSection = Component.define("VitalSignsSection")
  .templateRoot("2.16.840.1.113883.10.20.22.2.4.1")
  .fields([
    //["name","0..1", "h:code", shared.ConceptDescriptor],
    //["panels","0..*", VitalSignsOrganizer.xpath(), VitalSignsOrganizer],
    ["vitals","0..*", VitalSignObservation.xpath(), VitalSignObservation],
  ]);
  */

exports.vitalSignsSection = exportVitalSignsSection;

exports.vitalSignsEntry = exportVitalSignsSection;

},{"../cleanup":15,"../shared":28,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],28:[function(require,module,exports){
"use strict";

var component = require("blue-button-xml").component;
var processor = require("blue-button-xml").processor;
var cleanup = require("./cleanup");
var common = require("blue-button-xml").common;

var commonShared = require('../common/shared');

var shared = module.exports = Object.create(commonShared);

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
        ["identifiers", "0..*", "h:id", Identifier],
        ["name", "0..*", "h:name/text()"],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["phone", "0..*", shared.phone.xpath(), shared.phone]
    ]);

var assignedEntity = shared.assignedEntity = component.define("assignedEntity")
    .fields([
        ["identifiers", "0..*", "h:id", Identifier],
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

},{"../common/shared":41,"./cleanup":15,"blue-button-xml":"blue-button-xml"}],29:[function(require,module,exports){
"use strict";

var component = require("blue-button-xml").component;
var shared = require("./shared");

var exportCCD = function (version) {
    var patient = require("./demographics").patient;
    var resultsSection = require("./sections/results").resultsSection(version)[0];
    var problemsSection = require("./sections/problems").problemsSection(version)[0];
    var encountersSection = require("./sections/encounters").encountersSection(version)[0];
    var proceduresSection = require("./sections/procedures").proceduresSection(version)[0];
    var medicationsSection = require("./sections/medications").medicationsSection(version)[0];
    var providersSection = require("./sections/providers").providersSection(version)[0];
    var payers_section = require("./sections/payers").payers_section(version)[0];

    return component.define("CCD")
        .fields([
            ["doc_identifiers", "0..*", "h:id", shared.Identifier],
            ["demographics", "1..1", "(/ | //h:recordTarget/h:patientRole)[last()]", patient],
            ["providers", "0..*", "//h:documentationOf/h:serviceEvent/h:performer", providersSection],
            ["problems", "0..1", problemsSection.xpath(), problemsSection],
            ["encounters", "0..1", encountersSection.xpath(), encountersSection],
            ["medications", "0..1", medicationsSection.xpath(), medicationsSection],
            ["procedures", "0..1", proceduresSection.xpath(), proceduresSection],
            ["results", "0..1", resultsSection.xpath(), resultsSection],
            ["payers", "0..1", payers_section.xpath(), payers_section],
        ]);

}

exports.CCD = exportCCD;

},{"./demographics":31,"./sections/encounters":32,"./sections/medications":33,"./sections/payers":34,"./sections/problems":35,"./sections/procedures":36,"./sections/providers":37,"./sections/results":38,"./shared":39,"blue-button-xml":"blue-button-xml"}],30:[function(require,module,exports){
"use strict";

var includeCleanup = require("../common/cleanup");

var cleanup = module.exports = Object.create(includeCleanup);

cleanup.augmentObservation = function () {

    if (this.js.problem_text) {
        if (this.js.problem_text.js) {
            if (!this.js.code.js.name) {
                this.js.code.js.name = this.js.problem_text.js;
            }
        }
    }

}

},{"../common/cleanup":40}],31:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./shared":39,"/Work/git/blue-button/lib/parser/c32/demographics.js":4,"blue-button-xml":"blue-button-xml"}],32:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportEncountersSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var finding = component.define("finding");
    finding.templateRoot("2.16.840.1.113883.10.20.1.28");
    finding.fields([
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["value", "1..1", "h:value", shared.ConceptDescriptor],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime]
    ]);

    // Iff needed add this later by refactoring Problem Observation from Problems.  They should share.
    //var diagnosis = component.define("diagnosis");
    //finding.templateRoot(['2.16.840.1.113883.10.20.22.4.80']);
    //finding.fields([
    //  ["code", "1..1", "h:code", shared.ConceptDescriptor]
    //]);
    //finding.cleanupStep(cleanup.extractAllFields(['code']));

    var activity = component.define('activity');
    activity.templateRoot(["2.16.840.1.113883.10.20.1.21"]);
    activity.fields([
        ["encounter", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
        ["performers", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        ["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ["findings", "0..*", finding.xpath(), finding]
        //["diagnoses", "0..*", diagnosis.xpath(), diagnosis]
    ]);

    var encountersSection = component.define('encountersSection');
    encountersSection.templateRoot(["2.16.840.1.113883.10.20.1.3"]);
    encountersSection.fields([
        ["activity", "0..*", activity.xpath(), activity]
    ]);
    encountersSection.cleanupStep(cleanup.replaceWithField(["activity"]));
    return [encountersSection, activity];
}
exports.encountersSection = exportEncountersSection;
exports.encountersEntry = exportEncountersSection;

},{"../cleanup":30,"../shared":39,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],33:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var processor = require("blue-button-xml").processor;
var bbm = require("blue-button-meta");

var exportMedicationsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var MedicationInterval = component.define("MedicationInterval")
        .fields([
            ["phase", "0..1", "./h:phase", shared.EffectiveTime],
            ["period", "0..1", "./h:period", shared.PhysicalQuantity],
            ["alignment", "0..1", "./@alignment"],
            ["frequency", "0..1", "./@institutionSpecified", processor.asBoolean],
            ["event", "0..1", "./h:event/@code", shared.SimpleCode("2.16.840.1.113883.5.139")],
            ["event_offset", "0..1", "./h:offset", shared.EventOffset]
        ]);

    var MedicationAdministration = component.define("MedicationAdministration")
        .fields([
            ["route", "0..1", "h:routeCode", shared.ConceptDescriptor],
            ["site", "0..1", "h:approachSiteCode", shared.ConceptDescriptor],
            ["form", "0..1", "h:administrationUnitCode", shared.ConceptDescriptor],
            ["dose", "0..1", "h:doseQuantity", shared.PhysicalQuantity],
            ["rate", "0..1", "h:rateQuantity", shared.PhysicalQuantity],
            ["dose_restriction", "0..1", "h:maxDoseQuantity", shared.PhysicalQuantity],
            ["interval", "0..1", "h:effectiveTime[@operator='A']", MedicationInterval],
        ]);

    var MedicationIndication = component.define("MedicationIndication")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["value", "0..1", "h:value", shared.ConceptDescriptor]
        ]);

    var MedicationPrecondition = component.define("MedicationPrecondition")
        .fields([
            ["code", "0..1", "h:code", shared.ConceptDescriptor],
            ["text", "0..1", "h:text"],
            ["value", "0..1", "h:value", shared.ConceptDescriptor]
        ]);

    var author = component.define("author")
        .fields([
            ["date_time", "0..1", "h:time", shared.EffectiveTime],
            ["identifiers", "0..*", "h:assignedAuthor/h:id", shared.Identifier],
            ["organization", "0..1", "h:assignedAuthor/h:representedOrganization", shared.Organization]
        ]);

    var MedicationInformation = component.define("MedicationInformation")
        .templateRoot("2.16.840.1.113883.10.20.22.4.23")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["unencoded_name", "0..1", "h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
            ["product", "1..1", "h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
            ["manufacturer", "0..1", "h:manufacturerOrganization/h:name"]
        ]);

    var MedicationSupplyOrder = component.define("MedicationSupplyOrder")
        .fields([
            ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["repeatNumber", "0..1", "h:repeatNumber/@value"],
            ["quantity", "0..1", "h:quantity/@value"],
            ["status", "0..1", "h:status/@code"],
            ["author", "0..1", "h:author", author] //, instructions use references, which are not supported (also samples don't have good data for it)
            //["instructions", "0..1", "h:entryRelationship[@typeCode='SUBJ']/h:act", MedicationInstructions]
        ]);

    var MedicationPerformer = component.define("MedicationPerformer")
        .fields([
            ["identifiers", "0..*", "h:assignedEntity/h:id", shared.Identifier],
            ["address", "0..*", "h:assignedEntity/h:addr", shared.Address],
            ["phone", "0..1", "h:assignedEntity/" + shared.phone.xpath(), shared.phone],
            ["organization", "0..*", "h:assignedEntity/h:representedOrganization", shared.Organization]
        ]);
    /*
        var MedicationDrugVehicle = component.define("MedicationDrugVehicle")
            .templateRoot("2.16.840.1.113883.10.20.22.4.24")
            .fields([
                ["playingEntity", "0..1", "h:playingEntity/h:code", shared.ConceptDescriptor]
            ]).cleanupStep(cleanup.extractAllFields(["drug_vehicle"]));
*/
    var MedicationInstructions = component.define("MedicationInstructions")
        .fields([
            ["code", "0..1", "../h:code", shared.ConceptDescriptor],
            ["freeText", "0..1", "../h:text", shared.TextWithReference]
        ]);

    var MedicationDispense = component.define("MedicationDispense")
        .templateRoot("2.16.840.1.113883.10.20.22.4.18")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["performer", "0..1", "h:performer", MedicationPerformer],
            ["supply", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply", MedicationSupplyOrder]
        ]);

    var MedicationActivity = component.define("MedicationActivity")
        .templateRoot("2.16.840.1.113883.10.20.1.34")
        .fields([
            ["date_time", "0..1", "h:effectiveTime[not (@operator='A')]", shared.EffectiveTime],
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["status", "1..1", "./../h:supply/@moodCode"],
            //["sig", "0..1", "h:text", shared.TextWithReference],
            ["product", "1..1", "h:product/h:manufacturedProduct", MedicationInformation],
            ["supply", "0..1", "./../h:supply", MedicationSupplyOrder],
            //["administration", "0..1", "../h:substanceAdministration", MedicationAdministration],
            //["performer", "0..1", "h:performer", MedicationPerformer],
            //["drug_vehicle", "0..1", "h:participant[@typeCode='CSM']/h:participantRole/h:playingEntity[@classCode='MMAT']/h:code", shared.ConceptDescriptor],
            //["precondition", "1..1", "h:precondition/h:criterion", MedicationPrecondition],
            //["indication", "0..1", "h:entryRelationship[@typeCode='RSON']/h:observation", MedicationIndication],
            //["instructions", "0..1", "h:entryRelationship[@typeCode='REFR']/h:supply/*/*/h:templateId[@root='2.16.840.1.113883.10.20.22.4.20']", MedicationInstructions],
            //["dispense", "0..1", MedicationDispense.xpath(), MedicationDispense]
        ])
        //.cleanupStep(Cleanup.extractAllFields(["medicationName"]))
        .cleanupStep(function () {

            //Cleanup Status.

            if (this.js.status === "EVN") {
                this.js.status = "Completed";
            }
            if (this.js.status === "INT") {
                this.js.status = "Prescribed";
            }

            // separate out two effectiveTimes

            /*
          // 1.  startDate --- endDate
          var range = this.js.times.filter(function(t){
            return -1 === ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
          });

          // 2.  dosing interval
          var period= this.js.times.filter(function(t){
            return -1 !== ['PIVL_TS', 'EIVL_TS'].indexOf(t.js.xsitype);
          });

          delete this.js.times;

          if (range.length > 0) {
            this.js.dateRange = range[0];
          }

          if (period.length > 0) {
            this.js.dosePeriod = period[0].js.period;
          }*/

        });

    var medicationsSection = component.define("medicationsSection");
    medicationsSection.templateRoot(["2.16.840.1.113883.10.20.1.8"]);
    medicationsSection.fields([
        ["medications", "0..*", MedicationActivity.xpath(), MedicationActivity]
    ]);
    medicationsSection.cleanupStep(cleanup.replaceWithField('medications'));
    return [medicationsSection, MedicationActivity];

}

exports.medicationsSection = exportMedicationsSection;
exports.medicationsEntry = exportMedicationsSection;

},{"../cleanup":30,"../shared":39,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],34:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
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
        ["email", "0..*", "../h:assignedEntity/" + shared.email.xpath(), shared.email],
        ["phone", "0..*", "../h:assignedEntity/" + shared.phone.xpath(), shared.phone]
    ]);

    var organization = component.define('organization');
    organization.fields([
        ["address", "0..1", "h:addr", shared.Address],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email]
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
    entry.templateRoot("2.16.840.1.113883.10.20.1.20");
    entry.fields([
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["policy", "1..1", "h:entryRelationship/h:act", policy],
        ["guarantor", "1..1", "h:entryRelationship/h:act/h:performer/h:templateId[not (@root='2.16.840.1.113883.10.20.22.4.87')]", guarantor],
        ["participant", "1..1", "h:entryRelationship/h:act/h:participant", participant],
        ["policy_holder", "1..1", "h:entryRelationship/h:act/h:participant[not (@typeCode='COV')]", policy_holder],
        ["authorization", "1..1", "h:entryRelationship/h:act/h:entryRelationship/h:act", authorization]
    ]);

    var payers_section = component.define('payers_section');
    payers_section.templateRoot("2.16.840.1.113883.10.20.1.9");
    payers_section.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    payers_section.cleanupStep(cleanup.replaceWithField('entry'));

    return [payers_section, entry];
}

exports.payers_section = exportPayersSection;
exports.payers_entry = exportPayersSection;

},{"../cleanup":30,"../shared":39,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],35:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProblemsSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    //These three elements aren't used right now, but can be refactored to use in standardized way.
    var AgeObservation = component.define("AgeObservation")
        .templateRoot("2.16.840.1.113883.10.20.1.38");

    var ProblemStatus = component.define("ProblemStatus")
        .templateRoot("2.16.840.1.113883.10.20.1.50")
        .fields([
            ["name", "0..1", "h:value/@displayName"],
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ]);

    var ProblemObservation = component.define("ProblemObservation")
        .fields([
            ["code", "0..1", "../h:value", shared.ConceptDescriptor],
            ["problem_text", "0..1", "../h:text", shared.TextWithReference],
            ["date_time", "0..1", "../h:effectiveTime", shared.EffectiveTime],
        ]).cleanupStep(cleanup.augmentObservation).cleanupStep(cleanup.removeField("problem_text"));

    //TODO:  Cleanup/investigate negation status.
    var ProblemConcernAct = component.define("ProblemConcernAct")
        .fields([
            ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
            ["identifiers", "0..*", "h:entryRelationship/h:observation/h:id", shared.Identifier],
            ["negation_indicator", "0..1", "h:entryRelationship/h:observation", shared.NegationIndicator],
            ["problem", "1:1", "h:entryRelationship/h:observation/h:value", ProblemObservation],
            ["onset_age", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.1 13883.10.20.1.38']/../h:value/@value"],
            ["onset_age_unit", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.1 13883.10.20.1.38']/../h:value", shared.AgeDescriptor],
            ["status", "0..1", ProblemStatus.xpath(), ProblemStatus],
            //Patient Status not supported.
            //["patient_status", "0..1", "h:entryRelationship/h:observation/h:entryRelationship/h:observation/h:templateId[@root='2.16.840.1.113883.10.20.22.4.5']/../h:value/@displayName"],
            ["source_list_identifiers", "0..*", "h:id", shared.Identifier],
        ]).withNegationStatus(true);
    //ProblemConcernAct.cleanupStep(cleanup.extractAllFields(['value']));

    var NonProblemObservation = ProblemConcernAct
        .define("ProblemObservation")
        .withNegationStatus(true);

    var ProblemOrganizer = component.define("ProblemOrganizer")
        .templateRoot(["2.16.840.1.113883.10.20.1.27"]);

    var problemsSection = component.define("problemsSection");
    problemsSection.templateRoot(["2.16.840.1.113883.10.20.1.11"]); // coded entries required
    problemsSection.fields([
        ["problems", "0..*", ProblemOrganizer.xpath(), ProblemConcernAct],
    ]);

    problemsSection.cleanupStep(cleanup.replaceWithField("problems"));
    return [problemsSection, ProblemConcernAct];
}

exports.problemsSection = exportProblemsSection;
exports.problemsEntry = exportProblemsSection;

},{"../cleanup":30,"../shared":39,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],36:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportProceduresSection = function (version) {
    var sectionIDs = bbm.CCDA["sections" + version];
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];

    var entry = component.define('entry');
    entry.templateRoot(["2.16.840.1.113883.10.20.1.29"]);
    entry.fields([
        ["procedure", "1..1", "h:code", shared.ConceptDescriptor],
        ["identifiers", "0..*", "h:id", shared.Identifier],
        ["status", "1..1", "h:statusCode", shared.SimplifiedCodeOID('2.16.840.1.113883.11.20.9.22')],
        ["date_time", "0..1", "h:effectiveTime", shared.EffectiveTime],
        ["body_sites", "0..*", "h:targetSiteCode", shared.ConceptDescriptor],

        //Doesn't appear in sample data.
        //["specimen", "0..1", "h:specimen", ProcedureSpecimen],
        //Doesn't appear in sample data.
        //["priority", "0..1", "h:priorityCode", shared.ConceptDescriptor],
        ["performer", "0..*", "h:performer/h:assignedEntity", shared.assignedEntity],
        //Doesn't appear in sample data.
        //["locations", "0..*", "h:participant/h:participantRole", shared.serviceDeliveryLocation],
        ['procedure_type', "1..1", "h:templateId/@root"]
    ]);

    entry.cleanupStep(function () {
        var typeMap = {
            "2.16.840.1.113883.10.20.1.29": "procedure" // ccda-r1
        };
        var t = this.js['procedure_type'];
        this.js['procedure_type'] = typeMap[t];
    });

    var proceduresSection = component.define('proceduresSection');
    proceduresSection.templateRoot(["2.16.840.1.113883.10.20.1.12"]);
    proceduresSection.fields([
        ["entry", "0..*", entry.xpath(), entry]
    ]);
    proceduresSection.cleanupStep(cleanup.replaceWithField('entry'));
    return [proceduresSection, entry];
}

exports.proceduresSection = exportProceduresSection;
exports.proceduresEntry = exportProceduresSection;

},{"../cleanup":30,"../shared":39,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],37:[function(require,module,exports){
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
            ["phone", "0..*", "h:assignedEntity/" + shared.phone.xpath(), shared.phone],
            ["email", "0..*", "h:assignedEntity/" + shared.email.xpath(), shared.email],
            ["organization", "0..1", "h:assignedEntity/h:representedOrganization", shared.Organization]
        ]);

    return [providers]
}

exports.providersSection = exportProvidersSection;

},{"../cleanup":30,"../shared":39,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],38:[function(require,module,exports){
"use strict";

var shared = require("../shared");
var component = require("blue-button-xml").component;
var cleanup = require("../cleanup");
var bbm = require("blue-button-meta");

var exportResultsSection = function (version) {
    var clinicalStatementsIDs = bbm.CCDA["statements" + version];
    var sectionIDs = bbm.CCDA["sections" + version];

    var referenceRange = component.define('referenceRange')
        .fields([
            ["low", "0..1", "h:value/h:low/@value"],
            ["high", "0..1", "h:value/h:high/@value"],
            ["unit", "0..1", "h:value/h:low/@unit"],
            ["range", "0..1", "h:text/text()"]
        ]);

    var ResultObservation = component.define("ResultObservation")
        .templateRoot("2.16.840.1.113883.10.20.1.31")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result", "1..1", "h:code", shared.ConceptDescriptor],
            ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
            ["physicalQuantity", "1..1", "h:value[@xsi:type='PQ']", shared.PhysicalQuantity],
            ["status", "1..1", "h:statusCode/@code"],
            ["text", "0..1", "h:value[@xsi:type='ST']"],
            ["reference_range", "0..1", "h:referenceRange/h:observationRange", referenceRange],
            //["codedValue", "0..1", "h:value[@xsi:type='CD']", shared.ConceptDescriptor],
            //["freeTextValue", "0..1", "h:text", shared.TextWithReference],
            ["interpretations", "0..*", "h:interpretationCode[@codeSystem='2.16.840.1.113883.5.83']", shared.SimplifiedCode]
        ]);
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['resultName']));

    // TODO: Accomodating both PQ and CD values needed
    ResultObservation.cleanupStep(cleanup.extractAllFields(['physicalQuantity']));
    //ResultObservation.cleanupStep(cleanup.extractAllFields(['codedValue']));

    var ResultsOrganizer = component.define("ResultsOrganizer")
        .templateRoot("2.16.840.1.113883.10.20.1.32")
        .fields([
            ["identifiers", "0..*", "h:id", shared.Identifier],
            ["result_set", "0..1", "h:code", shared.ConceptDescriptor],
            ["results", "1..*", ResultObservation.xpath(), ResultObservation]
        ]);
    //ResultsOrganizer.cleanupStep(cleanup.extractAllFields(['panelName']));

    var resultsSection = component.define("resultsSection");
    resultsSection.templateRoot(['2.16.840.1.113883.10.20.1.14']); // .1 for "entries required"
    resultsSection.fields([
        ["panels", "0..*", ResultsOrganizer.xpath(), ResultsOrganizer]
    ]);
    resultsSection.cleanupStep(cleanup.replaceWithField('panels'));

    return [resultsSection, ResultsOrganizer];
}

exports.resultsSection = exportResultsSection;
exports.resultsEntry = exportResultsSection;

},{"../cleanup":30,"../shared":39,"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],39:[function(require,module,exports){
"use strict";

var component = require("blue-button-xml").component;
var processor = require("blue-button-xml").processor;
var cleanup = require("./cleanup");
var common = require("blue-button-xml").common;

var commonShared = require('../common/shared');

var shared = module.exports = Object.create(commonShared);

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
        ["identifiers", "0..*", "h:id", Identifier],
        ["name", "0..*", "h:name/text()"],
        ["address", "0..*", "h:addr", Address],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["phone", "0..*", shared.phone.xpath(), shared.phone]
    ]);

var assignedEntity = shared.assignedEntity = component.define("assignedEntity")
    .fields([
        ["identifiers", "0..*", "h:id", Identifier],
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

},{"../common/shared":41,"./cleanup":30,"blue-button-xml":"blue-button-xml"}],40:[function(require,module,exports){
"use strict";

var bbxml = require("blue-button-xml");
var bbm = require("blue-button-meta");

var css = bbm.code_systems;

var includeCleanup = bbxml.cleanup;
var processor = bbxml.processor;
var common = bbxml.common;
var xmlUtil = bbxml.xmlUtil;

var cleanup = module.exports = Object.create(includeCleanup);

var resolveReference = cleanup.resolveReference = function () {
    if (!common.exists(this.js)) {
        return;
    }

    var r = this.js.reference && this.js.reference.match(/#(.*)/);
    var resolved = null;
    if (r && r.length == 2) {
        resolved = xmlUtil.xpath(this.node, "//*[@ID='" + r[1] + "']/text()");
    }
    var ret = null;
    if (resolved && resolved.length === 1) {
        ret = processor.asString(resolved[0]);
    } else {
        this.js.text = this.js.text && this.js.text.join("").match(/\s*(.*)\s*/)[1];
        ret = this.js.text;
    }

    this.js = ret || null;
};

var augmentAge = cleanup.augmentAge = function () {
    var units = this.js.units;
    if (units) {
        var cs = css.find("2.16.840.1.113883.11.20.9.21");
        if (cs) {
            var value = cs.codeDisplayName(units);
            if (value) {
                this.js = value;
            }
        }
    }
};

cleanup.augmentSimpleCode = function (oid) {
    var f = function () {
        if (this.js) {
            var cs = css.find(oid);
            if (cs) {
                this.js = cs.codeDisplayName(this.js);
            }
        }
    };
    return f;
};

var augmentIndividualName = cleanup.augmentIndividualName = function () {
    if (this.js) {
        if (this.js.middle && this.js.middle.length > 0) {
            this.js.first = this.js.middle[0];
            if (this.js.middle.length > 1) {
                this.js.middle.splice(0, 1);
            } else {
                delete this.js.middle;
            }
        }
        if (!this.js.first && !this.js.last && this.js.freetext_name) {
            var names = this.js.freetext_name.split(' ').filter(function (piece) {
                return piece.length > 0;
            });
            var n = names.length;
            if (n > 0) {
                this.js.last = names[n - 1];
                if (n > 1) {
                    this.js.first = names[0];
                }
                if (n > 2) {
                    this.js.middle = names.slice(1, n - 1);
                }
            }
        }
        delete this.js.freetext_name;
    }
};

cleanup.augmentConcept = function () {
    if (!this.js) {
        this.js = {};
    }

    if (common.exists(this.js.nullFlavor) && !this.js.original_text) {
        this.js = null;
        return;
    }

    if (this.js.system) {
        var cs = css.find(this.js.system);
        if (cs) {
            // Keep existing name if present
            if (!common.exists(this.js.name)) {
                var newName = cs.codeDisplayName(this.js.code);
                if (newName) {
                    this.js.name = newName;
                }
            }
            // but preferentially use our canonical names for the coding system
            var systemName = cs.name();
            if (systemName) {
                this.js.code_system_name = systemName;
            }
        }
    }

    //If original text is present w/out name, use it.
    if (this.js.original_text && !this.js.name) {
        this.js.name = this.js.original_text.js;
        delete this.js.original_text;
    } else {
        delete this.js.original_text;
    }

    if (this.js.nullFlavor) {
        delete this.js.nullFlavor;
    }
};

cleanup.augmentEffectiveTime = function () {
    if (this.js) {
        var returnArray = {};

        if (this.js.point) {
            returnArray.point = {
                "date": this.js.point,
                "precision": this.js.point_resolution
            };
        }

        if (this.js.low) {
            returnArray.low = {
                "date": this.js.low,
                "precision": this.js.low_resolution
            };
        }

        if (this.js.high) {
            returnArray.high = {
                "date": this.js.high,
                "precision": this.js.high_resolution
            };
        }

        if (this.js.center) {
            returnArray.center = {
                "date": this.js.center,
                "precision": this.js.center_resolution
            };
        }

        this.js = returnArray;
    }
};

cleanup.augmentSimplifiedCode = function () {
    if (this.js) {
        // TODO: look up; don't trust the name to be present...
        this.js = this.js.name;
    }
};

cleanup.augmentSimplifiedCodeOID = function (oid) {
    var f = function () {
        if (this.js) {
            if (this.js.name) {
                this.js = this.js.name;
            } else if (this.js.code) {
                var cs = css.find(oid);
                if (cs) {
                    var name = cs.codeDisplayName(this.js.code);
                    if (name) {
                        this.js = name;
                    }
                }
            } else {
                this.js = null;
            }
        }
    };
    return f;
};

},{"blue-button-meta":44,"blue-button-xml":"blue-button-xml"}],41:[function(require,module,exports){
"use strict";

var bbxml = require("blue-button-xml");

var component = bbxml.component;
var processor = bbxml.processor;

var cleanup = require('./cleanup');

var shared = module.exports = {};

var simpleCode = shared.SimpleCode = function (oid) {
    var r = component.define("SimpleCode." + oid);
    r.fields([]);
    r.cleanupStep(cleanup.augmentSimpleCode(oid));
    return r;
};

var email = shared.email = component.define("email");
email.fields([
    ["address", "1..1", "@value"],
    ["type", "0..1", "@use", simpleCode("2.16.840.1.113883.5.1119")]
]);
email.cleanupStep(function () {
    if (this.js && this.js.address) {
        this.js.address = this.js.address.substring(7);

        //NOTE: type for email should be empty (per PragueExpat)
        if (this.js.type) {
            this.js.type = '';
        }
    }
});
email.setXPath("h:telecom[starts-with(@value, 'mailto:')]")

var phone = shared.phone = component.define("phone");
phone.fields([
    ["number", "1..1", "@value"],
    ["type", "0..1", "@use", simpleCode("2.16.840.1.113883.5.1119")]
]);
phone.cleanupStep(function () {
    if (this.js && this.js.number) {
        if (this.js.number.substring(0, 4) === "tel:") {
            this.js.number = this.js.number.substring(4);
        }
    }
});
phone.setXPath("h:telecom[not(starts-with(@value, 'mailto:'))]")

},{"./cleanup":40,"blue-button-xml":"blue-button-xml"}],42:[function(require,module,exports){
//CCDA to JSON parser.

"use strict";

var componentRouter = function (componentName, type) {

    if (componentName) {
        return generateComponents(type["type"])[componentName];
    } else {

        if (type["type"] === 'c32') {
            return generateComponents(type["type"]).c32_ccd;
        } else if (type["type"] === 'cda') {
            return generateComponents(type["type"]).cda_ccd;
        } else {
            return generateComponents(type["type"]).ccda_ccd;
        }
    }
};

var generateComponents = function (version) {

    version = version.indexOf("-") > -1 ? "_" + version.split("-")[1] : "";

    return {

        //Base CCD Object.
        cda_ccd: require("./cda/ccd").CCD(version),

        //Base C32 Object.
        c32_ccd: require("./c32/ccd").C32(version),
        c32_demographics: require("./c32/demographics").patient,
        c32_vitals: require("./c32/sections/vitals").vitalSignsSection,
        c32_medications: require("./c32/sections/medications").medicationsSection,
        c32_problems: require("./c32/sections/problems").problemsSection,
        c32_immunizations: require("./c32/sections/immunizations").immunizationsSection,
        c32_results: require("./c32/sections/results").resultsSection,
        c32_allergies: require("./c32/sections/allergies").allergiesSection,
        c32_encounters: require("./c32/sections/encounters").encountersSection,
        c32_procedures: require("./c32/sections/procedures").proceduresSection,

        //exposing individual entries just in case
        c32_vitals_entry: require("./c32/sections/vitals").vitalSignsEntry,
        c32_medications_entry: require("./c32/sections/medications").medicationsEntry,
        c32_problems_entry: require("./c32/sections/problems").problemsEntry,
        c32_immunizations_entry: require("./c32/sections/immunizations").immunizationsEntry,
        c32_results_entry: require("./c32/sections/results").resultsEntry,
        c32_allergies_entry: require("./c32/sections/allergies").allergiesEntry,
        c32_encounters_entry: require("./c32/sections/encounters").encountersEntry,
        c32_procedures_entry: require("./c32/sections/procedures").proceduresEntry,

        //CCDA domains.
        ccda_ccd: require("./ccda/ccd").CCD(version),
        ccda_demographics: require("./ccda/demographics").patient,
        ccda_vitals: require("./ccda/sections/vitals").vitalSignsSection(version)[0],
        ccda_medications: require("./ccda/sections/medications").medicationsSection(version)[0],
        ccda_problems: require("./ccda/sections/problems").problemsSection(version)[0],
        ccda_immunizations: require("./ccda/sections/immunizations").immunizationsSection(version)[0],
        ccda_results: require("./ccda/sections/results").resultsSection(version)[0],
        ccda_allergies: require("./ccda/sections/allergies").allergiesSection(version)[0],
        ccda_encounters: require("./ccda/sections/encounters").encountersSection(version)[0],
        ccda_procedures: require("./ccda/sections/procedures").proceduresSection(version)[0],
        ccda_social_history: require("./ccda/sections/social_history").socialHistorySection(version)[0],
        ccda_plan_of_care: require("./ccda/sections/plan_of_care").plan_of_care_section(version)[0],
        ccda_payers: require("./ccda/sections/payers").payers_section(version)[0],

        //exposing individual entries just in case
        ccda_vitals_entry: require("./ccda/sections/vitals").vitalSignsEntry(version)[1],
        ccda_medications_entry: require("./ccda/sections/medications").medicationsEntry(version)[1],
        ccda_problems_entry: require("./ccda/sections/problems").problemsEntry(version)[1],
        ccda_immunizations_entry: require("./ccda/sections/immunizations").immunizationsEntry(version)[1],
        ccda_results_entry: require("./ccda/sections/results").resultsEntry(version)[1],
        ccda_allergies_entry: require("./ccda/sections/allergies").allergiesEntry(version)[1],
        ccda_encounters_entry: require("./ccda/sections/encounters").encountersEntry(version)[1],
        ccda_procedures_entry: require("./ccda/sections/procedures").proceduresEntry(version)[1],
        ccda_plan_of_care_entry: require("./ccda/sections/plan_of_care").plan_of_care_entry(version)[1],
        ccda_payers_entry: require("./ccda/sections/payers").payers_entry(version)[1],

    };
}

module.exports.componentRouter = componentRouter;

},{"./c32/ccd":2,"./c32/demographics":4,"./c32/sections/allergies":5,"./c32/sections/encounters":6,"./c32/sections/immunizations":7,"./c32/sections/medications":8,"./c32/sections/problems":9,"./c32/sections/procedures":10,"./c32/sections/results":11,"./c32/sections/vitals":12,"./ccda/ccd":14,"./ccda/demographics":16,"./ccda/sections/allergies":17,"./ccda/sections/encounters":18,"./ccda/sections/immunizations":19,"./ccda/sections/medications":20,"./ccda/sections/payers":21,"./ccda/sections/plan_of_care":22,"./ccda/sections/problems":23,"./ccda/sections/procedures":24,"./ccda/sections/results":25,"./ccda/sections/social_history":26,"./ccda/sections/vitals":27,"./cda/ccd":29}],43:[function(require,module,exports){
//sense.js - Determining file content type e.g. CCDA or C32 or BB.json/JSON or text/other formats.

"use strict";

var xml = require("blue-button-xml").xmlUtil;

//Sense document type based on XML object
var senseXml = function (doc) {
    //data must be an object
    if (!doc || typeof (doc) !== "object") {
        //TODO: throw a proper error here
        return null;
    }

    var c32Result = xml.xpath(doc, 'h:templateId[@root=\"2.16.840.1.113883.3.88.11.32.1\"]');
    if (c32Result && c32Result.length > 0) {
        return {
            type: "c32"
        };
    }

    var cdaResult = xml.xpath(doc, 'h:templateId[@root=\"2.16.840.1.113883.10.20.1\"]');
    var cdaTemplateResult = xml.xpath(doc, 'h:code[@code=\"34133-9\"][@codeSystem=\"2.16.840.1.113883.6.1\"]');
    if ((cdaResult && cdaResult.length > 0) && (cdaTemplateResult && cdaTemplateResult.length > 0)) {
        return {
            type: "cda"
        };
    }

    var ccdResult = xml.xpath(doc, 'h:templateId[@root=\"2.16.840.1.113883.10.20.22.1.2\"]');
    if (ccdResult && ccdResult.length > 0) {
        return {
            type: "ccda"
        };
    }

    return {
        type: "xml"
    };
};

//Sense document type based on String
var senseString = function (data) {
    //data must be a string

    if (!data || typeof (data) !== "string") {
        //TODO: throw a proper error here
        return null;
    }

    //console.log(data);
    var doc;
    var result;
    var version = "";
    var reg_exp_v;

    //TODO: better xml detection needed
    if (data.indexOf("<?xml") !== -1 || data.indexOf("<ClinicalDocument") !== -1) {
        //parse xml object...
        try {
            doc = xml.parse(data);
        } catch (ex) {
            return {
                type: "unknown",
                error: ex
            };
        }

        result = senseXml(doc);
        result.xml = doc;

        return result;

    } else if (data.trim().indexOf("<") === 0) {
        //sensing xml with no xml declaration
        //TODO: there should be a better way (like comparing first and last tags and see if they match)

        doc;
        try {
            doc = xml.parse(data);
        } catch (ex) {
            return {
                type: "unknown",
                error: ex
            };
        }

        result = senseXml(doc);
        result.xml = doc;

        return result;
    } else {
        //parse json or determine if text object...
        try {
            var json = JSON.parse(data); // {}

            if (json.data && json.meta) {
                return {
                    type: "blue-button.js",
                    json: json
                };

            } else {

                return {
                    type: "json",
                    json: json
                };
            }
        } catch (e) {
            //console.error("Parsing error:", e);

            if (data.indexOf("MYMEDICARE.GOV PERSONAL HEALTH INFORMATION") > 0 &&
                data.indexOf("Produced by the Blue Button") > 0) {
                version = "";

                reg_exp_v = /Produced by the Blue Button \(v(\d+\.\d+)\)/g;
                version = reg_exp_v.exec(data)[1];

                return {
                    type: "cms",
                    version: version
                };
            } else if (data.indexOf("MY HEALTHEVET PERSONAL INFORMATION REPORT") > 0) {
                version = "";

                reg_exp_v = /utton \(v(\d+.\d+|\d+)\)/g;
                version = reg_exp_v.exec(data)[1];

                return {
                    type: "va",
                    version: version
                };
            } else if (data.indexOf("%PDF") === 0) {
                return {
                    type: "pdf"
                };
            } else if (data.indexOf("+\n  Disclaimer:") > 0) {
                return {
                    type: "format-x"
                };
            }

            return {
                type: "unknown"
            };
        }
    }

    return {
        type: "unknown"
    };
};

module.exports = {
    senseXml: senseXml,
    senseString: senseString
};

},{"blue-button-xml":"blue-button-xml"}],44:[function(require,module,exports){
var CCDA = require("./lib/CCDA/index.js");

//CCDA metadata stuff
var meta = {};
meta.CCDA = CCDA;

meta.supported_sections = [
    'allergies',
    'procedures',
    'immunizations',
    'medications',
    'encounters',
    'vitals',
    'results',
    'social_history',
    'demographics',
    'problems',
    'insurance',
    'claims',
    'plan_of_care',
    'payers',
    'providers'
];

meta.code_systems = require("./lib/code-systems");

module.exports = exports = meta;

},{"./lib/CCDA/index.js":47,"./lib/code-systems":52}],45:[function(require,module,exports){
var clinicalstatements = {
    "AdmissionMedication": "2.16.840.1.113883.10.20.22.4.36",
    "AdvanceDirectiveObservation": "2.16.840.1.113883.10.20.22.4.48",
    "AgeObservation": "2.16.840.1.113883.10.20.22.4.31",
    "AllergyObservation": "2.16.840.1.113883.10.20.22.4.7",
    "AllergyProblemAct": "2.16.840.1.113883.10.20.22.4.30",
    "AllergyStatusObservation": "2.16.840.1.113883.10.20.22.4.28",
    "AssessmentScaleObservation": "2.16.840.1.113883.10.20.22.4.69",
    "AssessmentScaleSupportingObservation": "2.16.840.1.113883.10.20.22.4.86",
    "AuthorizationActivity": "2.16.840.1.113883.10.20.1.19",
    "BoundaryObservation": "2.16.840.1.113883.10.20.6.2.11",
    "CaregiverCharacteristics": "2.16.840.1.113883.10.20.22.4.72",
    "CodeObservations": "2.16.840.1.113883.10.20.6.2.13",
    "CognitiveStatusProblemObservation": "2.16.840.1.113883.10.20.22.4.73",
    "CognitiveStatusResultObservation": "2.16.840.1.113883.10.20.22.4.74",
    "CognitiveStatusResultOrganizer": "2.16.840.1.113883.10.20.22.4.75",
    "CommentActivity": "2.16.840.1.113883.10.20.22.4.64",
    "CoverageActivity": "2.16.840.1.113883.10.20.22.4.60",
    "DeceasedObservation": "2.16.840.1.113883.10.20.22.4.79",
    "DischargeMedication": "2.16.840.1.113883.10.20.22.4.35",
    "EncounterActivities": "2.16.840.1.113883.10.20.22.4.49",
    "EncounterDiagnosis": "2.16.840.1.113883.10.20.22.4.80",
    "EstimatedDateOfDelivery": "2.16.840.1.113883.10.20.15.3.1",
    "FamilyHistoryDeathObservation": "2.16.840.1.113883.10.20.22.4.47",
    "FamilyHistoryObservation": "2.16.840.1.113883.10.20.22.4.46",
    "FamilyHistoryOrganizer": "2.16.840.1.113883.10.20.22.4.45",
    "FunctionalStatusProblemObservation": "2.16.840.1.113883.10.20.22.4.68",
    "FunctionalStatusResultObservation": "2.16.840.1.113883.10.20.22.4.67",
    "FunctionalStatusResultOrganizer": "2.16.840.1.113883.10.20.22.4.66",
    "HealthStatusObservation": "2.16.840.1.113883.10.20.22.4.5",
    "HighestPressureUlcerStage": "2.16.840.1.113883.10.20.22.4.77",
    "HospitalAdmissionDiagnosis": "2.16.840.1.113883.10.20.22.4.34",
    "HospitalDischargeDiagnosis": "2.16.840.1.113883.10.20.22.4.33",
    "ImmunizationActivity": "2.16.840.1.113883.10.20.22.4.52",
    "ImmunizationRefusalReason": "2.16.840.1.113883.10.20.22.4.53",
    "Indication": "2.16.840.1.113883.10.20.22.4.19",
    "Instructions": "2.16.840.1.113883.10.20.22.4.20",
    "MedicationActivity": "2.16.840.1.113883.10.20.22.4.16",
    "MedicationDispense": "2.16.840.1.113883.10.20.22.4.18",
    "MedicationSupplyOrder": "2.16.840.1.113883.10.20.22.4.17",
    "MedicationUseNoneKnown": "2.16.840.1.113883.10.20.22.4.29",
    "NonMedicinalSupplyActivity": "2.16.840.1.113883.10.20.22.4.50",
    "NumberOfPressureUlcersObservation": "2.16.840.1.113883.10.20.22.4.76",
    "PlanOfCareActivityAct": "2.16.840.1.113883.10.20.22.4.39",
    "PlanOfCareActivityEncounter": "2.16.840.1.113883.10.20.22.4.40",
    "PlanOfCareActivityObservation": "2.16.840.1.113883.10.20.22.4.44",
    "PlanOfCareActivityProcedure": "2.16.840.1.113883.10.20.22.4.41",
    "PlanOfCareActivitySubstanceAdministration": "2.16.840.1.113883.10.20.22.4.42",
    "PlanOfCareActivitySupply": "2.16.840.1.113883.10.20.22.4.43",
    "PolicyActivity": "2.16.840.1.113883.10.20.22.4.61",
    "PostprocedureDiagnosis": "2.16.840.1.113883.10.20.22.4.51",
    "PregnancyObservation": "2.16.840.1.113883.10.20.15.3.8",
    "PreoperativeDiagnosis": "2.16.840.1.113883.10.20.22.4.65",
    "PressureUlcerObservation": "2.16.840.1.113883.10.20.22.4.70",
    "ProblemConcernAct": "2.16.840.1.113883.10.20.22.4.3",
    "ProblemObservation": "2.16.840.1.113883.10.20.22.4.4",
    "ProblemStatus": "2.16.840.1.113883.10.20.22.4.6",
    "ProcedureActivityAct": "2.16.840.1.113883.10.20.22.4.12",
    "ProcedureActivityObservation": "2.16.840.1.113883.10.20.22.4.13",
    "ProcedureActivityProcedure": "2.16.840.1.113883.10.20.22.4.14",
    "ProcedureContext": "2.16.840.1.113883.10.20.6.2.5",
    "PurposeofReferenceObservation": "2.16.840.1.113883.10.20.6.2.9",
    "QuantityMeasurementObservation": "2.16.840.1.113883.10.20.6.2.14",
    "ReactionObservation": "2.16.840.1.113883.10.20.22.4.9",
    "ReferencedFramesObservation": "2.16.840.1.113883.10.20.6.2.10",
    "ResultObservation": "2.16.840.1.113883.10.20.22.4.2",
    "ResultOrganizer": "2.16.840.1.113883.10.20.22.4.1",
    "SeriesAct": "2.16.840.1.113883.10.20.22.4.63",
    "SeverityObservation": "2.16.840.1.113883.10.20.22.4.8",
    "SmokingStatusObservation": "2.16.840.1.113883.10.20.22.4.78",
    "SocialHistoryObservation": "2.16.840.1.113883.10.20.22.4.38",
    "SOPInstanceObservation": "2.16.840.1.113883.10.20.6.2.8",
    "StudyAct": "2.16.840.1.113883.10.20.6.2.6",
    "TextObservation": "2.16.840.1.113883.10.20.6.2.12",
    "TobaccoUse": "2.16.840.1.113883.10.20.22.4.85",
    "VitalSignObservation": "2.16.840.1.113883.10.20.22.4.27",
    "VitalSignsOrganizer": "2.16.840.1.113883.10.20.22.4.26"
};

var clinicalstatements_r1 = {
    "AdvanceDirectiveObservation": "2.16.840.1.113883.10.20.1.17",
    "AlertObservation": "2.16.840.1.113883.10.20.1.18",
    "AuthorizationActivity": "2.16.840.1.113883.10.20.1.19",
    "CoverageActivity": "2.16.840.1.113883.10.20.1.20",
    "EncounterActivity": "2.16.840.1.113883.10.20.1.21",
    "FamilyHistoryObservation": "2.16.840.1.113883.10.20.1.22",
    "FamilyHistoryOrganizer": "2.16.840.1.113883.10.20.1.23",
    "MedicationActivity": "2.16.840.1.113883.10.20.1.24",
    "PlanOfCareActivity": "2.16.840.1.113883.10.20.1.25",
    "PolicyActivity": "2.16.840.1.113883.10.20.1.26",
    "ProblemAct": "2.16.840.1.113883.10.20.1.27",
    "ProblemObservation": "2.16.840.1.113883.10.20.1.28",
    "ProcedureActivity": "2.16.840.1.113883.10.20.1.29",
    "PurposeActivity": "2.16.840.1.113883.10.20.1.30",
    "ResultObservation": "2.16.840.1.113883.10.20.1.31",
    "ResultOrganizer": "2.16.840.1.113883.10.20.1.32",
    "SocialHistoryObservation": "2.16.840.1.113883.10.20.1.33",
    "SupplyActivity": "2.16.840.1.113883.10.20.1.34",
    "VitalSignObservation": "2.16.840.1.113883.10.20.1.31",
    "Indication": "2.16.840.1.113883.10.20.22.4.19",
    "VitalSignsOrganizer": "2.16.840.1.113883.10.20.1.35",
    "AdvanceDirectiveReference": "2.16.840.1.113883.10.20.1.36",
    "AdvanceDirectiveStatusObservation": "2.16.840.1.113883.10.20.1.37",
    "AgeObservation": "2.16.840.1.113883.10.20.1.38",
    "AlertStatusObservation": "2.16.840.1.113883.10.20.1.39",
    "Comment": "2.16.840.1.113883.10.20.1.40",
    "EpisodeObservation": "2.16.840.1.113883.10.20.1.41",
    "FamilyHistoryCauseOfDeathObservation": "2.16.840.1.113883.10.20.1.42",
    "FulfillmentInstruction": "2.16.840.1.113883.10.20.1.43",
    "LocationParticipation": "2.16.840.1.113883.10.20.1.45",
    "MedicationSeriesNumberObservation": "2.16.840.1.113883.10.20.1.46",
    "MedicationStatusObservation": "2.16.840.1.113883.10.20.1.47",
    "PatientAwareness": "2.16.840.1.113883.10.20.1.48",
    "PatientInstruction": "2.16.840.1.113883.10.20.1.49",
    "ProblemHealthstatusObservation": "2.16.840.1.113883.10.20.1.51",
    "ProblemStatusObservation": "2.16.840.1.113883.10.20.1.50",
    "Product": "2.16.840.1.113883.10.20.1.53",
    "ProductInstance": "2.16.840.1.113883.10.20.1.52",
    "ReactionObservation": "2.16.840.1.113883.10.20.1.54",
    "SeverityObservation": "2.16.840.1.113883.10.20.1.55",
    "SocialHistoryStatusObservation": "2.16.840.1.113883.10.20.1.56",
    "StatusObservation": "2.16.840.1.113883.10.20.1.57",
    "StatusOfFunctionalStatusObservation": "2.16.840.1.113883.10.20.1.44",
    "VerificationOfAnAdvanceDirectiveObservation": "2.16.840.1.113883.10.20.1.58"
};

module.exports.clinicalstatements = clinicalstatements;
module.exports.clinicalstatements_r1 = clinicalstatements_r1;

},{}],46:[function(require,module,exports){
var codeSystems = {
    "LOINC": ["2.16.840.1.113883.6.1", "8716-3"],
    "SNOMED CT": ["2.16.840.1.113883.6.96", "46680005"],
    "RXNORM": ["2.16.840.1.113883.6.88"],
    "ActCode": ["2.16.840.1.113883.5.4"],
    "CPT-4": ["2.16.840.1.113883.6.12"],
    "CVX": ["2.16.840.1.113883.12.292"],
    "HL7 Role" : ["2.16.840.1.113883.5.111"],
    "HL7 RoleCode" : ["2.16.840.1.113883.5.110"],
    "UNII": ["2.16.840.1.113883.4.9"],
    "Observation Interpretation": ["2.16.840.1.113883.1.11.78"],
    "CPT": ["2.16.840.1.113883.6.12"],
    "HealthcareServiceLocation": ["2.16.840.1.113883.6.259"],
    "HL7 Result Interpretation": ["2.16.840.1.113883.5.83"],
    "Act Reason": ["2.16.840.1.113883.5.8"],
    "Medication Route FDA": ["2.16.840.1.113883.3.26.1.1"],
    "Body Site Value Set": ["2.16.840.1.113883.3.88.12.3221.8.9"],
    "MediSpan DDID": ["2.16.840.1.113883.6.253"],
    "ActPriority": ["2.16.840.1.113883.5.7"],
    "InsuranceType Code": ["2.16.840.1.113883.6.255.1336"],
    "ICD-9-CM": ["2.16.840.1.113883.6.103"]
};

var sections_entries_codes = {
    "codes": {
        "AdvanceDirectivesSectionEntriesOptional": {
            "code": "42348-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Advance Directives"
        },
        "AdvanceDirectivesSection": {
            "code": "42348-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Advance Directives"
        },
        "AllergiesSectionEntriesOptional": {
            "code": "48765-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Allergies, adverse reactions, alerts"
        },
        "AllergiesSection": {
            "code": "48765-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Allergies, adverse reactions, alerts"
        },
        "AnesthesiaSection": {
            "code": "59774-0",
            "code_system": "",
            "code_system_name": "",
            "name": "Anesthesia"
        },
        "AssessmentAndPlanSection": {
            "code": "51847-2",
            "code_system": "",
            "code_system_name": "",
            "name": "Assessment and Plan"
        },
        "AssessmentSection": {
            "code": "51848-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Assessments"
        },
        "ChiefComplaintAndReasonForVisitSection": {
            "code": "46239-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Chief Complaint and Reason for Visit"
        },
        "ChiefComplaintSection": {
            "code": "10154-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Chief Complaint"
        },
        "undefined": "",
        "ComplicationsSection": {
            "code": "55109-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Complications"
        },
        "DICOMObjectCatalogSection": {
            "code": "121181",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Dicom Object Catalog"
        },
        "DischargeDietSection": {
            "code": "42344-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Discharge Diet"
        },
        "EncountersSectionEntriesOptional": {
            "code": "46240-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Encounters"
        },
        "EncountersSection": {
            "code": "46240-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Encounters"
        },
        "FamilyHistorySection": {
            "code": "10157-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Family History"
        },
        "FindingsSection": "",
        "FunctionalStatusSection": {
            "code": "47420-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Functional Status"
        },
        "GeneralStatusSection": {
            "code": "10210-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "General Status"
        },
        "HistoryOfPastIllnessSection": {
            "code": "11348-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of Past Illness"
        },
        "HistoryOfPresentIllnessSection": {
            "code": "10164-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History Of Present Illness Section"
        },
        "HospitalAdmissionDiagnosisSection": {
            "code": "46241-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Admission Diagnosis"
        },
        "HospitalAdmissionMedicationsSectionEntriesOptional": {
            "code": "42346-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medications on Admission"
        },
        "HospitalConsultationsSection": {
            "code": "18841-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Consultations Section"
        },
        "HospitalCourseSection": {
            "code": "8648-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Course"
        },
        "HospitalDischargeDiagnosisSection": {
            "code": "11535-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Diagnosis"
        },
        "HospitalDischargeInstructionsSection": {
            "code": "8653-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Instructions"
        },
        "HospitalDischargeMedicationsSectionEntriesOptional": {
            "code": "10183-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Medications"
        },
        "HospitalDischargePhysicalSection": {
            "code": "10184-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Physical"
        },
        "HospitalDischargeStudiesSummarySection": {
            "code": "11493-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital Discharge Studies Summary"
        },
        "ImmunizationsSectionEntriesOptional": {
            "code": "11369-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Immunizations"
        },
        "ImmunizationsSection": {
            "code": "11369-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Immunizations"
        },
        "InstructionsSection": {
            "code": "69730-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Instructions"
        },
        "InterventionsSection": {
            "code": "62387-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Interventions Provided"
        },
        "MedicalHistorySection": {
            "code": "11329-0",
            "code_system": "",
            "code_system_name": "",
            "name": "Medical"
        },
        "MedicalEquipmentSection": {
            "code": "46264-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medical Equipment"
        },
        "MedicationsAdministeredSection": {
            "code": "29549-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medications Administered"
        },
        "MedicationsSectionEntriesOptional": {
            "code": "10160-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of medication use"
        },
        "MedicationsSection": {
            "code": "10160-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of medication use"
        },
        "ObjectiveSection": {
            "code": "61149-1",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Objective"
        },
        "OperativeNoteFluidSection": {
            "code": "10216-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Operative Note Fluids"
        },
        "OperativeNoteSurgicalProcedureSection": {
            "code": "10223-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Operative Note Surgical Procedure"
        },
        "PayersSection": {
            "code": "48768-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Payers"
        },
        "PhysicalExamSection": {
            "code": "29545-1",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Physical Findings"
        },
        "PlanOfCareSection": {
            "code": "18776-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Plan of Care"
        },
        "PlannedProcedureSection": {
            "code": "59772-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Planned Procedure"
        },
        "PostoperativeDiagnosisSection": {
            "code": "10218-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Postoperative Diagnosis"
        },
        "PostprocedureDiagnosisSection": {
            "code": "59769-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Postprocedure Diagnosis"
        },
        "PreoperativeDiagnosisSection": {
            "code": "10219-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Preoperative Diagnosis"
        },
        "ProblemSectionEntriesOptional": {
            "code": "11450-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Problem List"
        },
        "ProblemSection": {
            "code": "11450-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Problem List"
        },
        "ProcedureDescriptionSection": {
            "code": "29554-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Description"
        },
        "ProcedureDispositionSection": {
            "code": "59775-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Disposition"
        },
        "ProcedureEstimatedBloodLossSection": {
            "code": "59770-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Estimated Blood Loss"
        },
        "ProcedureFindingsSection": {
            "code": "59776-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Findings"
        },
        "ProcedureImplantsSection": {
            "code": "59771-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Implants"
        },
        "ProcedureIndicationsSection": {
            "code": "59768-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Indications"
        },
        "ProcedureSpecimensTakenSection": {
            "code": "59773-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Procedure Specimens Taken"
        },
        "ProceduresSectionEntriesOptional": {
            "code": "47519-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of Procedures"
        },
        "ProceduresSection": {
            "code": "47519-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "History of Procedures"
        },
        "ReasonForReferralSection": {
            "code": "42349-1",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Reason for Referral"
        },
        "ReasonForVisitSection": {
            "code": "29299-5",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Reason for Visit"
        },
        "ResultsSectionEntriesOptional": {
            "code": "30954-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Relevant diagnostic tests and/or laboratory data"
        },
        "ResultsSection": {
            "code": "30954-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Relevant diagnostic tests and/or laboratory data"
        },
        "ReviewOfSystemsSection": {
            "code": "10187-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Review of Systems"
        },
        "SocialHistorySection": {
            "code": "29762-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Social History"
        },
        "SubjectiveSection": {
            "code": "61150-9",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Subjective"
        },
        "SurgicalDrainsSection": {
            "code": "11537-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Surgical Drains"
        },
        "VitalSignsSectionEntriesOptional": {
            "code": "8716-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Vital Signs"
        },
        "VitalSignsSection": {
            "code": "8716-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Vital Signs"
        },
        "AdmissionMedication": {
            "code": "42346-7",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Medications on Admission"
        },
        "AdvanceDirectiveObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "AgeObservation": {
            "code": "445518008",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Age At Onset"
        },
        "AllergyObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "AllergyProblemAct": {
            "code": "48765-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Allergies, adverse reactions, alerts"
        },
        "AllergyStatusObservation": {
            "code": "33999-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Status"
        },
        "AssessmentScaleObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "AssessmentScaleSupportingObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "AuthorizationActivity": "",
        "BoundaryObservation": {
            "code": "113036",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Frames for Display"
        },
        "CaregiverCharacteristics": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "CodeObservations": "",
        "CognitiveStatusProblemObservation": {
            "code": "373930000",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Cognitive function finding"
        },
        "CognitiveStatusResultObservation": {
            "code": "373930000",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Cognitive function finding"
        },
        "CognitiveStatusResultOrganizer": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "CommentActivity": {
            "code": "48767-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Annotation Comment"
        },
        "CoverageActivity": {
            "code": "48768-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Payment sources"
        },
        "DeceasedObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "DischargeMedication": {
            "code": "10183-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Discharge medication"
        },
        "EncounterActivities": "",
        "EncounterDiagnosis": {
            "code": "29308-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Diagnosis"
        },
        "EstimatedDateOfDelivery": {
            "code": "11778-8",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Estimated date of delivery"
        },
        "FamilyHistoryDeathObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "FamilyHistoryObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "FamilyHistoryOrganizer": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "FunctionalStatusProblemObservation": {
            "code": "248536006",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "finding of functional performance and activity"
        },
        "FunctionalStatusResultObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "FunctionalStatusResultOrganizer": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "HealthStatusObservation": {
            "code": "11323-3",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Health status"
        },
        "HighestPressureUlcerStage": {
            "code": "420905001",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Highest Pressure Ulcer Stage"
        },
        "HospitalAdmissionDiagnosis": {
            "code": "46241-6",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Admission diagnosis"
        },
        "HospitalDischargeDiagnosis": {
            "code": "11535-2",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Hospital discharge diagnosis"
        },
        "ImmunizationActivity": "",
        "ImmunizationRefusalReason": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "Indication": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "Instructions": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "MedicationActivity": "",
        "MedicationDispense": "",
        "MedicationSupplyOrder": "",
        "MedicationUseNoneKnown": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "NonMedicinalSupplyActivity": "",
        "NumberOfPressureUlcersObservation": {
            "code": "2264892003",
            "code_system": "",
            "code_system_name": "",
            "name": "number of pressure ulcers"
        },
        "PlanOfCareActivityAct": "",
        "PlanOfCareActivityEncounter": "",
        "PlanOfCareActivityObservation": "",
        "PlanOfCareActivityProcedure": "",
        "PlanOfCareActivitySubstanceAdministration": "",
        "PlanOfCareActivitySupply": "",
        "PolicyActivity": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "PostprocedureDiagnosis": {
            "code": "59769-0",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Postprocedure diagnosis"
        },
        "PregnancyObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "PreoperativeDiagnosis": {
            "code": "10219-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Preoperative Diagnosis"
        },
        "PressureUlcerObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "ProblemConcernAct": {
            "code": "CONC",
            "code_system": "2.16.840.1.113883.5.6",
            "code_system_name": "HL7ActClass",
            "name": "Concern"
        },
        "ProblemObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "ProblemStatus": {
            "code": "33999-4",
            "code_system": "2.16.840.1.113883.6.1",
            "code_system_name": "LOINC",
            "name": "Status"
        },
        "ProcedureActivityAct": "",
        "ProcedureActivityObservation": "",
        "ProcedureActivityProcedure": "",
        "ProcedureContext": "",
        "PurposeofReferenceObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "QuantityMeasurementObservation": "",
        "ReactionObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "ReferencedFramesObservation": {
            "code": "121190",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Referenced Frames"
        },
        "ResultObservation": "",
        "ResultOrganizer": "",
        "SeriesAct": {
            "code": "113015",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Series Act"
        },
        "SeverityObservation": {
            "code": "SEV",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Severity Observation"
        },
        "SmokingStatusObservation": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "SocialHistoryObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "SOPInstanceObservation": "",
        "StudyAct": {
            "code": "113014",
            "code_system": "1.2.840.10008.2.16.4",
            "code_system_name": "DCM",
            "name": "Study Act"
        },
        "TextObservation": "",
        "TobaccoUse": {
            "code": "ASSERTION",
            "code_system": "2.16.840.1.113883.5.4",
            "code_system_name": "ActCode",
            "name": "Assertion"
        },
        "VitalSignObservation": {
            "code": "completed",
            "code_system": "2.16.840.1.113883.5.14",
            "code_system_name": "ActStatus",
            "name": "Completed"
        },
        "VitalSignsOrganizer": {
            "code": "46680005",
            "code_system": "2.16.840.1.113883.6.96",
            "code_system_name": "SNOMED-CT",
            "name": "Vital signs"
        }
    }
};
module.exports.codeSystems = codeSystems;
module.exports.sections_entries_codes = sections_entries_codes;

},{}],47:[function(require,module,exports){
var templates = require("./templates.js");
var sections = require("./sections.js");
var statements = require("./clinicalstatements.js");

var templatesconstraints = require("./templates-constraints.js");
var sectionsconstraints = require("./sections-constraints.js");
var codeSystems = require("./code-systems.js");

//General Header Constraints
var CCDA = {
	"document" : {
		"name": "CCDA",
		"templateId":"2.16.840.1.113883.10.20.22.1.1"
		},
	"templates":templates,
	"sections":sections.sections,
	"sections_r1": sections.sections_r1,
	"statements":statements.clinicalstatements,
	"statements_r1":statements.clinicalstatements_r1,
	"constraints": {
		"sections": sectionsconstraints,
		"templates": templatesconstraints
	},
	"codeSystems": codeSystems.codeSystems,
	"sections_entries_codes": codeSystems.sections_entries_codes

/*
	,
//DOCUMENT-LEVEL TEMPLATES
"templates":[
	{
		"name":"Consultation Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.4"
	},
	{
		"name":"Continuity Of Care Document",
		"templateId":"2.16.840.1.113883.10.20.22.1.2"
	},
	{
		"name":"Diagnostic Imaging Report",
		"templateId":"2.16.840.1.113883.10.20.22.1.5"
	},
	{
		"name":"Discharge Summary",
		"templateId":"2.16.840.1.113883.10.20.22.1.8"
	},
	{
		"name":"History And Physical Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.3"
	},
	{
		"name":"Operative Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.7"
	},
	{
		"name":"Procedure Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.6"
	},
	{
		"name":"Progress Note",
		"templateId":"2.16.840.1.113883.10.20.22.1.9"
	},
	{
		"name":"Unstructured Document",
		"templateId":"2.16.840.1.113883.10.20.21.1.10"
	},
],
//Sections
"sections":[
	{"name": "Allergies",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.6', '2.16.840.1.113883.10.20.22.2.6.1']
	},
	{"name": "Encounters",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.22', '2.16.840.1.113883.10.20.22.2.22.1']
	},
	{"name": "Immunizations",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.2", "2.16.840.1.113883.10.20.22.2.2.1"]
	},
	{"name": "Medications",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.1", "2.16.840.1.113883.10.20.22.2.1.1"]
	},
	{"name": "Problems",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.5.1"]
	},
	{"name": "Procedures",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.7', '2.16.840.1.113883.10.20.22.2.7.1']
	},
	{"name": "Results",
		"templateIds": ['2.16.840.1.113883.10.20.22.2.3', '2.16.840.1.113883.10.20.22.2.3.1']
	},
	{"name": "Vital Signs",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.4","2.16.840.1.113883.10.20.22.2.4.1"]
	},
	{"name": "Social History",
		"templateIds": ["2.16.840.1.113883.10.20.22.2.17"]
	}		
]
*/
};

//Good source http://cdatools.org/SectionMatrix.html
//and http://cdatools.org/ClinicalStatementMatrix.html

module.exports = exports = CCDA;
},{"./clinicalstatements.js":45,"./code-systems.js":46,"./sections-constraints.js":48,"./sections.js":49,"./templates-constraints.js":50,"./templates.js":51}],48:[function(require,module,exports){
var sectionsconstraints = {
    "VitalSignsSection": {
        "full": {
            "VitalSignsOrganizer": {
                "id": [
                    "7276",
                    "7277"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "VitalSignsOrganizer": [
                "7276",
                "7277"
            ]
        }
    },
    "DICOMObjectCatalogSection": {
        "full": {
            "StudyAct": {
                "id": [
                    "8530",
                    "15458"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "StudyAct": [
                "8530",
                "15458"
            ]
        }
    },
    "PayersSection": {
        "full": {
            "CoverageActivity": {
                "id": [
                    "7959",
                    "8905"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "CoverageActivity": [
                "7959",
                "8905"
            ]
        }
    },
    "HospitalDischargeDiagnosisSection": {
        "full": {
            "HospitalDischargeDiagnosis": {
                "id": [
                    "7984"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "HospitalDischargeDiagnosis": [
                "7984"
            ]
        }
    },
    "SocialHistorySection": {
        "may": {
            "TobaccoUse": [
                "16816",
                "16817"
            ],
            "PregnancyObservation": [
                "9133",
                "9132"
            ],
            "SocialHistoryObservation": [
                "7954",
                "7953"
            ]
        },
        "full": {
            "SmokingStatusObservation": {
                "id": [
                    "14824",
                    "14823"
                ],
                "constraint": "should"
            },
            "TobaccoUse": {
                "id": [
                    "16816",
                    "16817"
                ],
                "constraint": "may"
            },
            "PregnancyObservation": {
                "id": [
                    "9133",
                    "9132"
                ],
                "constraint": "may"
            },
            "SocialHistoryObservation": {
                "id": [
                    "7954",
                    "7953"
                ],
                "constraint": "may"
            }
        },
        "should": {
            "SmokingStatusObservation": [
                "14824",
                "14823"
            ]
        }
    },
    "AssessmentAndPlanSection": {
        "may": {
            "PlanOfCareActivityAct": [
                "8798"
            ]
        },
        "full": {
            "PlanOfCareActivityAct": {
                "id": [
                    "8798"
                ],
                "constraint": "may"
            }
        }
    },
    "ResultsSection": {
        "full": {
            "ResultOrganizer": {
                "id": [
                    "7113",
                    "7112"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "ResultOrganizer": [
                "7113",
                "7112"
            ]
        }
    },
    "HospitalAdmissionMedicationsSectionEntriesOptional": {
        "full": {
            "AdmissionMedication": {
                "id": [
                    "10110",
                    "10102"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "AdmissionMedication": [
                "10110",
                "10102"
            ]
        }
    },
    "AllergiesSection": {
        "full": {
            "AllergyProblemAct": {
                "id": [
                    "7531",
                    "7532"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "AllergyProblemAct": [
                "7531",
                "7532"
            ]
        }
    },
    "ComplicationsSection": {
        "may": {
            "ProblemObservation": [
                "8796",
                "8795"
            ]
        },
        "full": {
            "ProblemObservation": {
                "id": [
                    "8796",
                    "8795"
                ],
                "constraint": "may"
            }
        }
    },
    "AdvanceDirectivesSection": {
        "full": {
            "AdvanceDirectiveObservation": {
                "id": [
                    "8801",
                    "8647"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "AdvanceDirectiveObservation": [
                "8801",
                "8647"
            ]
        }
    },
    "MedicationsSectionEntriesOptional": {
        "full": {
            "MedicationActivity": {
                "id": [
                    "7795",
                    "7573"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "MedicationActivity": [
                "7795",
                "7573"
            ]
        }
    },
    "MedicationsAdministeredSection": {
        "may": {
            "MedicationActivity": [
                "8156"
            ]
        },
        "full": {
            "MedicationActivity": {
                "id": [
                    "8156"
                ],
                "constraint": "may"
            }
        }
    },
    "MedicalEquipmentSection": {
        "full": {
            "NonMedicinalSupplyActivity": {
                "id": [
                    "7948.",
                    "8755"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "NonMedicinalSupplyActivity": [
                "7948.",
                "8755"
            ]
        }
    },
    "MedicationsSection": {
        "full": {
            "MedicationActivity": {
                "id": [
                    "7573",
                    "7572"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "MedicationActivity": [
                "7573",
                "7572"
            ]
        }
    },
    "ImmunizationsSection": {
        "full": {
            "ImmunizationActivity": {
                "id": [
                    "9019",
                    "9020"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "ImmunizationActivity": [
                "9019",
                "9020"
            ]
        }
    },
    "AdvanceDirectivesSectionEntriesOptional": {
        "may": {
            "AdvanceDirectiveObservation": [
                "8800",
                "7957"
            ]
        },
        "full": {
            "AdvanceDirectiveObservation": {
                "id": [
                    "8800",
                    "7957"
                ],
                "constraint": "may"
            }
        }
    },
    "ResultsSectionEntriesOptional": {
        "full": {
            "ResultOrganizer": {
                "id": [
                    "7119",
                    "7120"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "ResultOrganizer": [
                "7119",
                "7120"
            ]
        }
    },
    "AnesthesiaSection": {
        "may": {
            "ProcedureActivityProcedure": [
                "8092"
            ],
            "MedicationActivity": [
                "8094"
            ]
        },
        "full": {
            "ProcedureActivityProcedure": {
                "id": [
                    "8092"
                ],
                "constraint": "may"
            },
            "MedicationActivity": {
                "id": [
                    "8094"
                ],
                "constraint": "may"
            }
        }
    },
    "VitalSignsSectionEntriesOptional": {
        "full": {
            "VitalSignsOrganizer": {
                "id": [
                    "7271",
                    "7272"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "VitalSignsOrganizer": [
                "7271",
                "7272"
            ]
        }
    },
    "ImmunizationsSectionEntriesOptional": {
        "full": {
            "ImmunizationActivity": {
                "id": [
                    "7969",
                    "7970"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "ImmunizationActivity": [
                "7969",
                "7970"
            ]
        }
    },
    "FunctionalStatusSection": {
        "may": {
            "PressureUlcerObservation": [
                "16778",
                "16777"
            ],
            "FunctionalStatusProblemObservation": [
                "14422",
                "14423"
            ],
            "CognitiveStatusResultObservation": [
                "14421",
                "14420"
            ],
            "NumberOfPressureUlcersObservation": [
                "16779",
                "16780"
            ],
            "HighestPressureUlcerStage": [
                "16781",
                "16782"
            ],
            "AssessmentScaleObservation": [
                "14581",
                "14580"
            ],
            "FunctionalStatusResultObservation": [
                "14418",
                "14419"
            ],
            "CognitiveStatusProblemObservation": [
                "14425",
                "14424"
            ],
            "FunctionalStatusResultOrganizer": [
                "14414",
                "14415"
            ],
            "CaregiverCharacteristics": [
                "14426",
                "14427"
            ],
            "CognitiveStatusResultOrganizer": [
                "14416",
                "14417"
            ],
            "NonMedicinalSupplyActivity": [
                "14583",
                "14582"
            ]
        },
        "full": {
            "PressureUlcerObservation": {
                "id": [
                    "16778",
                    "16777"
                ],
                "constraint": "may"
            },
            "FunctionalStatusProblemObservation": {
                "id": [
                    "14422",
                    "14423"
                ],
                "constraint": "may"
            },
            "CognitiveStatusResultObservation": {
                "id": [
                    "14421",
                    "14420"
                ],
                "constraint": "may"
            },
            "NumberOfPressureUlcersObservation": {
                "id": [
                    "16779",
                    "16780"
                ],
                "constraint": "may"
            },
            "HighestPressureUlcerStage": {
                "id": [
                    "16781",
                    "16782"
                ],
                "constraint": "may"
            },
            "AssessmentScaleObservation": {
                "id": [
                    "14581",
                    "14580"
                ],
                "constraint": "may"
            },
            "FunctionalStatusResultObservation": {
                "id": [
                    "14418",
                    "14419"
                ],
                "constraint": "may"
            },
            "CognitiveStatusProblemObservation": {
                "id": [
                    "14425",
                    "14424"
                ],
                "constraint": "may"
            },
            "FunctionalStatusResultOrganizer": {
                "id": [
                    "14414",
                    "14415"
                ],
                "constraint": "may"
            },
            "CaregiverCharacteristics": {
                "id": [
                    "14426",
                    "14427"
                ],
                "constraint": "may"
            },
            "CognitiveStatusResultOrganizer": {
                "id": [
                    "14416",
                    "14417"
                ],
                "constraint": "may"
            },
            "NonMedicinalSupplyActivity": {
                "id": [
                    "14583",
                    "14582"
                ],
                "constraint": "may"
            }
        }
    },
    "PreoperativeDiagnosisSection": {
        "full": {
            "PreoperativeDiagnosis": {
                "id": [
                    "10097",
                    "10096"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "PreoperativeDiagnosis": [
                "10097",
                "10096"
            ]
        }
    },
    "HospitalAdmissionDiagnosisSection": {
        "full": {
            "HospitalAdmissionDiagnosis": {
                "id": [
                    "9935",
                    "9934"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "HospitalAdmissionDiagnosis": [
                "9935",
                "9934"
            ]
        }
    },
    "AllergiesSectionEntriesOptional": {
        "full": {
            "AllergyProblemAct": {
                "id": [
                    "7805",
                    "7804"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "AllergyProblemAct": [
                "7805",
                "7804"
            ]
        }
    },
    "PlannedProcedureSection": {
        "may": {
            "PlanOfCareActivityProcedure": [
                "8766",
                "8744"
            ]
        },
        "full": {
            "PlanOfCareActivityProcedure": {
                "id": [
                    "8766",
                    "8744"
                ],
                "constraint": "may"
            }
        }
    },
    "ProblemSection": {
        "full": {
            "ProblemConcernAct": {
                "id": [
                    "9183"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "ProblemConcernAct": [
                "9183"
            ]
        }
    },
    "EncountersSectionEntriesOptional": {
        "full": {
            "EncounterActivities": {
                "id": [
                    "7951",
                    "8802"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "EncounterActivities": [
                "7951",
                "8802"
            ]
        }
    },
    "HospitalDischargeMedicationsSectionEntriesOptional": {
        "full": {
            "DischargeMedication": {
                "id": [
                    "7883"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "DischargeMedication": [
                "7883"
            ]
        }
    },
    "ProcedureFindingsSection": {
        "may": {
            "ProblemObservation": [
                "8090",
                "8091"
            ]
        },
        "full": {
            "ProblemObservation": {
                "id": [
                    "8090",
                    "8091"
                ],
                "constraint": "may"
            }
        }
    },
    "PlanOfCareSection": {
        "may": {
            "PlanOfCareActivityAct": [
                "7726.",
                "8804"
            ],
            "PlanOfCareActivityProcedure": [
                "8810",
                "8809"
            ],
            "PlanOfCareActivitySubstanceAdministration": [
                "8811",
                "8812"
            ],
            "PlanOfCareActivitySupply": [
                "14756",
                "8813"
            ],
            "PlanOfCareActivityEncounter": [
                "8806",
                "8805"
            ],
            "PlanOfCareActivityObservation": [
                "8808",
                "8807"
            ],
            "Instructions": [
                "14695",
                "16751"
            ]
        },
        "full": {
            "PlanOfCareActivityAct": {
                "id": [
                    "7726.",
                    "8804"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivityProcedure": {
                "id": [
                    "8810",
                    "8809"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivitySubstanceAdministration": {
                "id": [
                    "8811",
                    "8812"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivitySupply": {
                "id": [
                    "14756",
                    "8813"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivityEncounter": {
                "id": [
                    "8806",
                    "8805"
                ],
                "constraint": "may"
            },
            "PlanOfCareActivityObservation": {
                "id": [
                    "8808",
                    "8807"
                ],
                "constraint": "may"
            },
            "Instructions": {
                "id": [
                    "14695",
                    "16751"
                ],
                "constraint": "may"
            }
        }
    },
    "InstructionsSection": {
        "full": {
            "Instructions": {
                "id": [
                    "10116",
                    "10117"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "Instructions": [
                "10116",
                "10117"
            ]
        }
    },
    "ProceduresSection": {
        "may": {
            "ProcedureActivityProcedure": [
                "7896",
                "7895"
            ],
            "ProcedureActivityAct": [
                "8020",
                "8019"
            ],
            "ProcedureActivityObservation": [
                "8018",
                "8017"
            ]
        },
        "full": {
            "ProcedureActivityProcedure": {
                "id": [
                    "7896",
                    "7895"
                ],
                "constraint": "may"
            },
            "ProcedureActivityAct": {
                "id": [
                    "8020",
                    "8019"
                ],
                "constraint": "may"
            },
            "ProcedureActivityObservation": {
                "id": [
                    "8018",
                    "8017"
                ],
                "constraint": "may"
            }
        }
    },
    "HospitalDischargeMedicationsSection": {
        "full": {
            "DischargeMedication": {
                "id": [
                    "7827"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "DischargeMedication": [
                "7827"
            ]
        }
    },
    "PostprocedureDiagnosisSection": {
        "full": {
            "PostprocedureDiagnosis": {
                "id": [
                    "8762",
                    "8764"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "PostprocedureDiagnosis": [
                "8762",
                "8764"
            ]
        }
    },
    "HistoryOfPastIllnessSection": {
        "may": {
            "ProblemObservation": [
                "8792"
            ]
        },
        "full": {
            "ProblemObservation": {
                "id": [
                    "8792"
                ],
                "constraint": "may"
            }
        }
    },
    "ProblemSectionEntriesOptional": {
        "full": {
            "ProblemConcernAct": {
                "id": [
                    "7882"
                ],
                "constraint": "should"
            }
        },
        "should": {
            "ProblemConcernAct": [
                "7882"
            ]
        }
    },
    "FamilyHistorySection": {
        "may": {
            "FamilyHistoryOrganizer": [
                "7955"
            ]
        },
        "full": {
            "FamilyHistoryOrganizer": {
                "id": [
                    "7955"
                ],
                "constraint": "may"
            }
        }
    },
    "ProcedureIndicationsSection": {
        "may": {
            "Indication": [
                "8765",
                "8743"
            ]
        },
        "full": {
            "Indication": {
                "id": [
                    "8765",
                    "8743"
                ],
                "constraint": "may"
            }
        }
    },
    "ProceduresSectionEntriesOptional": {
        "may": {
            "ProcedureActivityProcedure": [
                "15509",
                "6274"
            ],
            "ProcedureActivityAct": [
                "8533",
                "15511"
            ],
            "ProcedureActivityObservation": [
                "6278",
                "15510"
            ]
        },
        "full": {
            "ProcedureActivityProcedure": {
                "id": [
                    "15509",
                    "6274"
                ],
                "constraint": "may"
            },
            "ProcedureActivityAct": {
                "id": [
                    "8533",
                    "15511"
                ],
                "constraint": "may"
            },
            "ProcedureActivityObservation": {
                "id": [
                    "6278",
                    "15510"
                ],
                "constraint": "may"
            }
        }
    },
    "PhysicalExamSection": {
        "may": {
            "PressureUlcerObservation": [
                "17094",
                "17095"
            ],
            "NumberOfPressureUlcersObservation": [
                "17096",
                "17097"
            ],
            "HighestPressureUlcerStage": [
                "17098",
                "17099"
            ]
        },
        "full": {
            "PressureUlcerObservation": {
                "id": [
                    "17094",
                    "17095"
                ],
                "constraint": "may"
            },
            "NumberOfPressureUlcersObservation": {
                "id": [
                    "17096",
                    "17097"
                ],
                "constraint": "may"
            },
            "HighestPressureUlcerStage": {
                "id": [
                    "17098",
                    "17099"
                ],
                "constraint": "may"
            }
        }
    },
    "EncountersSection": {
        "full": {
            "EncounterActivities": {
                "id": [
                    "8709",
                    "8803"
                ],
                "constraint": "shall"
            }
        },
        "shall": {
            "EncounterActivities": [
                "8709",
                "8803"
            ]
        }
    }
};

module.exports = exports = sectionsconstraints;


},{}],49:[function(require,module,exports){
var sections = {
    "AdvanceDirectivesSection": "2.16.840.1.113883.10.20.22.2.21.1",
    "AdvanceDirectivesSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.21",
    "AllergiesSection": "2.16.840.1.113883.10.20.22.2.6.1",
    "AllergiesSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.6",
    "AnesthesiaSection": "2.16.840.1.113883.10.20.22.2.25",
    "AssessmentAndPlanSection": "2.16.840.1.113883.10.20.22.2.9",
    "AssessmentSection": "2.16.840.1.113883.10.20.22.2.8",
    "ChiefComplaintAndReasonForVisitSection": "2.16.840.1.113883.10.20.22.2.13",
    "ChiefComplaintSection": "1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1",
    "ComplicationsSection": "2.16.840.1.113883.10.20.22.2.37",
    "DICOMObjectCatalogSection": "2.16.840.1.113883.10.20.6.1.1",
    "DischargeDietSection": "1.3.6.1.4.1.19376.1.5.3.1.3.33",
    "EncountersSection": "2.16.840.1.113883.10.20.22.2.22.1",
    "EncountersSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.22",
    "FamilyHistorySection": "2.16.840.1.113883.10.20.22.2.15",
    "FindingsSection": "2.16.840.1.113883.10.20.6.1.2",
    "FunctionalStatusSection": "2.16.840.1.113883.10.20.22.2.14",
    "GeneralStatusSection": "2.16.840.1.113883.10.20.2.5",
    "HistoryOfPastIllnessSection": "2.16.840.1.113883.10.20.22.2.20",
    "HistoryOfPresentIllnessSection": "1.3.6.1.4.1.19376.1.5.3.1.3.4",
    "HospitalAdmissionDiagnosisSection": "2.16.840.1.113883.10.20.22.2.43",
    "HospitalAdmissionMedicationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.44",
    "HospitalConsultationsSection": "2.16.840.1.113883.10.20.22.2.42",
    "HospitalCourseSection": "1.3.6.1.4.1.19376.1.5.3.1.3.5",
    "HospitalDischargeDiagnosisSection": "2.16.840.1.113883.10.20.22.2.24",
    "HospitalDischargeInstructionsSection": "2.16.840.1.113883.10.20.22.2.41",
    "HospitalDischargeMedicationsSection": "2.16.840.1.113883.10.20.22.2.11.1",
    "HospitalDischargeMedicationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.11",
    "HospitalDischargePhysicalSection": "1.3.6.1.4.1.19376.1.5.3.1.3.26",
    "HospitalDischargeStudiesSummarySection": "2.16.840.1.113883.10.20.22.2.16",
    "ImmunizationsSection": "2.16.840.1.113883.10.20.22.2.2.1",
    "ImmunizationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.2",
    "InstructionsSection": "2.16.840.1.113883.10.20.22.2.45",
    "InterventionsSection": "2.16.840.1.113883.10.20.21.2.3",
    "MedicalEquipmentSection": "2.16.840.1.113883.10.20.22.2.23",
    "MedicalHistorySection": "2.16.840.1.113883.10.20.22.2.39",
    "MedicationsAdministeredSection": "2.16.840.1.113883.10.20.22.2.38",
    "MedicationsSection": "2.16.840.1.113883.10.20.22.2.1.1",
    "MedicationsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.1",
    "ObjectiveSection": "2.16.840.1.113883.10.20.21.2.1",
    "OperativeNoteFluidSection": "2.16.840.1.113883.10.20.7.12",
    "OperativeNoteSurgicalProcedureSection": "2.16.840.1.113883.10.20.7.14",
    "PayersSection": "2.16.840.1.113883.10.20.22.2.18",
    "PhysicalExamSection": "2.16.840.1.113883.10.20.2.10",
    "PlannedProcedureSection": "2.16.840.1.113883.10.20.22.2.30",
    "PlanOfCareSection": "2.16.840.1.113883.10.20.22.2.10",
    "PostoperativeDiagnosisSection": "2.16.840.1.113883.10.20.22.2.35",
    "PostprocedureDiagnosisSection": "2.16.840.1.113883.10.20.22.2.36",
    "PreoperativeDiagnosisSection": "2.16.840.1.113883.10.20.22.2.34",
    "ProblemSection": "2.16.840.1.113883.10.20.22.2.5.1",
    "ProblemSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.5",
    "ProcedureDescriptionSection": "2.16.840.1.113883.10.20.22.2.27",
    "ProcedureDispositionSection": "2.16.840.1.113883.10.20.18.2.12",
    "ProcedureEstimatedBloodLossSection": "2.16.840.1.113883.10.20.18.2.9",
    "ProcedureFindingsSection": "2.16.840.1.113883.10.20.22.2.28",
    "ProcedureImplantsSection": "2.16.840.1.113883.10.20.22.2.40",
    "ProcedureIndicationsSection": "2.16.840.1.113883.10.20.22.2.29",
    "ProcedureSpecimensTakenSection": "2.16.840.1.113883.10.20.22.2.31",
    "ProceduresSection": "2.16.840.1.113883.10.20.22.2.7.1",
    "ProceduresSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.7",
    "ReasonForReferralSection": "1.3.6.1.4.1.19376.1.5.3.1.3.1",
    "ReasonForVisitSection": "2.16.840.1.113883.10.20.22.2.12",
    "ResultsSection": "2.16.840.1.113883.10.20.22.2.3.1",
    "ResultsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.3",
    "ReviewOfSystemsSection": "1.3.6.1.4.1.19376.1.5.3.1.3.18",
    "SocialHistorySection": "2.16.840.1.113883.10.20.22.2.17",
    "SubjectiveSection": "2.16.840.1.113883.10.20.21.2.2",
    "SurgicalDrainsSection": "2.16.840.1.113883.10.20.7.13",
    "VitalSignsSection": "2.16.840.1.113883.10.20.22.2.4.1",
    "VitalSignsSectionEntriesOptional": "2.16.840.1.113883.10.20.22.2.4"
};

var sections_r1 = {
    "AdvanceDirectivesSection":"2.16.840.1.113883.10.20.1.1",
    "AlertsSection":"2.16.840.1.113883.10.20.1.2",
    "EncountersSection":"2.16.840.1.113883.10.20.1.3",
    "FamilyHistorySection":"2.16.840.1.113883.10.20.1.4",
    "FunctionalStatusSection":"2.16.840.1.113883.10.20.1.5",
    "ImmunizationsSection":"2.16.840.1.113883.10.20.1.6",
    "MedicalEquipmentSection":"2.16.840.1.113883.10.20.1.7",
    "MedicationsSection":"2.16.840.1.113883.10.20.1.8",
    "PayersSection":"2.16.840.1.113883.10.20.1.9",
    "PlanOfCareSection":"2.16.840.1.113883.10.20.1.10",
    "ProblemSection":"2.16.840.1.113883.10.20.1.11",
    "ProceduresSection":"2.16.840.1.113883.10.20.1.12",
    "PurposeSection":"2.16.840.1.113883.10.20.1.13",
    "ResultsSection":"2.16.840.1.113883.10.20.1.14",
    "SocialHistorySection":"2.16.840.1.113883.10.20.1.15",
    "VitalSignsSection":"2.16.840.1.113883.10.20.1.16"
};

module.exports.sections = sections;
module.exports.sections_r1 = sections_r1;

},{}],50:[function(require,module,exports){
var templatesconstraints = {
    "ContinuityOfCareDocument": {
        "may": {
            "AdvanceDirectivesSection": "9455",
            "PayersSection": "9468",
            "SocialHistorySection": "9472",
            "ImmunizationsSectionEntriesOptional": "9463",
            "MedicalEquipmentSection": "9466",
            "FamilyHistorySection": "9459",
            "PlanOfCareSection": "9470",
            "FunctionalStatusSection": "9461",
            "VitalSignsSectionEntriesOptional": "9474",
            "EncountersSection": "9457"
        },
        "full": {
            "AdvanceDirectivesSection": {
                "id": "9455",
                "constraint": "may"
            },
            "PayersSection": {
                "id": "9468",
                "constraint": "may"
            },
            "MedicationsSection": {
                "id": "9447",
                "constraint": "shall"
            },
            "ProblemSection": {
                "id": "9449",
                "constraint": "shall"
            },
            "ImmunizationsSectionEntriesOptional": {
                "id": "9463",
                "constraint": "may"
            },
            "SocialHistorySection": {
                "id": "9472",
                "constraint": "may"
            },
            "MedicalEquipmentSection": {
                "id": "9466",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9459",
                "constraint": "may"
            },
            "ProceduresSection": {
                "id": "9451",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9470",
                "constraint": "may"
            },
            "FunctionalStatusSection": {
                "id": "9461",
                "constraint": "may"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9474",
                "constraint": "may"
            },
            "AllergiesSection": {
                "id": "9445",
                "constraint": "shall"
            },
            "EncountersSection": {
                "id": "9457",
                "constraint": "may"
            },
            "ResultsSection": {
                "id": "9453",
                "constraint": "shall"
            }
        },
        "shall": {
            "ProblemSection": "9449",
            "ResultsSection": "9453",
            "AllergiesSection": "9445",
            "ProceduresSection": "9451",
            "MedicationsSection": "9447"
        }
    },
    "HistoryAndPhysicalNote": {
        "may": {
            "ChiefComplaintSection": "9611",
            "ImmunizationsSectionEntriesOptional": "9637",
            "ProblemSectionEntriesOptional": "9639",
            "ReasonForVisitSection": "9627",
            "ProceduresSectionEntriesOptional": "9641",
            "AssessmentAndPlanSection": "9987",
            "ChiefComplaintAndReasonForVisitSection": "9613",
            "PlanOfCareSection": "9607",
            "InstructionsSection": "16807",
            "AssessmentSection": "9605"
        },
        "should": {
            "HistoryOfPresentIllnessSection": "9621"
        },
        "full": {
            "ChiefComplaintSection": {
                "id": "9611",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "9639",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9602",
                "constraint": "shall"
            },
            "FamilyHistorySection": {
                "id": "9615",
                "constraint": "shall"
            },
            "ResultsSectionEntriesOptional": {
                "id": "9629",
                "constraint": "shall"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9619",
                "constraint": "shall"
            },
            "SocialHistorySection": {
                "id": "9633",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9607",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "9623",
                "constraint": "shall"
            },
            "ReasonForVisitSection": {
                "id": "9627",
                "constraint": "may"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9641",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "9987",
                "constraint": "may"
            },
            "GeneralStatusSection": {
                "id": "9617",
                "constraint": "shall"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "9613",
                "constraint": "may"
            },
            "ImmunizationsSectionEntriesOptional": {
                "id": "9637",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9631",
                "constraint": "shall"
            },
            "InstructionsSection": {
                "id": "16807",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "9625",
                "constraint": "shall"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9635",
                "constraint": "shall"
            },
            "AssessmentSection": {
                "id": "9605",
                "constraint": "may"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9621",
                "constraint": "should"
            }
        },
        "shall": {
            "MedicationsSectionEntriesOptional": "9623",
            "AllergiesSectionEntriesOptional": "9602",
            "ResultsSectionEntriesOptional": "9629",
            "HistoryOfPastIllnessSection": "9619",
            "VitalSignsSectionEntriesOptional": "9635",
            "FamilyHistorySection": "9615",
            "GeneralStatusSection": "9617",
            "ReviewOfSystemsSection": "9631",
            "PhysicalExamSection": "9625",
            "SocialHistorySection": "9633"
        }
    },
    "DischargeSummary": {
        "may": {
            "VitalSignsSectionEntriesOptional": "9584",
            "ChiefComplaintSection": "9554",
            "HospitalDischargePhysicalSection": "9568",
            "HospitalConsultationsSection": "9924",
            "SocialHistorySection": "9582",
            "HistoryOfPastIllnessSection": "9564",
            "HospitalDischargeInstructionsSection": "9926",
            "ProblemSectionEntriesOptional": "9574",
            "HospitalDischargeStudiesSummarySection": "9570",
            "ProceduresSectionEntriesOptional": "9576",
            "FamilyHistorySection": "9560",
            "ReasonForVisitSection": "9578",
            "ChiefComplaintAndReasonForVisitSection": "9556",
            "ImmunizationsSectionEntriesOptional": "9572",
            "FunctionalStatusSection": "9562",
            "HospitalAdmissionMedicationsSectionEntriesOptional": "10111",
            "HistoryOfPresentIllnessSection": "9566",
            "ReviewOfSystemsSection": "9580",
            "DischargeDietSection": "9558"
        },
        "full": {
            "HospitalDischargeDiagnosisSection": {
                "id": "9546",
                "constraint": "shall"
            },
            "SocialHistorySection": {
                "id": "9582",
                "constraint": "may"
            },
            "HospitalDischargeStudiesSummarySection": {
                "id": "9570",
                "constraint": "may"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "9556",
                "constraint": "may"
            },
            "HospitalAdmissionMedicationsSectionEntriesOptional": {
                "id": "10111",
                "constraint": "may"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9566",
                "constraint": "may"
            },
            "HospitalConsultationsSection": {
                "id": "9924",
                "constraint": "may"
            },
            "FunctionalStatusSection": {
                "id": "9562",
                "constraint": "may"
            },
            "DischargeDietSection": {
                "id": "9558",
                "constraint": "may"
            },
            "HospitalAdmissionDiagnosisSection": {
                "id": "9928",
                "constraint": "shall"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9542",
                "constraint": "shall"
            },
            "HospitalDischargePhysicalSection": {
                "id": "9568",
                "constraint": "may"
            },
            "ImmunizationsSectionEntriesOptional": {
                "id": "9572",
                "constraint": "may"
            },
            "ReasonForVisitSection": {
                "id": "9578",
                "constraint": "may"
            },
            "HospitalDischargeMedicationsSectionEntriesOptional": {
                "id": "9548",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9550",
                "constraint": "shall"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9584",
                "constraint": "may"
            },
            "HospitalCourseSection": {
                "id": "9544",
                "constraint": "shall"
            },
            "ChiefComplaintSection": {
                "id": "9554",
                "constraint": "may"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9576",
                "constraint": "may"
            },
            "HospitalDischargeInstructionsSection": {
                "id": "9926",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "9574",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9560",
                "constraint": "may"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9564",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9580",
                "constraint": "may"
            }
        },
        "shall": {
            "HospitalAdmissionDiagnosisSection": "9928",
            "AllergiesSectionEntriesOptional": "9542",
            "HospitalDischargeDiagnosisSection": "9546",
            "HospitalDischargeMedicationsSectionEntriesOptional": "9548",
            "PlanOfCareSection": "9550",
            "HospitalCourseSection": "9544"
        }
    },
    "OperativeNote": {
        "may": {
            "PlannedProcedureSection": "9906",
            "OperativeNoteFluidSection": "9900",
            "OperativeNoteSurgicalProcedureSection": "9902",
            "SurgicalDrainsSection": "9912",
            "ProcedureDispositionSection": "9908",
            "ProcedureImplantsSection": "9898",
            "ProcedureIndicationsSection": "9910",
            "PlanOfCareSection": "9904"
        },
        "full": {
            "ProcedureSpecimensTakenSection": {
                "id": "9894",
                "constraint": "shall"
            },
            "PlannedProcedureSection": {
                "id": "9906",
                "constraint": "may"
            },
            "OperativeNoteFluidSection": {
                "id": "9900",
                "constraint": "may"
            },
            "OperativeNoteSurgicalProcedureSection": {
                "id": "9902",
                "constraint": "may"
            },
            "ProcedureIndicationsSection": {
                "id": "9910",
                "constraint": "may"
            },
            "SurgicalDrainsSection": {
                "id": "9912",
                "constraint": "may"
            },
            "PostoperativeDiagnosisSection": {
                "id": "9913",
                "constraint": "shall"
            },
            "ProcedureDispositionSection": {
                "id": "9908",
                "constraint": "may"
            },
            "ProcedureEstimatedBloodLossSection": {
                "id": "9890",
                "constraint": "shall"
            },
            "ProcedureImplantsSection": {
                "id": "9898",
                "constraint": "may"
            },
            "ProcedureDescriptionSection": {
                "id": "9896",
                "constraint": "shall"
            },
            "AnesthesiaSection": {
                "id": "9883",
                "constraint": "shall"
            },
            "ProcedureFindingsSection": {
                "id": "9892",
                "constraint": "shall"
            },
            "PlanOfCareSection": {
                "id": "9904",
                "constraint": "may"
            },
            "PreoperativeDiagnosisSection": {
                "id": "9888",
                "constraint": "shall"
            },
            "ComplicationsSection": {
                "id": "9885",
                "constraint": "shall"
            }
        },
        "shall": {
            "ProcedureSpecimensTakenSection": "9894",
            "ProcedureEstimatedBloodLossSection": "9890",
            "PostoperativeDiagnosisSection": "9913",
            "ProcedureDescriptionSection": "9896",
            "AnesthesiaSection": "9883",
            "ProcedureFindingsSection": "9892",
            "PreoperativeDiagnosisSection": "9888",
            "ComplicationsSection": "9885"
        }
    },
    "ProcedureNote": {
        "may": {
            "SocialHistorySection": "9849",
            "ProcedureDispositionSection": "9833",
            "AssessmentAndPlanSection": "9649",
            "ChiefComplaintAndReasonForVisitSection": "9815",
            "HistoryOfPresentIllnessSection": "9821",
            "ProcedureSpecimensTakenSection": "9841",
            "PlannedProcedureSection": "9831",
            "MedicationsSectionEntriesOptional": "9825",
            "MedicationsAdministeredSection": "9827",
            "ProcedureImplantsSection": "9839",
            "AnesthesiaSection": "9811",
            "MedicalHistorySection": "9823",
            "AllergiesSectionEntriesOptional": "9809",
            "ReasonForVisitSection": "9845",
            "ProcedureFindingsSection": "9837",
            "PlanOfCareSection": "9647",
            "ChiefComplaintSection": "9813",
            "ProcedureEstimatedBloodLossSection": "9835",
            "HistoryOfPastIllnessSection": "9819",
            "FamilyHistorySection": "9817",
            "ProceduresSectionEntriesOptional": "9843",
            "ReviewOfSystemsSection": "9847",
            "PhysicalExamSection": "9829",
            "AssessmentSection": "9645"
        },
        "full": {
            "SocialHistorySection": {
                "id": "9849",
                "constraint": "may"
            },
            "ProcedureDispositionSection": {
                "id": "9833",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "9649",
                "constraint": "may"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "9815",
                "constraint": "may"
            },
            "ComplicationsSection": {
                "id": "9802",
                "constraint": "shall"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9821",
                "constraint": "may"
            },
            "ProcedureSpecimensTakenSection": {
                "id": "9841",
                "constraint": "may"
            },
            "PlannedProcedureSection": {
                "id": "9831",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "9825",
                "constraint": "may"
            },
            "MedicationsAdministeredSection": {
                "id": "9827",
                "constraint": "may"
            },
            "ProcedureImplantsSection": {
                "id": "9839",
                "constraint": "may"
            },
            "ProcedureDescriptionSection": {
                "id": "9805",
                "constraint": "shall"
            },
            "AnesthesiaSection": {
                "id": "9811",
                "constraint": "may"
            },
            "MedicalHistorySection": {
                "id": "9823",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9809",
                "constraint": "may"
            },
            "ReasonForVisitSection": {
                "id": "9845",
                "constraint": "may"
            },
            "ProcedureFindingsSection": {
                "id": "9837",
                "constraint": "may"
            },
            "PlanOfCareSection": {
                "id": "9647",
                "constraint": "may"
            },
            "ChiefComplaintSection": {
                "id": "9813",
                "constraint": "may"
            },
            "ProcedureEstimatedBloodLossSection": {
                "id": "9835",
                "constraint": "may"
            },
            "PostprocedureDiagnosisSection": {
                "id": "9850",
                "constraint": "shall"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9819",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9817",
                "constraint": "may"
            },
            "ProcedureIndicationsSection": {
                "id": "9807",
                "constraint": "shall"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9843",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9847",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "9829",
                "constraint": "may"
            },
            "AssessmentSection": {
                "id": "9645",
                "constraint": "may"
            }
        },
        "shall": {
            "ProcedureDescriptionSection": "9805",
            "PostprocedureDiagnosisSection": "9850",
            "ProcedureIndicationsSection": "9807",
            "ComplicationsSection": "9802"
        }
    },
    "DiagnosticImagingReport": {
        "full": {
            "FindingsSection": {
                "id": "8776",
                "constraint": "shall"
            },
            "DICOMObjectCatalogSection": {
                "id": "15141",
                "constraint": "should"
            }
        },
        "shall": {
            "FindingsSection": "8776"
        },
        "should": {
            "DICOMObjectCatalogSection": "15141"
        }
    },
    "ConsultationNote": {
        "may": {
            "ChiefComplaintSection": "9509",
            "AllergiesSectionEntriesOptional": "9507",
            "FamilyHistorySection": "9513",
            "ResultsSectionEntriesOptional": "9527",
            "HistoryOfPastIllnessSection": "9517",
            "SocialHistorySection": "9531",
            "ProblemSectionEntriesOptional": "9523",
            "MedicationsSectionEntriesOptional": "9521)",
            "ImmunizationsSection": "9519",
            "ProceduresSectionEntriesOptional": "9525",
            "AssessmentAndPlanSection": "9491",
            "GeneralStatusSection": "9515",
            "ReasonForVisitSection": "9500",
            "ChiefComplaintAndReasonForVisitSection": "10029",
            "PlanOfCareSection": "9489",
            "ReviewOfSystemsSection": "9529",
            "ReasonForReferralSection": "9498",
            "VitalSignsSectionEntriesOptional": "9533",
            "AssessmentSection": "9487"
        },
        "should": {
            "PhysicalExamSection": "9495"
        },
        "full": {
            "ChiefComplaintSection": {
                "id": "9509",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "9507",
                "constraint": "may"
            },
            "FamilyHistorySection": {
                "id": "9513",
                "constraint": "may"
            },
            "ResultsSectionEntriesOptional": {
                "id": "9527",
                "constraint": "may"
            },
            "HistoryOfPastIllnessSection": {
                "id": "9517",
                "constraint": "may"
            },
            "SocialHistorySection": {
                "id": "9531",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "9523",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "9521)",
                "constraint": "may"
            },
            "ImmunizationsSection": {
                "id": "9519",
                "constraint": "may"
            },
            "ProceduresSectionEntriesOptional": {
                "id": "9525",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "9491",
                "constraint": "may"
            },
            "GeneralStatusSection": {
                "id": "9515",
                "constraint": "may"
            },
            "ReasonForVisitSection": {
                "id": "9500",
                "constraint": "may"
            },
            "ChiefComplaintAndReasonForVisitSection": {
                "id": "10029",
                "constraint": "may"
            },
            "PlanOfCareSection": {
                "id": "9489",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "9529",
                "constraint": "may"
            },
            "ReasonForReferralSection": {
                "id": "9498",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "9495",
                "constraint": "should"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "9533",
                "constraint": "may"
            },
            "AssessmentSection": {
                "id": "9487",
                "constraint": "may"
            },
            "HistoryOfPresentIllnessSection": {
                "id": "9493",
                "constraint": "shall"
            }
        },
        "shall": {
            "HistoryOfPresentIllnessSection": "9493"
        }
    },
    "ProgressNote": {
        "may": {
            "ChiefComplaintSection": "8772",
            "AllergiesSectionEntriesOptional": "8773",
            "ResultsSectionEntriesOptional": "8782",
            "ProblemSectionEntriesOptional": "8786",
            "MedicationsSectionEntriesOptional": "8771",
            "InterventionsSection": "8778",
            "AssessmentAndPlanSection": "8774",
            "ObjectiveSection": "8770",
            "VitalSignsSectionEntriesOptional": "8784",
            "PlanOfCareSection": "8775",
            "ReviewOfSystemsSection": "8788",
            "InstructionsSection": "16806",
            "PhysicalExamSection": "8780",
            "SubjectiveSection": "8790",
            "AssessmentSection": "8776"
        },
        "full": {
            "ChiefComplaintSection": {
                "id": "8772",
                "constraint": "may"
            },
            "AllergiesSectionEntriesOptional": {
                "id": "8773",
                "constraint": "may"
            },
            "ResultsSectionEntriesOptional": {
                "id": "8782",
                "constraint": "may"
            },
            "ProblemSectionEntriesOptional": {
                "id": "8786",
                "constraint": "may"
            },
            "MedicationsSectionEntriesOptional": {
                "id": "8771",
                "constraint": "may"
            },
            "InterventionsSection": {
                "id": "8778",
                "constraint": "may"
            },
            "AssessmentAndPlanSection": {
                "id": "8774",
                "constraint": "may"
            },
            "ObjectiveSection": {
                "id": "8770",
                "constraint": "may"
            },
            "VitalSignsSectionEntriesOptional": {
                "id": "8784",
                "constraint": "may"
            },
            "PlanOfCareSection": {
                "id": "8775",
                "constraint": "may"
            },
            "ReviewOfSystemsSection": {
                "id": "8788",
                "constraint": "may"
            },
            "InstructionsSection": {
                "id": "16806",
                "constraint": "may"
            },
            "PhysicalExamSection": {
                "id": "8780",
                "constraint": "may"
            },
            "SubjectiveSection": {
                "id": "8790",
                "constraint": "may"
            },
            "AssessmentSection": {
                "id": "8776",
                "constraint": "may"
            }
        }
    }
};

module.exports = exports = templatesconstraints;


},{}],51:[function(require,module,exports){
var templates = {
    "ConsultationNote": "2.16.840.1.113883.10.20.22.1.4",
    "ContinuityOfCareDocument": "2.16.840.1.113883.10.20.22.1.2",
    "DiagnosticImagingReport": "2.16.840.1.113883.10.20.22.1.5",
    "DischargeSummary": "2.16.840.1.113883.10.20.22.1.8",
    "HistoryAndPhysicalNote": "2.16.840.1.113883.10.20.22.1.3",
    "OperativeNote": "2.16.840.1.113883.10.20.22.1.7",
    "ProcedureNote": "2.16.840.1.113883.10.20.22.1.6",
    "ProgressNote": "2.16.840.1.113883.10.20.22.1.9",
    "UnstructuredDocument": "2.16.840.1.113883.10.20.21.1.10"
};

module.exports = exports = templates;


},{}],52:[function(require,module,exports){
"use strict";

var oids = require("./oids");

var codeSystem = {
    codeDisplayName: function (code) {
        return this.cs.table && this.cs.table[code];
    },
    displayNameCode: (function() {
        var reverseTables = {};

        return function(name) {
            var oid = this.oid;
            var reverseTable = reverseTables[oid];
            if (! reverseTable) {
                var table  = this.cs.table || {};
                reverseTable = Object.keys(table).reduce(function(r, code) {
                    var name = table[code];
                    r[name] = code;
                    return r;
                }, {});
                reverseTables[oid] = reverseTable;
            }
            return reverseTable[name];
        };
    })(),
    name: function () {
        return this.cs.name;
    },
    systemId: function() {
        var systemOID = this.cs.code_system;
        if (systemOID) {
            return {
                codeSystem: systemOID,
                codeSystemName: oids[systemOID].name
            };
        } else {
            return {
                codeSystem: this.oid,
                codeSystemName: this.cs.name
            };
        }
    }
};

exports.find = function (oid) {
    var cs = oids[oid];
    if (cs) {
        var result = Object.create(codeSystem);
        result.oid = oid;
        result.cs = cs;
        return result;
    } else {
        return null;
    }
};

exports.findFromName = (function() {
    var nameIndex;

    return function(name) {
        if (! nameIndex) {
            nameIndex = Object.keys(oids).reduce(function(r, oid) {
                var n = oids[oid].name;
                r[n] = oid;
                return r;
            }, {});
        }
        return nameIndex[name];
    };
})();

},{"./oids":53}],53:[function(require,module,exports){
module.exports = OIDs = {
    "2.16.840.1.113883.11.20.9.19": {
        name: "Problem Status",
        table: {
            "active": "active",
            "suspended": "suspended",
            "aborted": "aborted",
            "completed": "completed"
        }
    },
    "2.16.840.1.113883.5.8": {
        name: "Act Reason",
        table: {
            "IMMUNE": "Immunity",
            "MEDPREC": "Medical precaution",
            "OSTOCK": "Out of stock",
            "PATOBJ": "Patient objection",
            "PHILISOP": "Philosophical objection",
            "RELIG": "Religious objection",
            "VACEFF": "Vaccine efficacy concerns",
            "VACSAF": "Vaccine safety concerns"
        }
    },
    "2.16.840.1.113883.6.14": {
        name: "HCFA Procedure Codes (HCPCS)",
        uri: "http://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo/index.html?redirect=/medhcpcsgeninfo/"
    },
    "2.16.840.1.113883.6.103": {
        name: "ICD-9-CM",
        uri: "http://www.cms.gov/medicare-coverage-database/staticpages/icd-9-code-lookup.aspx"
    },
    "2.16.840.1.113883.6.233": {
        name: "US Department of Veterans Affairs",
        uri: "http://www.hl7.org/documentcenter/public_temp_36CB0CDC-1C23-BA17-0C356EB233D41682/standards/vocabulary/vocabulary_tables/infrastructure/vocabulary/voc_ExternalSystems.html"
    },
    "2.16.840.1.113883.6.69": {
        name: "NDC-FDA Drug Registration",
        uri: "http://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.6.69"
    },
    "2.16.840.1.113883.6.253": {
        name: "MediSpan DDID"
    },
    "2.16.840.1.113883.6.27": {
        name: "Multum",
        uri: "http://multum-look-me-up#"
    },
    "2.16.840.1.113883.6.312": {
        name: "multum-drug-synonym-id",
        uri: "http://multum-drug-synonym-id-look-me-up#"
    },
    "2.16.840.1.113883.6.314": {
        name: "multum-drug-id",
        uri: "http://multum-drug-id-look-me-up#"
    },
    "2.16.840.1.113883.3.26.1.1": {
        name: "NCI Thesaurus",
        uri: "http://nci-thesaurus-look-me-up#"
    },
    "2.16.840.1.113883.6.59": {
        name: "CVX Vaccine",
        uri: "http://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx&code="
    },
    "2.16.840.1.113883.5.112": {
        name: "Route Code",
        uri: "http://hl7.org/codes/RouteCode#"
    },
    "2.16.840.1.113883.6.238": {
        name: "Race and Ethnicity - CDC",
        uri: "http://phinvads.cdc.gov/vads/ViewCodeSystemConcept.action?oid=2.16.840.1.113883.6.238&code="
    },
    "2.16.840.1.113883.6.255.1336": {
        name: "InsuranceType Code"
    },
    "2.16.840.1.113883.6.1": {
        name: "LOINC",
        uri: "http://purl.bioontology.org/ontology/LNC/"
    },
    "2.16.840.1.113883.6.88": {
        name: "RXNORM",
        uri: "http://purl.bioontology.org/ontology/RXNORM/"
    },
    "2.16.840.1.113883.6.96": {
        name: "SNOMED CT",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        table: {
            "55561003": "Active",
            "421139008": "On Hold",
            "392521001": "Prior History",
            "73425007": "No Longer Active"
        }
    },
    "2.16.840.1.113883.6.12": {
        name: "CPT",
        uri: "http://purl.bioontology.org/ontology/CPT/"
    },
    "2.16.840.1.113883.5.4": {
        name: "ActCode",
        uri: "http://hl7.org/actcode/"
    },
    "2.16.840.1.113883.4.9": {
        name: "UNII",
    },
    "2.16.840.1.113883.1.11.78": {
        name: "Observation Interpretation"
    },
    "2.16.840.1.113883.19": {
        name: "Good Health Clinic",
        uri: "http://hl7.org/goodhealth/"
    },
    "2.16.840.1.113883.6.259": {
        name: "HealthcareServiceLocation",
        uri: "http://hl7.org/healthcareservice/"
    },
    "2.16.840.1.113883.1.11.19185": {
        name: "HL7 Religion",
        uri: "http://hl7.org/codes/ReligiousAffiliation#"
    },
    "2.16.840.1.113883.5.60": {
        name: "LanguageAbilityMode",
        uri: "http://hl7.org/codes/LanguageAbility#",
        table: {
            ESGN: "Expressed signed",
            ESP: "Expressed spoken",
            EWR: "Expressed written",
            RSGN: "Received signed",
            RSP: "Received spoken",
            RWR: "Received written"
        }
    },
    "2.16.840.1.113883.5.2": {
        name: "HL7 Marital Status",
        uri: "http://hl7.org/codes/MaritalStatus#"
    },
    "2.16.840.1.113883.5.83": {
        name: "HL7 Result Interpretation",
        uri: "http://hl7.org/codes/ResultInterpretation#",
        table: {
            "B": "better",
            "D": "decreased",
            "U": "increased",
            "W": "worse",
            "<": "low off scale",
            ">": "high off scale",
            "A": "Abnormal",
            "AA": "abnormal alert",
            "H": "High",
            "HH": "high alert",
            "L": "Low",
            "LL": "low alert",
            "N": "Normal",
            "I": "intermediate",
            "MS": "moderately susceptible",
            "R": "resistent",
            "S": "susceptible",
            "VS": "very susceptible",
            "EX": "outside threshold",
            "HX": "above high threshold",
            "LX": "below low threshold",

        }
    },
    "2.16.840.1.113883.5.111": {
        name: "HL7 Role",
        uri: "http://hl7.org/codes/PersonalRelationship#",
        table: {
            "PRN": "Parent"
        }
    },
    "2.16.840.1.113883.5.110": {
        name: "HL7 RoleCode"
    },
    "2.16.840.1.113883.5.1119": {
        name: "HL7 Address",
        uri: "http://hl7.org/codes/Address#",
        table: {
            "BAD": "bad address",
            "CONF": "confidential",
            "DIR": "direct",
            "H": "home address",
            "HP": "primary home",
            "HV": "vacation home",
            "PHYS": "physical visit address",
            "PST": "postal address",
            "PUB": "public",
            "TMP": "temporary",
            "WP": "work place",
            "MC": "mobile contact",
            "PG": "pager",
            "EC": "emergency contact",
            "AS": "answering service"
        }
    },
    "2.16.840.1.113883.5.45": {
        name: "HL7 EntityName",
        uri: "http://hl7.org/codes/EntityName#",
        table: {
            "A": "Artist/Stage",
            "ABC": "Alphabetic",
            "ASGN": "Assigned",
            "C": "License",
            "I": "Indigenous/Tribal",
            "IDE": "Ideographic",
            "L": "Legal",
            "P": "Pseudonym",
            "PHON": "Phonetic",
            "R": "Religious",
            "SNDX": "Soundex",
            "SRCH": "Search",
            "SYL": "Syllabic"
        }
    },
    "2.16.840.1.113883.5.1": {
        name: "HL7 AdministrativeGender",
        uri: "http://hl7.org/codes/AdministrativeGender#",
        table: {
            "F": "Female",
            "M": "Male",
            "UN": "Undifferentiated"
        }
    },
    "2.16.840.1.113883.3.88.12.3221.6.8": {
        name: "Problem Severity",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        code_system: "2.16.840.1.113883.6.96",
        table: {
            "255604002": "Mild",
            "371923003": "Mild to moderate",
            "6736007": "Moderate",
            "371924009": "Moderate to severe",
            "24484000": "Severe",
            "399166001": "Fatal"
        }
    },
    "2.16.840.1.113883.3.88.12.80.68": {
        name: "HITSP Problem Status",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        code_system: "2.16.840.1.113883.6.96",
        table: {
            "55561003": "Active",
            "73425007": "Inactive",
            "413322009": "Resolved"
        }
    },
    "2.16.840.1.113883.11.20.9.38": {
        name: "Smoking Status/Social History Observation",
        uri: "http://purl.bioontology.org/ontology/SNOMEDCT/",
        code_system: "2.16.840.1.113883.6.96",
        table: {
            "449868002": "Current every day smoker",
            "428041000124106": "Current some day smoker",
            "8517006": "Former smoker",
            "266919005": "Never smoker",
            "77176002": "Smoker, current status unknown",
            "266927001": "Unknown if ever smoked",
            "230056004": "Smoker, current status unknown",
            "229819007": "Tobacco use and exposure",
            "256235009": "Exercise",
            "160573003": "Alcohol intake",
            "364393001": "Nutritional observable",
            "364703007": "Employment detail",
            "425400000": "Toxic exposure status",
            "363908000": "Details of drug misuse behavior",
            "228272008": "Health-related behavior",
            "105421008": "Educational Achievement"
        }
    },
    "2.16.840.1.113883.11.20.9.21": {
        name: "Age Unified Code for Units of Measure",
        uri: "http://phinvads.cdc.gov/vads/ViewValueSet.action?oid=2.16.840.1.114222.4.11.878",
        table: {
            "min": "Minute",
            "h": "Hour",
            "d": "Day",
            "wk": "Week",
            "mo": "Month",
            "a": "Year"
        }
    },
    "2.16.840.1.113883.12.292": {
        name: "CVX",
        uri: "http://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.12.292"
    },
    "2.16.840.1.113883.5.1076": {
        name: "HL7 Religious Affiliation",
        uri: "http://ushik.ahrq.gov/ViewItemDetails?system=mdr&itemKey=83154000",
        table: {
            "1008": "Babi & Baha´I faiths",
            "1009": "Baptist",
            "1010": "Bon",
            "1011": "Cao Dai",
            "1012": "Celticism",
            "1013": "Christian (non-Catholic, non-specific)",
            "1014": "Confucianism",
            "1015": "Cyberculture Religions",
            "1016": "Divination",
            "1017": "Fourth Way",
            "1018": "Free Daism",
            "1019": "Gnosis",
            "1020": "Hinduism",
            "1021": "Humanism",
            "1022": "Independent",
            "1023": "Islam",
            "1024": "Jainism",
            "1025": "Jehovah´s Witnesses",
            "1026": "Judaism",
            "1027": "Latter Day Saints",
            "1028": "Lutheran",
            "1029": "Mahayana",
            "1030": "Meditation",
            "1031": "Messianic Judaism",
            "1032": "Mitraism",
            "1033": "New Age",
            "1034": "non-Roman Catholic",
            "1035": "Occult",
            "1036": "Orthodox",
            "1037": "Paganism",
            "1038": "Pentecostal",
            "1039": "Process, The",
            "1040": "Reformed/Presbyterian",
            "1041": "Roman Catholic Church",
            "1042": "Satanism",
            "1043": "Scientology",
            "1044": "Shamanism",
            "1045": "Shiite (Islam)",
            "1046": "Shinto",
            "1047": "Sikism",
            "1048": "Spiritualism",
            "1049": "Sunni (Islam)",
            "1050": "Taoism",
            "1051": "Theravada",
            "1052": "Unitarian-Universalism",
            "1053": "Universal Life Church",
            "1054": "Vajrayana (Tibetan)",
            "1055": "Veda",
            "1056": "Voodoo",
            "1057": "Wicca",
            "1058": "Yaohushua",
            "1059": "Zen Buddhism",
            "1060": "Zoroastrianism",
            "1062": "Brethren",
            "1063": "Christian Scientist",
            "1064": "Church of Christ",
            "1065": "Church of God",
            "1066": "Congregational",
            "1067": "Disciples of Christ",
            "1068": "Eastern Orthodox",
            "1069": "Episcopalian",
            "1070": "Evangelical Covenant",
            "1071": "Friends",
            "1072": "Full Gospel",
            "1073": "Methodist",
            "1074": "Native American",
            "1075": "Nazarene",
            "1076": "Presbyterian",
            "1077": "Protestant",
            "1078": "Protestant, No Denomination",
            "1079": "Reformed",
            "1080": "Salvation Army",
            "1081": "Unitarian Universalist",
            "1082": "United Church of Christ"
        }
    },
    "2.16.840.1.113883.1.11.11526": {
        "name": "Internet Society Language",
        "uri": "http://www.loc.gov/standards/iso639-2/php/English_list.php"
    },
    "2.16.840.1.113883.11.20.9.22": {
        name: "ActStatus",
        table: {
            "completed": "Completed",
            "active": "Active",
            "aborted": "Aborted",
            "cancelled": "Cancelled"
        }
    },
    "2.16.840.1.113883.6.238": {
        name: "Race and Ethnicity - CDC",
        table: {
            "1002-5": "American Indian or Alaska Native",
            "2028-9": "Asian",
            "2054-5": "Black or African American",
            "2076-8": "Native Hawaiian or Other Pacific Islander",
            "2106-3": "White",
            "2131-1": "Other Race",
            "1004-1": "American Indian",
            "1735-0": "Alaska Native",
            "2029-7": "Asian Indian",
            "2030-5": "Bangladeshi",
            "2031-3": "Bhutanese",
            "2032-1": "Burmese",
            "2033-9": "Cambodian",
            "2034-7": "Chinese",
            "2035-4": "Taiwanese",
            "2036-2": "Filipino",
            "2037-0": "Hmong",
            "2038-8": "Indonesian",
            "2039-6": "Japanese",
            "2040-4": "Korean",
            "2041-2": "Laotian",
            "2042-0": "Malaysian",
            "2043-8": "Okinawan",
            "2044-6": "Pakistani",
            "2045-3": "Sri Lankan",
            "2046-1": "Thai",
            "2047-9": "Vietnamese",
            "2048-7": "Iwo Jiman",
            "2049-5": "Maldivian",
            "2050-3": "Nepalese",
            "2051-1": "Singaporean",
            "2052-9": "Madagascar",
            "2056-0": "Black",
            "2058-6": "African American",
            "2060-2": "African",
            "2067-7": "Bahamian",
            "2068-5": "Barbadian",
            "2069-3": "Dominican",
            "2070-1": "Dominica Islander",
            "2071-9": "Haitian",
            "2072-7": "Jamaican",
            "2073-5": "Tobagoan",
            "2074-3": "Trinidadian",
            "2075-0": "West Indian",
            "2078-4": "Polynesian",
            "2085-9": "Micronesian",
            "2100-6": "Melanesian",
            "2500-7": "Other Pacific Islander",
            "2108-9": "European",
            "2118-8": "Middle Eastern or North African",
            "2129-5": "Arab",
            "1006-6": "Abenaki",
            "1008-2": "Algonquian",
            "1010-8": "Apache",
            "1021-5": "Arapaho",
            "1026-4": "Arikara",
            "1028-0": "Assiniboine",
            "1030-6": "Assiniboine Sioux",
            "1033-0": "Bannock",
            "1035-5": "Blackfeet",
            "1037-1": "Brotherton",
            "1039-7": "Burt Lake Band",
            "1041-3": "Caddo",
            "1044-7": "Cahuilla",
            "1053-8": "California Tribes",
            "1068-6": "Canadian and Latin American Indian",
            "1076-9": "Catawba",
            "1078-5": "Cayuse",
            "1080-1": "Chehalis",
            "1082-7": "Chemakuan",
            "1086-8": "Chemehuevi",
            "1088-4": "Cherokee",
            "1100-7": "Cherokee Shawnee",
            "1102-3": "Cheyenne",
            "1106-4": "Cheyenne-Arapaho",
            "1108-0": "Chickahominy",
            "1112-2": "Chickasaw",
            "1114-8": "Chinook",
            "1123-9": "Chippewa",
            "1150-2": "Chippewa Cree",
            "1153-6": "Chitimacha",
            "1155-1": "Choctaw",
            "1162-7": "Chumash",
            "1165-0": "Clear Lake",
            "1167-6": "Coeur D'Alene",
            "1169-2": "Coharie",
            "1171-8": "Colorado River",
            "1173-4": "Colville",
            "1175-9": "Comanche",
            "1178-3": "Coos, Lower Umpqua, Siuslaw",
            "1180-9": "Coos",
            "1182-5": "Coquilles",
            "1184-1": "Costanoan",
            "1186-6": "Coushatta",
            "1189-0": "Cowlitz",
            "1191-6": "Cree",
            "1193-2": "Creek",
            "1207-0": "Croatan",
            "1209-6": "Crow",
            "1211-2": "Cupeno",
            "1214-6": "Delaware",
            "1222-9": "Diegueno",
            "1233-6": "Eastern Tribes",
            "1250-0": "Esselen",
            "1252-6": "Fort Belknap",
            "1254-2": "Fort Berthold",
            "1256-7": "Fort Mcdowell",
            "1258-3": "Fort Hall",
            "1260-9": "Gabrieleno",
            "1262-5": "Grand Ronde",
            "1264-1": "Gros Ventres",
            "1267-4": "Haliwa",
            "1269-0": "Hidatsa",
            "1271-6": "Hoopa",
            "1275-7": "Hoopa Extension",
            "1277-3": "Houma",
            "1279-9": "Inaja-Cosmit",
            "1281-5": "Iowa",
            "1285-6": "Iroquois",
            "1297-1": "Juaneno",
            "1299-7": "Kalispel",
            "1301-1": "Karuk",
            "1303-7": "Kaw",
            "1305-2": "Kickapoo",
            "1309-4": "Kiowa",
            "1312-8": "Klallam",
            "1317-7": "Klamath",
            "1319-3": "Konkow",
            "1321-9": "Kootenai",
            "1323-5": "Lassik",
            "1325-0": "Long Island",
            "1331-8": "Luiseno",
            "1340-9": "Lumbee",
            "1342-5": "Lummi",
            "1344-1": "Maidu",
            "1348-2": "Makah",
            "1350-8": "Maliseet",
            "1352-4": "Mandan",
            "1354-0": "Mattaponi",
            "1356-5": "Menominee",
            "1358-1": "Miami",
            "1363-1": "Miccosukee",
            "1365-6": "Micmac",
            "1368-0": "Mission Indians",
            "1370-6": "Miwok",
            "1372-2": "Modoc",
            "1374-8": "Mohegan",
            "1376-3": "Mono",
            "1378-9": "Nanticoke",
            "1380-5": "Narragansett",
            "1382-1": "Navajo",
            "1387-0": "Nez Perce",
            "1389-6": "Nomalaki",
            "1391-2": "Northwest Tribes",
            "1403-5": "Omaha",
            "1405-0": "Oregon Athabaskan",
            "1407-6": "Osage",
            "1409-2": "Otoe-Missouria",
            "1411-8": "Ottawa",
            "1416-7": "Paiute",
            "1439-9": "Pamunkey",
            "1441-5": "Passamaquoddy",
            "1445-6": "Pawnee",
            "1448-0": "Penobscot",
            "1450-6": "Peoria",
            "1453-0": "Pequot",
            "1456-3": "Pima",
            "1460-5": "Piscataway",
            "1462-1": "Pit River",
            "1464-7": "Pomo",
            "1474-6": "Ponca",
            "1478-7": "Potawatomi",
            "1487-8": "Powhatan",
            "1489-4": "Pueblo",
            "1518-0": "Puget Sound Salish",
            "1541-2": "Quapaw",
            "1543-8": "Quinault",
            "1545-3": "Rappahannock",
            "1547-9": "Reno-Sparks",
            "1549-5": "Round Valley",
            "1551-1": "Sac and Fox",
            "1556-0": "Salinan",
            "1558-6": "Salish",
            "1560-2": "Salish and Kootenai",
            "1562-8": "Schaghticoke",
            "1564-4": "Scott Valley",
            "1566-9": "Seminole",
            "1573-5": "Serrano",
            "1576-8": "Shasta",
            "1578-4": "Shawnee",
            "1582-6": "Shinnecock",
            "1584-2": "Shoalwater Bay",
            "1586-7": "Shoshone",
            "1602-2": "Shoshone Paiute",
            "1607-1": "Siletz",
            "1609-7": "Sioux",
            "1643-6": "Siuslaw",
            "1645-1": "Spokane",
            "1647-7": "Stewart",
            "1649-3": "Stockbridge",
            "1651-9": "Susanville",
            "1653-5": "Tohono O'Odham",
            "1659-2": "Tolowa",
            "1661-8": "Tonkawa",
            "1663-4": "Tygh",
            "1665-9": "Umatilla",
            "1667-5": "Umpqua",
            "1670-9": "Ute",
            "1675-8": "Wailaki",
            "1677-4": "Walla-Walla",
            "1679-0": "Wampanoag",
            "1683-2": "Warm Springs",
            "1685-7": "Wascopum",
            "1687-3": "Washoe",
            "1692-3": "Wichita",
            "1694-9": "Wind River",
            "1696-4": "Winnebago",
            "1700-4": "Winnemucca",
            "1702-0": "Wintun",
            "1704-6": "Wiyot",
            "1707-9": "Yakama",
            "1709-5": "Yakama Cowlitz",
            "1711-1": "Yaqui",
            "1715-2": "Yavapai Apache",
            "1717-8": "Yokuts",
            "1722-8": "Yuchi",
            "1724-4": "Yuman",
            "1732-7": "Yurok",
            "1737-6": "Alaska Indian",
            "1840-8": "Eskimo",
            "1966-1": "Aleut",
            "2061-0": "Botswanan",
            "2062-8": "Ethiopian",
            "2063-6": "Liberian",
            "2064-4": "Namibian",
            "2065-1": "Nigerian",
            "2066-9": "Zairean",
            "2079-2": "Native Hawaiian",
            "2080-0": "Samoan",
            "2081-8": "Tahitian",
            "2082-6": "Tongan",
            "2083-4": "Tokelauan",
            "2086-7": "Guamanian or Chamorro",
            "2087-5": "Guamanian",
            "2088-3": "Chamorro",
            "2089-1": "Mariana Islander",
            "2090-9": "Marshallese",
            "2091-7": "Palauan",
            "2092-5": "Carolinian",
            "2093-3": "Kosraean",
            "2094-1": "Pohnpeian",
            "2095-8": "Saipanese",
            "2096-6": "Kiribati",
            "2097-4": "Chuukese",
            "2098-2": "Yapese",
            "2101-4": "Fijian",
            "2102-2": "Papua New Guinean",
            "2103-0": "Solomon Islander",
            "2104-8": "New Hebrides",
            "2109-7": "Armenian",
            "2110-5": "English",
            "2111-3": "French",
            "2112-1": "German",
            "2113-9": "Irish",
            "2114-7": "Italian",
            "2115-4": "Polish",
            "2116-2": "Scottish",
            "2119-6": "Assyrian",
            "2120-4": "Egyptian",
            "2121-2": "Iranian",
            "2122-0": "Iraqi",
            "2123-8": "Lebanese",
            "2124-6": "Palestinian",
            "2125-3": "Syrian",
            "2126-1": "Afghanistani",
            "2127-9": "Israeili",
            "1011-6": "Chiricahua",
            "1012-4": "Fort Sill Apache",
            "1013-2": "Jicarilla Apache",
            "1014-0": "Lipan Apache",
            "1015-7": "Mescalero Apache",
            "1016-5": "Oklahoma Apache",
            "1017-3": "Payson Apache",
            "1018-1": "San Carlos Apache",
            "1019-9": "White Mountain Apache",
            "1022-3": "Northern Arapaho",
            "1023-1": "Southern Arapaho",
            "1024-9": "Wind River Arapaho",
            "1031-4": "Fort Peck Assiniboine Sioux",
            "1042-1": "Oklahoma Cado",
            "1045-4": "Agua Caliente Cahuilla",
            "1046-2": "Augustine",
            "1047-0": "Cabazon",
            "1048-8": "Los Coyotes",
            "1049-6": "Morongo",
            "1050-4": "Santa Rosa Cahuilla",
            "1051-2": "Torres-Martinez",
            "1054-6": "Cahto",
            "1055-3": "Chimariko",
            "1056-1": "Coast Miwok",
            "1057-9": "Digger",
            "1058-7": "Kawaiisu",
            "1059-5": "Kern River",
            "1060-3": "Mattole",
            "1061-1": "Red Wood",
            "1062-9": "Santa Rosa",
            "1063-7": "Takelma",
            "1064-5": "Wappo",
            "1065-2": "Yana",
            "1066-0": "Yuki",
            "1069-4": "Canadian Indian",
            "1070-2": "Central American Indian",
            "1071-0": "French American Indian",
            "1072-8": "Mexican American Indian",
            "1073-6": "South American Indian",
            "1074-4": "Spanish American Indian",
            "1083-5": "Hoh",
            "1084-3": "Quileute",
            "1089-2": "Cherokee Alabama",
            "1090-0": "Cherokees of Northeast Alabama",
            "1091-8": "Cherokees of Southeast Alabama",
            "1092-6": "Eastern Cherokee",
            "1093-4": "Echota Cherokee",
            "1094-2": "Etowah Cherokee",
            "1095-9": "Northern Cherokee",
            "1096-7": "Tuscola",
            "1097-5": "United Keetowah Band of Cherokee",
            "1098-3": "Western Cherokee",
            "1103-1": "Northern Cheyenne",
            "1104-9": "Southern Cheyenne",
            "1109-8": "Eastern Chickahominy",
            "1110-6": "Western Chickahominy",
            "1115-5": "Clatsop",
            "1116-3": "Columbia River Chinook",
            "1117-1": "Kathlamet",
            "1118-9": "Upper Chinook",
            "1119-7": "Wakiakum Chinook",
            "1120-5": "Willapa Chinook",
            "1121-3": "Wishram",
            "1124-7": "Bad River",
            "1125-4": "Bay Mills Chippewa",
            "1126-2": "Bois Forte",
            "1127-0": "Burt Lake Chippewa",
            "1128-8": "Fond du Lac",
            "1129-6": "Grand Portage",
            "1130-4": "Grand Traverse Band of Ottawa/Chippewa",
            "1131-2": "Keweenaw",
            "1132-0": "Lac Courte Oreilles",
            "1133-8": "Lac du Flambeau",
            "1134-6": "Lac Vieux Desert Chippewa",
            "1135-3": "Lake Superior",
            "1136-1": "Leech Lake",
            "1137-9": "Little Shell Chippewa",
            "1138-7": "Mille Lacs",
            "1139-5": "Minnesota Chippewa",
            "1140-3": "Ontonagon",
            "1141-1": "Red Cliff Chippewa",
            "1142-9": "Red Lake Chippewa",
            "1143-7": "Saginaw Chippewa",
            "1144-5": "St. Croix Chippewa",
            "1145-2": "Sault Ste. Marie Chippewa",
            "1146-0": "Sokoagon Chippewa",
            "1147-8": "Turtle Mountain",
            "1148-6": "White Earth",
            "1151-0": "Rocky Boy's Chippewa Cree",
            "1156-9": "Clifton Choctaw",
            "1157-7": "Jena Choctaw",
            "1158-5": "Mississippi Choctaw",
            "1159-3": "Mowa Band of Choctaw",
            "1160-1": "Oklahoma Choctaw",
            "1163-5": "Santa Ynez",
            "1176-7": "Oklahoma Comanche",
            "1187-4": "Alabama Coushatta",
            "1194-0": "Alabama Creek",
            "1195-7": "Alabama Quassarte",
            "1196-5": "Eastern Creek",
            "1197-3": "Eastern Muscogee",
            "1198-1": "Kialegee",
            "1199-9": "Lower Muscogee",
            "1200-5": "Machis Lower Creek Indian",
            "1201-3": "Poarch Band",
            "1202-1": "Principal Creek Indian Nation",
            "1203-9": "Star Clan of Muscogee Creeks",
            "1204-7": "Thlopthlocco",
            "1205-4": "Tuckabachee",
            "1212-0": "Agua Caliente",
            "1215-3": "Eastern Delaware",
            "1216-1": "Lenni-Lenape",
            "1217-9": "Munsee",
            "1218-7": "Oklahoma Delaware",
            "1219-5": "Rampough Mountain",
            "1220-3": "Sand Hill",
            "1223-7": "Campo",
            "1224-5": "Capitan Grande",
            "1225-2": "Cuyapaipe",
            "1226-0": "La Posta",
            "1227-8": "Manzanita",
            "1228-6": "Mesa Grande",
            "1229-4": "San Pasqual",
            "1230-2": "Santa Ysabel",
            "1231-0": "Sycuan",
            "1234-4": "Attacapa",
            "1235-1": "Biloxi",
            "1236-9": "Georgetown (Eastern Tribes)",
            "1237-7": "Moor",
            "1238-5": "Nansemond",
            "1239-3": "Natchez",
            "1240-1": "Nausu Waiwash",
            "1241-9": "Nipmuc",
            "1242-7": "Paugussett",
            "1243-5": "Pocomoke Acohonock",
            "1244-3": "Southeastern Indians",
            "1245-0": "Susquehanock",
            "1246-8": "Tunica Biloxi",
            "1247-6": "Waccamaw-Siousan",
            "1248-4": "Wicomico",
            "1265-8": "Atsina",
            "1272-4": "Trinity",
            "1273-2": "Whilkut",
            "1282-3": "Iowa of Kansas-Nebraska",
            "1283-1": "Iowa of Oklahoma",
            "1286-4": "Cayuga",
            "1287-2": "Mohawk",
            "1288-0": "Oneida",
            "1289-8": "Onondaga",
            "1290-6": "Seneca",
            "1291-4": "Seneca Nation",
            "1292-2": "Seneca-Cayuga",
            "1293-0": "Tonawanda Seneca",
            "1294-8": "Tuscarora",
            "1295-5": "Wyandotte",
            "1306-0": "Oklahoma Kickapoo",
            "1307-8": "Texas Kickapoo",
            "1310-2": "Oklahoma Kiowa",
            "1313-6": "Jamestown",
            "1314-4": "Lower Elwha",
            "1315-1": "Port Gamble Klallam",
            "1326-8": "Matinecock",
            "1327-6": "Montauk",
            "1328-4": "Poospatuck",
            "1329-2": "Setauket",
            "1332-6": "La Jolla",
            "1333-4": "Pala",
            "1334-2": "Pauma",
            "1335-9": "Pechanga",
            "1336-7": "Soboba",
            "1337-5": "Twenty-Nine Palms",
            "1338-3": "Temecula",
            "1345-8": "Mountain Maidu",
            "1346-6": "Nishinam",
            "1359-9": "Illinois Miami",
            "1360-7": "Indiana Miami",
            "1361-5": "Oklahoma Miami",
            "1366-4": "Aroostook",
            "1383-9": "Alamo Navajo",
            "1384-7": "Canoncito Navajo",
            "1385-4": "Ramah Navajo",
            "1392-0": "Alsea",
            "1393-8": "Celilo",
            "1394-6": "Columbia",
            "1395-3": "Kalapuya",
            "1396-1": "Molala",
            "1397-9": "Talakamish",
            "1398-7": "Tenino",
            "1399-5": "Tillamook",
            "1400-1": "Wenatchee",
            "1401-9": "Yahooskin",
            "1412-6": "Burt Lake Ottawa",
            "1413-4": "Michigan Ottawa",
            "1414-2": "Oklahoma Ottawa",
            "1417-5": "Bishop",
            "1418-3": "Bridgeport",
            "1419-1": "Burns Paiute",
            "1420-9": "Cedarville",
            "1421-7": "Fort Bidwell",
            "1422-5": "Fort Independence",
            "1423-3": "Kaibab",
            "1424-1": "Las Vegas",
            "1425-8": "Lone Pine",
            "1426-6": "Lovelock",
            "1427-4": "Malheur Paiute",
            "1428-2": "Moapa",
            "1429-0": "Northern Paiute",
            "1430-8": "Owens Valley",
            "1431-6": "Pyramid Lake",
            "1432-4": "San Juan Southern Paiute",
            "1433-2": "Southern Paiute",
            "1434-0": "Summit Lake",
            "1435-7": "Utu Utu Gwaitu Paiute",
            "1436-5": "Walker River",
            "1437-3": "Yerington Paiute",
            "1442-3": "Indian Township",
            "1443-1": "Pleasant Point Passamaquoddy",
            "1446-4": "Oklahoma Pawnee",
            "1451-4": "Oklahoma Peoria",
            "1454-8": "Marshantucket Pequot",
            "1457-1": "Gila River Pima-Maricopa",
            "1458-9": "Salt River Pima-Maricopa",
            "1465-4": "Central Pomo",
            "1466-2": "Dry Creek",
            "1467-0": "Eastern Pomo",
            "1468-8": "Kashia",
            "1469-6": "Northern Pomo",
            "1470-4": "Scotts Valley",
            "1471-2": "Stonyford",
            "1472-0": "Sulphur Bank",
            "1475-3": "Nebraska Ponca",
            "1476-1": "Oklahoma Ponca",
            "1479-5": "Citizen Band Potawatomi",
            "1480-3": "Forest County",
            "1481-1": "Hannahville",
            "1482-9": "Huron Potawatomi",
            "1483-7": "Pokagon Potawatomi",
            "1484-5": "Prairie Band",
            "1485-2": "Wisconsin Potawatomi",
            "1490-2": "Acoma",
            "1491-0": "Arizona Tewa",
            "1492-8": "Cochiti",
            "1493-6": "Hopi",
            "1494-4": "Isleta",
            "1495-1": "Jemez",
            "1496-9": "Keres",
            "1497-7": "Laguna",
            "1498-5": "Nambe",
            "1499-3": "Picuris",
            "1500-8": "Piro",
            "1501-6": "Pojoaque",
            "1502-4": "San Felipe",
            "1503-2": "San Ildefonso",
            "1504-0": "San Juan Pueblo",
            "1505-7": "San Juan De",
            "1506-5": "San Juan",
            "1507-3": "Sandia",
            "1508-1": "Santa Ana",
            "1509-9": "Santa Clara",
            "1510-7": "Santo Domingo",
            "1511-5": "Taos",
            "1512-3": "Tesuque",
            "1513-1": "Tewa",
            "1514-9": "Tigua",
            "1515-6": "Zia",
            "1516-4": "Zuni",
            "1519-8": "Duwamish",
            "1520-6": "Kikiallus",
            "1521-4": "Lower Skagit",
            "1522-2": "Muckleshoot",
            "1523-0": "Nisqually",
            "1524-8": "Nooksack",
            "1525-5": "Port Madison",
            "1526-3": "Puyallup",
            "1527-1": "Samish",
            "1528-9": "Sauk-Suiattle",
            "1529-7": "Skokomish",
            "1530-5": "Skykomish",
            "1531-3": "Snohomish",
            "1532-1": "Snoqualmie",
            "1533-9": "Squaxin Island",
            "1534-7": "Steilacoom",
            "1535-4": "Stillaguamish",
            "1536-2": "Suquamish",
            "1537-0": "Swinomish",
            "1538-8": "Tulalip",
            "1539-6": "Upper Skagit",
            "1552-9": "Iowa Sac and Fox",
            "1553-7": "Missouri Sac and Fox",
            "1554-5": "Oklahoma Sac and Fox",
            "1567-7": "Big Cypress",
            "1568-5": "Brighton",
            "1569-3": "Florida Seminole",
            "1570-1": "Hollywood Seminole",
            "1571-9": "Oklahoma Seminole",
            "1574-3": "San Manual",
            "1579-2": "Absentee Shawnee",
            "1580-0": "Eastern Shawnee",
            "1587-5": "Battle Mountain",
            "1588-3": "Duckwater",
            "1589-1": "Elko",
            "1590-9": "Ely",
            "1591-7": "Goshute",
            "1592-5": "Panamint",
            "1593-3": "Ruby Valley",
            "1594-1": "Skull Valley",
            "1595-8": "South Fork Shoshone",
            "1596-6": "Te-Moak Western Shoshone",
            "1597-4": "Timbi-Sha Shoshone",
            "1598-2": "Washakie",
            "1599-0": "Wind River Shoshone",
            "1600-6": "Yomba",
            "1603-0": "Duck Valley",
            "1604-8": "Fallon",
            "1605-5": "Fort McDermitt",
            "1610-5": "Blackfoot Sioux",
            "1611-3": "Brule Sioux",
            "1612-1": "Cheyenne River Sioux",
            "1613-9": "Crow Creek Sioux",
            "1614-7": "Dakota Sioux",
            "1615-4": "Flandreau Santee",
            "1616-2": "Fort Peck",
            "1617-0": "Lake Traverse Sioux",
            "1618-8": "Lower Brule Sioux",
            "1619-6": "Lower Sioux",
            "1620-4": "Mdewakanton Sioux",
            "1621-2": "Miniconjou",
            "1622-0": "Oglala Sioux",
            "1623-8": "Pine Ridge Sioux",
            "1624-6": "Pipestone Sioux",
            "1625-3": "Prairie Island Sioux",
            "1626-1": "Prior Lake Sioux",
            "1627-9": "Rosebud Sioux",
            "1628-7": "Sans Arc Sioux",
            "1629-5": "Santee Sioux",
            "1630-3": "Sisseton-Wahpeton",
            "1631-1": "Sisseton Sioux",
            "1632-9": "Spirit Lake Sioux",
            "1633-7": "Standing Rock Sioux",
            "1634-5": "Teton Sioux",
            "1635-2": "Two Kettle Sioux",
            "1636-0": "Upper Sioux",
            "1637-8": "Wahpekute Sioux",
            "1638-6": "Wahpeton Sioux",
            "1639-4": "Wazhaza Sioux",
            "1640-2": "Yankton Sioux",
            "1641-0": "Yanktonai Sioux",
            "1654-3": "Ak-Chin",
            "1655-0": "Gila Bend",
            "1656-8": "San Xavier",
            "1657-6": "Sells",
            "1668-3": "Cow Creek Umpqua",
            "1671-7": "Allen Canyon",
            "1672-5": "Uintah Ute",
            "1673-3": "Ute Mountain Ute",
            "1680-8": "Gay Head Wampanoag",
            "1681-6": "Mashpee Wampanoag",
            "1688-1": "Alpine",
            "1689-9": "Carson",
            "1690-7": "Dresslerville",
            "1697-2": "Ho-chunk",
            "1698-0": "Nebraska Winnebago",
            "1705-3": "Table Bluff",
            "1712-9": "Barrio Libre",
            "1713-7": "Pascua Yaqui",
            "1718-6": "Chukchansi",
            "1719-4": "Tachi",
            "1720-2": "Tule River",
            "1725-1": "Cocopah",
            "1726-9": "Havasupai",
            "1727-7": "Hualapai",
            "1728-5": "Maricopa",
            "1729-3": "Mohave",
            "1730-1": "Quechan",
            "1731-9": "Yavapai",
            "1733-5": "Coast Yurok",
            "1739-2": "Alaskan Athabascan",
            "1811-9": "Southeast Alaska",
            "1842-4": "Greenland Eskimo",
            "1844-0": "Inupiat Eskimo",
            "1891-1": "Siberian Eskimo",
            "1896-0": "Yupik Eskimo",
            "1968-7": "Alutiiq Aleut",
            "1972-9": "Bristol Bay Aleut",
            "1984-4": "Chugach Aleut",
            "1990-1": "Eyak",
            "1992-7": "Koniag Aleut",
            "2002-4": "Sugpiaq",
            "2004-0": "Suqpigaq",
            "2006-5": "Unangan Aleut",
            "1740-0": "Ahtna",
            "1741-8": "Alatna",
            "1742-6": "Alexander",
            "1743-4": "Allakaket",
            "1744-2": "Alanvik",
            "1745-9": "Anvik",
            "1746-7": "Arctic",
            "1747-5": "Beaver",
            "1748-3": "Birch Creek",
            "1749-1": "Cantwell",
            "1750-9": "Chalkyitsik",
            "1751-7": "Chickaloon",
            "1752-5": "Chistochina",
            "1753-3": "Chitina",
            "1754-1": "Circle",
            "1755-8": "Cook Inlet",
            "1756-6": "Copper Center",
            "1757-4": "Copper River",
            "1758-2": "Dot Lake",
            "1759-0": "Doyon",
            "1760-8": "Eagle",
            "1761-6": "Eklutna",
            "1762-4": "Evansville",
            "1763-2": "Fort Yukon",
            "1764-0": "Gakona",
            "1765-7": "Galena",
            "1766-5": "Grayling",
            "1767-3": "Gulkana",
            "1768-1": "Healy Lake",
            "1769-9": "Holy Cross",
            "1770-7": "Hughes",
            "1771-5": "Huslia",
            "1772-3": "Iliamna",
            "1773-1": "Kaltag",
            "1774-9": "Kluti Kaah",
            "1775-6": "Knik",
            "1776-4": "Koyukuk",
            "1777-2": "Lake Minchumina",
            "1778-0": "Lime",
            "1779-8": "Mcgrath",
            "1780-6": "Manley Hot Springs",
            "1781-4": "Mentasta Lake",
            "1782-2": "Minto",
            "1783-0": "Nenana",
            "1784-8": "Nikolai",
            "1785-5": "Ninilchik",
            "1786-3": "Nondalton",
            "1787-1": "Northway",
            "1788-9": "Nulato",
            "1789-7": "Pedro Bay",
            "1790-5": "Rampart",
            "1791-3": "Ruby",
            "1792-1": "Salamatof",
            "1793-9": "Seldovia",
            "1794-7": "Slana",
            "1795-4": "Shageluk",
            "1796-2": "Stevens",
            "1797-0": "Stony River",
            "1798-8": "Takotna",
            "1799-6": "Tanacross",
            "1800-2": "Tanaina",
            "1801-0": "Tanana",
            "1802-8": "Tanana Chiefs",
            "1803-6": "Tazlina",
            "1804-4": "Telida",
            "1805-1": "Tetlin",
            "1806-9": "Tok",
            "1807-7": "Tyonek",
            "1808-5": "Venetie",
            "1809-3": "Wiseman",
            "1813-5": "Tlingit-Haida",
            "1837-4": "Tsimshian",
            "1845-7": "Ambler",
            "1846-5": "Anaktuvuk",
            "1847-3": "Anaktuvuk Pass",
            "1848-1": "Arctic Slope Inupiat",
            "1849-9": "Arctic Slope Corporation",
            "1850-7": "Atqasuk",
            "1851-5": "Barrow",
            "1852-3": "Bering Straits Inupiat",
            "1853-1": "Brevig Mission",
            "1854-9": "Buckland",
            "1855-6": "Chinik",
            "1856-4": "Council",
            "1857-2": "Deering",
            "1858-0": "Elim",
            "1859-8": "Golovin",
            "1860-6": "Inalik Diomede",
            "1861-4": "Inupiaq",
            "1862-2": "Kaktovik",
            "1863-0": "Kawerak",
            "1864-8": "Kiana",
            "1865-5": "Kivalina",
            "1866-3": "Kobuk",
            "1867-1": "Kotzebue",
            "1868-9": "Koyuk",
            "1869-7": "Kwiguk",
            "1870-5": "Mauneluk Inupiat",
            "1871-3": "Nana Inupiat",
            "1872-1": "Noatak",
            "1873-9": "Nome",
            "1874-7": "Noorvik",
            "1875-4": "Nuiqsut",
            "1876-2": "Point Hope",
            "1877-0": "Point Lay",
            "1878-8": "Selawik",
            "1879-6": "Shaktoolik",
            "1880-4": "Shishmaref",
            "1881-2": "Shungnak",
            "1882-0": "Solomon",
            "1883-8": "Teller",
            "1884-6": "Unalakleet",
            "1885-3": "Wainwright",
            "1886-1": "Wales",
            "1887-9": "White Mountain",
            "1888-7": "White Mountain Inupiat",
            "1889-5": "Mary's Igloo",
            "1892-9": "Gambell",
            "1893-7": "Savoonga",
            "1894-5": "Siberian Yupik",
            "1897-8": "Akiachak",
            "1898-6": "Akiak",
            "1899-4": "Alakanuk",
            "1900-0": "Aleknagik",
            "1901-8": "Andreafsky",
            "1902-6": "Aniak",
            "1903-4": "Atmautluak",
            "1904-2": "Bethel",
            "1905-9": "Bill Moore's Slough",
            "1906-7": "Bristol Bay Yupik",
            "1907-5": "Calista Yupik",
            "1908-3": "Chefornak",
            "1909-1": "Chevak",
            "1910-9": "Chuathbaluk",
            "1911-7": "Clark's Point",
            "1912-5": "Crooked Creek",
            "1913-3": "Dillingham",
            "1914-1": "Eek",
            "1915-8": "Ekuk",
            "1916-6": "Ekwok",
            "1917-4": "Emmonak",
            "1918-2": "Goodnews Bay",
            "1919-0": "Hooper Bay",
            "1920-8": "Iqurmuit (Russian Mission)",
            "1921-6": "Kalskag",
            "1922-4": "Kasigluk",
            "1923-2": "Kipnuk",
            "1924-0": "Koliganek",
            "1925-7": "Kongiganak",
            "1926-5": "Kotlik",
            "1927-3": "Kwethluk",
            "1928-1": "Kwigillingok",
            "1929-9": "Levelock",
            "1930-7": "Lower Kalskag",
            "1931-5": "Manokotak",
            "1932-3": "Marshall",
            "1933-1": "Mekoryuk",
            "1934-9": "Mountain Village",
            "1935-6": "Naknek",
            "1936-4": "Napaumute",
            "1937-2": "Napakiak",
            "1938-0": "Napaskiak",
            "1939-8": "Newhalen",
            "1940-6": "New Stuyahok",
            "1941-4": "Newtok",
            "1942-2": "Nightmute",
            "1943-0": "Nunapitchukv",
            "1944-8": "Oscarville",
            "1945-5": "Pilot Station",
            "1946-3": "Pitkas Point",
            "1947-1": "Platinum",
            "1948-9": "Portage Creek",
            "1949-7": "Quinhagak",
            "1950-5": "Red Devil",
            "1951-3": "St. Michael",
            "1952-1": "Scammon Bay",
            "1953-9": "Sheldon's Point",
            "1954-7": "Sleetmute",
            "1955-4": "Stebbins",
            "1956-2": "Togiak",
            "1957-0": "Toksook",
            "1958-8": "Tulukskak",
            "1959-6": "Tuntutuliak",
            "1960-4": "Tununak",
            "1961-2": "Twin Hills",
            "1962-0": "Georgetown (Yupik-Eskimo)",
            "1963-8": "St. Mary's",
            "1964-6": "Umkumiate",
            "1969-5": "Tatitlek",
            "1970-3": "Ugashik",
            "1973-7": "Chignik",
            "1974-5": "Chignik Lake",
            "1975-2": "Egegik",
            "1976-0": "Igiugig",
            "1977-8": "Ivanof Bay",
            "1978-6": "King Salmon",
            "1979-4": "Kokhanok",
            "1980-2": "Perryville",
            "1981-0": "Pilot Point",
            "1982-8": "Port Heiden",
            "1985-1": "Chenega",
            "1986-9": "Chugach Corporation",
            "1987-7": "English Bay",
            "1988-5": "Port Graham",
            "1993-5": "Akhiok",
            "1994-3": "Agdaagux",
            "1995-0": "Karluk",
            "1996-8": "Kodiak",
            "1997-6": "Larsen Bay",
            "1998-4": "Old Harbor",
            "1999-2": "Ouzinkie",
            "2000-8": "Port Lions",
            "2007-3": "Akutan",
            "2008-1": "Aleut Corporation",
            "2009-9": "Aleutian",
            "2010-7": "Aleutian Islander",
            "2011-5": "Atka",
            "2012-3": "Belkofski",
            "2013-1": "Chignik Lagoon",
            "2014-9": "King Cove",
            "2015-6": "False Pass",
            "2016-4": "Nelson Lagoon",
            "2017-2": "Nikolski",
            "2018-0": "Pauloff Harbor",
            "2019-8": "Qagan Toyagungin",
            "2020-6": "Qawalangin",
            "2021-4": "St. George",
            "2022-2": "St. Paul",
            "2023-0": "Sand Point",
            "2024-8": "South Naknek",
            "2025-5": "Unalaska",
            "2026-3": "Unga",
            "1814-3": "Angoon",
            "1815-0": "Central Council of Tlingit and Haida Tribes",
            "1816-8": "Chilkat",
            "1817-6": "Chilkoot",
            "1818-4": "Craig",
            "1819-2": "Douglas",
            "1820-0": "Haida",
            "1821-8": "Hoonah",
            "1822-6": "Hydaburg",
            "1823-4": "Kake",
            "1824-2": "Kasaan",
            "1825-9": "Kenaitze",
            "1826-7": "Ketchikan",
            "1827-5": "Klawock",
            "1828-3": "Pelican",
            "1829-1": "Petersburg",
            "1830-9": "Saxman",
            "1831-7": "Sitka",
            "1832-5": "Tenakee Springs",
            "1833-3": "Tlingit",
            "1834-1": "Wrangell",
            "1835-8": "Yakutat",
            "1838-2": "Metlakatla",
            "2135-2": "Hispanic or Latino"
        }
    },
    "2.16.840.1.113883.3.26.1.1": {
        name: "Medication Route FDA",
        table: {
            "C38192": "AURICULAR (OTIC)",
            "C38193": "BUCCAL",
            "C38194": "CONJUNCTIVAL",
            "C38675": "CUTANEOUS",
            "C38197": "DENTAL",
            "C38633": "ELECTRO-OSMOSIS",
            "C38205": "ENDOCERVICAL",
            "C38206": "ENDOSINUSIAL",
            "C38208": "ENDOTRACHEAL",
            "C38209": "ENTERAL",
            "C38210": "EPIDURAL",
            "C38211": "EXTRA-AMNIOTIC",
            "C38212": "EXTRACORPOREAL",
            "C38200": "HEMODIALYSIS",
            "C38215": "INFILTRATION",
            "C38219": "INTERSTITIAL",
            "C38220": "INTRA-ABDOMINAL",
            "C38221": "INTRA-AMNIOTIC",
            "C38222": "INTRA-ARTERIAL",
            "C38223": "INTRA-ARTICULAR",
            "C38224": "INTRABILIARY",
            "C38225": "INTRABRONCHIAL",
            "C38226": "INTRABURSAL",
            "C38227": "INTRACARDIAC",
            "C38228": "INTRACARTILAGINOUS",
            "C38229": "INTRACAUDAL",
            "C38230": "INTRACAVERNOUS",
            "C38231": "INTRACAVITARY",
            "C38232": "INTRACEREBRAL",
            "C38233": "INTRACISTERNAL",
            "C38234": "INTRACORNEAL",
            "C38217": "INTRACORONAL, DENTAL",
            "C38218": "INTRACORONARY",
            "C38235": "INTRACORPORUS CAVERNOSUM",
            "C38238": "INTRADERMAL",
            "C38239": "INTRADISCAL",
            "C38240": "INTRADUCTAL",
            "C38241": "INTRADUODENAL",
            "C38242": "INTRADURAL",
            "C38243": "INTRAEPIDERMAL",
            "C38245": "INTRAESOPHAGEAL",
            "C38246": "INTRAGASTRIC",
            "C38247": "INTRAGINGIVAL",
            "C38249": "INTRAILEAL",
            "C38250": "INTRALESIONAL",
            "C38251": "INTRALUMINAL",
            "C38252": "INTRALYMPHATIC",
            "C38253": "INTRAMEDULLARY",
            "C38254": "INTRAMENINGEAL",
            "C28161": "INTRAMUSCULAR",
            "C38255": "INTRAOCULAR",
            "C38256": "INTRAOVARIAN",
            "C38257": "INTRAPERICARDIAL",
            "C38258": "INTRAPERITONEAL",
            "C38259": "INTRAPLEURAL",
            "C38260": "INTRAPROSTATIC",
            "C38261": "INTRAPULMONARY",
            "C38262": "INTRASINAL",
            "C38263": "INTRASPINAL",
            "C38264": "INTRASYNOVIAL",
            "C38265": "INTRATENDINOUS",
            "C38266": "INTRATESTICULAR",
            "C38267": "INTRATHECAL",
            "C38207": "INTRATHORACIC",
            "C38268": "INTRATUBULAR",
            "C38269": "INTRATUMOR",
            "C38270": "INTRATYMPANIC",
            "C38272": "INTRAUTERINE",
            "C38273": "INTRAVASCULAR",
            "C38276": "INTRAVENOUS",
            "C38277": "INTRAVENTRICULAR",
            "C38278": "INTRAVESICAL",
            "C38280": "INTRAVITREAL",
            "C38203": "IONTOPHORESIS",
            "C38281": "IRRIGATION",
            "C38282": "LARYNGEAL",
            "C38284": "NASAL",
            "C38285": "NASOGASTRIC",
            "C48623": "NOT APPLICABLE",
            "C38286": "OCCLUSIVE DRESSING TECHNIQUE",
            "C38287": "OPHTHALMIC",
            "C38288": "ORAL",
            "C38289": "OROPHARYNGEAL",
            "C38291": "PARENTERAL",
            "C38676": "PERCUTANEOUS",
            "C38292": "PERIARTICULAR",
            "C38677": "PERIDURAL",
            "C38293": "PERINEURAL",
            "C38294": "PERIODONTAL",
            "C38295": "RECTAL",
            "C38216": "RESPIRATORY (INHALATION)",
            "C38296": "RETROBULBAR",
            "C38198": "SOFT TISSUE",
            "C38297": "SUBARACHNOID",
            "C38298": "SUBCONJUNCTIVAL",
            "C38299": "SUBCUTANEOUS",
            "C38300": "SUBLINGUAL",
            "C38301": "SUBMUCOSAL",
            "C38304": "TOPICAL",
            "C38305": "TRANSDERMAL",
            "C38283": "TRANSMUCOSAL",
            "C38307": "TRANSPLACENTAL",
            "C38308": "TRANSTRACHEAL",
            "C38309": "TRANSTYMPANIC",
            "C38312": "URETERAL",
            "C38271": "URETHRAL"
        }
    },
    "2.16.840.1.113883.11.20.9.33": {
        name: "IND Roleclass Codes",
        uri: "",
        code_system: "2.16.840.1.113883.5.110",
        table: {
            "PRS": "Personal Relationship",
            "NOK": "Next of Kin",
            "CAREGIVER": "Caregiver",
            "AGNT": "Agent",
            "GUAR": "Guarantor",
            "ECON": "Emergency Contact"
        }
    },
    "2.16.840.1.113883.5.139": {
        name: "Domain TimingEvent",
        table: {
            //https://groups.google.com/forum/#!msg/ccda_samples/WawmwNMYT_8/pqnp5bG1IygJ
            "AC": "before meal",
            "ACD": "before lunch",
            "ACM": "before breakfast",
            "ACV": "before dinner",
            "C": "with meal",
            "CD": "with lunch",
            "CM": "with breakfast",
            "CV": "with dinner",
            "HS": "at bedtime",
            "IC": "between meals",
            "ICD": "between lunch and dinner",
            "ICM": "between breakfast and lunch",
            "ICV": "between dinner and bedtime",
            "PC": "after meal",
            "PCD": "after lunch",
            "PCM": "after breakfast",
            "PCV": "after dinner",
            "WAKE": "upon waking"
        }
    },
    "2.16.840.1.113883.6.14": {
        name: "HCPCS",
        uri: ""
    },
    "2.16.840.1.113883.3.88.12.3221.8.9": {
        name: "Body Site Value Set"
    },
    "2.16.840.1.113883.5.7": {
        name: "ActPriority"
    }
};

},{}],54:[function(require,module,exports){
"use strict";

exports.validator = require("./lib/validator.js");

},{"./lib/validator.js":74}],55:[function(require,module,exports){
module.exports = {
	"id": "allergy",
    "type": "object",
    "properties": {
        "date_time": {
            "$ref": "cda_date"
        },
        "identifiers": {
            "type": "array",
            "minItems": 1,
            "items": {
                "$ref": "cda_id"
            }
        },
        "observation": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "$ref": "cda_id"
                    }
                },

                "negation_indicator": {
                    "type": "boolean"
                },

                "allergen": {
                    "$ref": "cda_coded_entry"
                },
                "intolerance": {
                    "$ref": "cda_coded_entry"
                },
                "date_time": {
                    "$ref": "cda_date"
                },
                "status": {
                    "$ref": "cda_coded_entry"
                },

                "reactions": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "properties": {
                            "identifiers": {
                                "type": "array",
                                "minItems": 1,
                                "items": {
                                    "$ref": "cda_id"
                                }
                            },

                            "date_time": {
                                "$ref": "cda_date"
                            },
                            "reaction": {
                                "$ref": "cda_coded_entry"
                            },
                            "severity": {
                                "type": "object",
                                "properties": {
                                    "code": {
                                        "$ref": "cda_coded_entry"
                                    },
                                    "interpretation": {
                                        "$ref": "cda_coded_entry"
                                    }
                                },
                                "additionalProperties": false
                            }
                        },
                        "additionalProperties": false

                    }
                },
                "severity": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "$ref": "cda_coded_entry"
                        },
                        "interpretation": {
                            "$ref": "cda_coded_entry"
                        }
                    },
                    "additionalProperties": false
                }
            },
            "additionalProperties": false
        }
    },
    "additionalProperties": false
};

},{}],56:[function(require,module,exports){
module.exports = {
    "id": "claim",
    "type": "object",
    "properties": {
        "number": {
            "type": "string"
        },
        "diagnosis": {
            "type": "array",
            "items": {
                "$ref": "cda_coded_entry"
            }
        },
        "name": {
            "type": "string"
        },
        "payer": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "date_time": {
            "$ref": "cda_date"
        },
        "service": {
            "type": "string"
        },
        "type": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "phone": {
            "type": "array",
            "items": {
                "$ref": "cda_phone"
            }
        },
        "performer": {
            "type": "array",
            "items": {
                "$ref": "cda_performer"
            }
        },
        "charges": {
            "type": "object",
            "properties": {
                "insurance_paid": {
                    "type": "string"
                },
                "negotiated_price": {
                    "type": "string"
                },
                "patient_responsibility": {
                    "type": "string"
                },
                "price_billed": {
                    "type": "string"
                },
                "provider_paid": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "lines": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "line": {
                        "type": "string"
                    },
                    "charges": {
                        "type": "object",
                        "properties": {
                            "insurance_paid": {
                                "type": "string"
                            },
                            "negotiated_price": {
                                "type": "string"
                            },
                            "patient_responsibility": {
                                "type": "string"
                            },
                            "price_billed": {
                                "type": "string"
                            },
                            "provider_paid": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "drug": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "modifier": {
                        "type": "array",
                        "items": {
                            "properties": {
                                "code": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "name": {
                                    "type": "string"
                                }
                            },
                            "additionalProperties": false
                        }
                    },
                    "number": {
                        "type": "string"
                    },
                    "place_of_service": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "procedure": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "quantity": {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "performer": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_performer"
                        }
                    },
                    "revenue": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "date_time": {
                        "$ref": "cda_date"
                    },
                    "type": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "type_of_service_code": {
                        "type": "string"
                    },
                    "type_of_service": {
                        "type": "number"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    "additionalProperties": false
};

},{}],57:[function(require,module,exports){
module.exports = [{
    	"id": "cda_address",
        "type": "object",
        "properties": {
            "city": {
                "type": "string"
            },
            "country": {
                "type": "string"
            },
            "state": {
                "type": "string"
            },
            "street_lines": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "minItems": 1
            },
            "use": {
                "type": "string"
            },
            "zip": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "street_lines",
            "city"
        ]
    }, {
        "id": "cda_date_element",
        "type": "object",
        "properties": {
            "date": {
                "type": "string",
                "format": "date-time"
            },
            "precision": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "date"
        ]
    }, {
        "id": "cda_date",
        "type": "object",
        "properties": {
            "low": {
                "$ref": "cda_date_element"
            },
            "point": {
                "$ref": "cda_date_element"
            },
            "high": {
                "$ref": "cda_date_element"
            },
            "center": {
                "$ref": "cda_date_element"
            }
        },
        "additionalProperties": false,
        "minProperties": 1
    }, {
    	"id": "cda_phone",
        "type": "object",
        "properties": {
            "number": {
                "type": "string"
            },
            "type": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "number"
        ]
    }, {
    	"id": "cda_email",
        "type": "object",
        "properties": {
            "address": {
                "type": "string"
            },
            "type": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "address"
        ]
    }, {
    	"id": "cda_id",
        "type": "object",
        "properties": {
            "extension": {
                "type": "string"
            },
            "identifier": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "identifier"
        ]
    }, {
    	"id": "cda_name",
        "type": "object",
        "properties": {
            "prefix": {
                "type": "string"
            },
            "first": {
                "type": "string"
            },
            "last": {
                "type": "string"
            },
            "middle": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "suffix": {
                "type": "string"
            }
        },
        "additionalProperties": false
    }, {
    	"id": "cda_coded_entry",
        "type": "object",
        "properties": {
            "code_system_name": {
                "type": "string"
            },
            "code": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "translations": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "code_system_name": {
                            "type": "string"
                        },
                        "code": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        },
                        "nullFlavor": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": false,
                    "minProperties": 1
                },
                "minItems": 1
            }
        },
        "minProperties": 1,
        "additionalProperties": false
    }, {
    	"id": "cda_physical_quantity",
        "type": "object",
        "properties": {
            "unit": {
                "type": "string"
            },
            "value": {
                "type": "number"
            }
        },
        "additionalProperties": false,
        "required": [
            "unit",
            "value"
        ]
    }, {
    	"id": "cda_location",
        "type": "object",
        "properties": {
            "address": {
                "type": "array",
                "items": {
                    "$ref": "cda_address"
                },
                "minItems": 1
            },
            "location_type": {
                "$ref": "cda_coded_entry"
            },
            "name": {
                "type": "string"
            },
            "phone": {
                "type": "array",
                "items": {
                    "$ref": "cda_phone"
                }
            }
        },
        "required": [
            "name"
        ],
        "additionalProperties": false
    }, {
    	"id": "cda_organization",
        "type": "object",
        "properties": {
            "address": {
                "type": "array",
                "items": {
                    "$ref": "cda_address"
                }
            },
            "identifiers": {
                "type": "array",
                "items": {
                    "$ref": "cda_id"
                }
            },
            "name": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "phone": {
                "type": "array",
                "items": {
                    "$ref": "cda_phone"
                }
            },
            "email": {
                "type": "array",
                "items": {
                    "$ref": "cda_email"
                }
            }
        },
        "additionalProperties": false
    }, {
    	"id": "cda_performer",
        "type": "object",
        "properties": {
            "type": {
                "type": "string"
            },
            "address": {
                "type": "array",
                "items": {
                    "$ref": "cda_address"
                }
            },
            "identifiers": {
                "type": "array",
                "items": {
                    "$ref": "cda_id"
                }
            },
            "name": {
                "type": "array",
                "items": {
                    "anyOf": [{
                        "$ref": "cda_name"
                    }, {
                        "type": "string"
                    }]
                }
            },
            "organization": {
                "type": "array",
                "items": {
                    "$ref": "cda_organization"
                }
            },
            "phone": {
                "type": "array",
                "items": {
                    "$ref": "cda_phone"
                }
            },
            "email": {
                "type": "array",
                "items": {
                    "$ref": "cda_email"
                }
            },
            "code": {
                "type": "array",
                "items": {
                    "$ref": "cda_coded_entry"
                }
            }
        },
        "additionalProperties": false
    }
];

},{}],58:[function(require,module,exports){
module.exports = {
    "id": "demographics",
    "type": "object",
    "properties": {
        "name": {
            "$ref": "cda_name"
        },
        "dob": {
            "$ref": "cda_date"
        },
        "gender": {
            "type": "string"
        },
        "identifiers": {
            "type": "array",
            "minItems": 1,
            "items": {
                "$ref": "cda_id"
            }
        },
        "marital_status": {
            "type": "string"
        },
        "addresses": {
            "type": "array",
            "items": {
                "$ref": "cda_address"
            },
            "minItems": 1
        },
        "phone": {
            "type": "array",
            "items": {
                "$ref": "cda_phone"
            }
        },
        "email": {
            "type": "array",
            "items": {
                "$ref": "cda_email"
            }
        },
        "race_ethnicity": {
            "type": "string"
        },
        "religion": {
            "type": "string"
        },
        "birthplace": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string"
                },
                "country": {
                    "type": "string"
                },
                "state": {
                    "type": "string"
                },
                "zip": {
                    "type": "string"
                },
                "use": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "minProperties": 1,
            "required": [
                "city",
                "country"
            ]
        },
        "guardians": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "addresses": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_address"
                        }
                    },
                    "names": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_name"
                        }
                    },
                    "phone": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_phone"
                        }
                    },
                    "relation": {
                        "type": "string"
                    }
                },
                "required": [
                    "names"
                ],
                "additionalProperties": false,
                "minProperties": 1
            },
            "minItems": 1
        },
        "languages": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "language": {
                        "type": "string"
                    },
                    "mode": {
                        "type": "string"
                    },
                    "preferred": {
                        "type": "boolean"
                    },
                    "proficiency": {
                        "type": "string"
                    }
                },
                "additionalProperties": false,
                "required": [
                    "language"
                ]
            },
            "minItems": 1
        }
    },
    "additionalProperties": false,
    "required": [
        "name"
    ]
};

},{}],59:[function(require,module,exports){
module.exports = {
	"id": "document_model",
    "type": "object",
    "properties": {
        "data": {
            "type": "object",
            "properties": {
                "allergies": {
                    "$ref": "allergies"
                },
                "demographics": {
                    "$ref": "demographics"
                },
                "encounters": {
                    "$ref": "encounters"
                },
                "immunizations": {
                    "$ref": "immunizations"
                },
                "medications": {
                    "$ref": "medications"
                },
                "problems": {
                    "$ref": "problems"
                },
                "plan_of_care": {
                    "$ref": "plan_of_care"
                },
                "procedures": {
                    "$ref": "procedures"
                },
                "results": {
                    "$ref": "results"
                },
                "social_history": {
                    "$ref": "social_history"
                },
                "payers": {
                    "$ref": "payers"
                },
                "vitals": {
                    "$ref": "vitals"
                },
                "claims": {
                    "$ref": "claims"
                },
                "providers": {
                    "$ref": "providers"
                },
                "medical_devices": {
                    "$ref": "medical_devices"
                },
                "family_history": {
                    "$ref": "family_history"
                }
            },
            "additionalProperties": true
        },
        "errors": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "meta": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string"
                },
                "version": {
                    "type": "string"
                }
            },
            "additionalProperties": true
        }
    }
};

},{}],60:[function(require,module,exports){
module.exports = {
    "id": "encounter",
    "type": "object",
    "properties": {
        "date_time": {
            "$ref": "cda_date"
        },
        "encounter": {
            "$ref": "cda_coded_entry"
        },
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "value": {
                        "$ref": "cda_coded_entry"
                    },
                    "identifiers": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_id"

                        }
                    },
                    "date_time": {
                        "$ref": "cda_date"
                    }
                },
                "additionalProperties": false
            }
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"

            }
        },
        "performers": {
            "type": "array",
            "items": {
                "$ref": "cda_performer"
            }
        },
        "locations": {
            "type": "array",
            "items": {
                "$ref": "cda_location"
            }
        }
    },
    "additionalProperties": false,
    "required": ["encounter"]
};

},{}],61:[function(require,module,exports){
module.exports = {
	"id": "family_history_entry",
    "type": "object",
    "properties": {
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            },
            "minItems": 1
        },
        "name": {
            "$ref": "cda_name"
        },
        "relationship": {
            "type": "string"
        },
        "dead": {
            "type": "boolean"
        },
        "conditions": {
            "type": "array",
            "items": {
                "$ref": "cda_coded_entry"
            },
            "minItems": 1
        },
        "dob": {
            "$ref": "cda_date"
        }
    },
    "additionalProperties": false,
    "required": ["name", "relationship"]
};

},{}],62:[function(require,module,exports){
module.exports = {
	"id": "immunization",
    "type": "object",
    "properties": {
        "date_time": {
            "$ref": "cda_date"
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            }
        },
        "status": {
            "type": "string"
        },
        "sequence_number": {
            "type": "string"
        },
        "administration": {
            "type": "object",
            "properties": {
                "dose": {
                    "$ref": "cda_physical_quantity"
                },
                "route": {
                    "$ref": "cda_coded_entry"
                },
                "body_site": {
                    "$ref": "cda_coded_entry"
                },
                "form": {
                    "$ref": "cda_coded_entry"
                }
            },
            "additionalProperties": false
        },
        "product": {
            "type": "object",
            "properties": {
                "lot_number": {
                    "type": "string"
                },
                "manufacturer": {
                    "type": "string"
                },
                "product": {
                    "$ref": "cda_coded_entry"
                }
            },
            "required": [
                "product"
            ],
            "additionalProperties": false
        },
        "performer": {
            "$ref": "cda_performer"
        },
        "instructions": {
            "type": "object",
            "properties": {
                "free_text": {
                    "type": "string"
                },
                "code": {
                    "$ref": "cda_coded_entry"
                }
            },

            "additionalProperties": false
        },
        "refusal_reason": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "status",
        "product"
    ]
};

},{}],63:[function(require,module,exports){
"use strict";

var common_models = require('./common_models');

var demographics = require('./demographics');
var allergy = require('./allergy');
var encounter = require('./encounter');
var immunization = require('./immunization');
var medication = require('./medication');
var problem = require('./problem');
var procedure = require('./procedure');
var plan_of_care_entry = require('./plan_of_care_entry');
var payers = require('./payers');
var result = require('./result');
var social_history = require('./social_history');
var vital = require('./vital');
var claim = require('./claim');
var provider = require('./provider');
var medical_device = require('./medical_device');
var family_history_entry = require('./family_history_entry');
var document_model = require('./document_model');

var schemas = module.exports = [].concat(common_models);
schemas.push(demographics);
schemas.push(allergy);
schemas.push(encounter);
schemas.push(immunization);
schemas.push(medication);
schemas.push(problem);
schemas.push(procedure);
schemas.push(plan_of_care_entry);
schemas.push(payers);
schemas.push(result);
schemas.push(social_history);
schemas.push(vital);
schemas.push(claim);
schemas.push(provider);
schemas.push(medical_device);
schemas.push(family_history_entry);

var sections = {
	allergies: 'allergy',
	encounters: 'encounter',
	immunizations: 'immunization',
	medications: 'medication',
	problems: 'problem',
	procedures: 'procedure',
	plan_of_care: 'plan_of_care_entry',
	results: 'result',
	vitals: 'vital',
	claims: 'claim',
	providers: 'provider',
	medical_devices: 'medical_device',
	family_history: 'family_history_entry'
};

Object.keys(sections).forEach(function(sectionName) {
	var schema = {
		"id": sectionName,
	    "type": "array",
    	"items": {
        	"$ref": sections[sectionName]
    	}
    };
    schemas.push(schema);
});

schemas.push(document_model);

},{"./allergy":55,"./claim":56,"./common_models":57,"./demographics":58,"./document_model":59,"./encounter":60,"./family_history_entry":61,"./immunization":62,"./medical_device":64,"./medication":65,"./payers":66,"./plan_of_care_entry":67,"./problem":68,"./procedure":69,"./provider":70,"./result":71,"./social_history":72,"./vital":73}],64:[function(require,module,exports){
module.exports = {
	"id": "medical_device",
    "type": "object",
    "properties": {
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            },
            "minItems": 1
        },
        "product": {
            "$ref": "cda_coded_entry"
        },
        "status": {
            "type": "string"
        },
        "date_time": {
            "$ref": "cda_date"
        }
    },
    "additionalProperties": false,
    "required": ["product"]
};

},{}],65:[function(require,module,exports){
module.exports = {
	"id": "medication",
    "type": "object",
    "properties": {
        "date_time": {
            "$ref": "cda_date"
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            },
            "minItems": 1
        },
        "sig": {
            "type": "string"
        },
        "status": {
            "type": "string"
        },
        "administration": {
            "type": "object",
            "properties": {
                "dose": {
                    "$ref": "cda_physical_quantity"
                },
                "form": {
                    "$ref": "cda_coded_entry"
                },
                "rate": {
                    "$ref": "cda_physical_quantity"
                },
                "route": {
                    "$ref": "cda_coded_entry"
                },
                "dose_restriction": {
                    "$ref": "cda_physical_quantity"
                },
                "site": {
                    "$ref": "cda_coded_entry"
                },
                "interval": {
                    "type": "object",
                    "properties": {
                        "xsiType": {
                            "type": "string"
                        },
                        "phase": {
                            "$ref": "cda_date"
                        },
                        "period": {
                            "$ref": "cda_physical_quantity"
                        },
                        "frequency": {
                            "type": "boolean"
                        },
                        "alignment": {
                            "type": "string"
                        },
                        "event": {
                            "type": "string"
                        },
                        "event_offset": {
                            "type": "object",
                            "properties": {
                                "low": {
                                    "$ref": "cda_physical_quantity"
                                },
                                "high": {
                                    "$ref": "cda_physical_quantity"
                                },
                                "center": {
                                    "$ref": "cda_physical_quantity"
                                },
                                "width": {
                                    "$ref": "cda_physical_quantity"
                                }

                            },
                            "additionalProperties": false

                        }
                    },
                    "additionalProperties": false
                }

            },
            "additionalProperties": false,
            "minProperties": 1
        },

        "precondition": {
            "type": "object",
            "properties": {
                "code": {
                    "$ref": "cda_coded_entry"
                },
                "value": {
                    "$ref": "cda_coded_entry"
                }
            },
            "additionalProperties": false
        },
        "product": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "cda_id"
                    },
                    "minItems": 1
                },
                "product": {
                    "$ref": "cda_coded_entry"
                },
                "unencoded_name": {
                    "type": "string"
                },
                "manufacturer": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "minProperties": 1,
            "required": [
                "product"
            ]
        },
        "supply": {
            "type": "object",
            "properties": {
                "date_time": {
                    "$ref": "cda_date"
                },
                "repeatNumber": {
                    "type": "string"
                },
                "quantity": {
                    "type": "string"
                },
                "author": {
                    "type": "object",
                    "properties": {
                        "identifiers": {
                            "type": "array",
                            "items": {
                                "$ref": "cda_id"
                            },
                            "minItems": 1
                        },
                        "date_time": {
                            "$ref": "cda_date"
                        },
                        "name": {
                            "$ref": "cda_name"
                        },
                        "organization": {
                            "$ref": "cda_organization"
                        }
                    },
                    "additionalProperties": false
                }
            },
            "additionalProperties": false
        },
        "indication": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "cda_id"
                    },
                    "minItems": 1
                },
                "code": {
                    "$ref": "cda_coded_entry"
                },
                "date_time": {
                    "$ref": "cda_date"
                },
                "value": {
                    "$ref": "cda_coded_entry"
                }
            },
            "additionalProperties": false
        },
        "performer": {
            "$ref": "cda_performer"
        },
        "drug_vehicle": {
            "$ref": "cda_coded_entry"
        },
        "dispense": {
            "type": "object",
            "properties": {
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "cda_id"
                    },
                    "minItems": 1
                },
                "performer": {
                    "$ref": "cda_performer"
                }
            },
            "additionalProperties": false
        }
    },
    "additionalProperties": false,
    "minProperties": 1,
    "required": [
        "product",
        "status"
    ]
};

},{}],66:[function(require,module,exports){
module.exports = {
	"id": "payers",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "identifiers": {
                "type": "array",
                "items": {
                    "$ref": "cda_id"
                },
                "minItems": 1
            },
            "policy": {
                "type": "object",
                "properties": {
                    "identifiers": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_id"
                        },
                        "minItems": 1
                    },
                    "code": {

                        "$ref": "cda_coded_entry"

                    },
                    "insurance": {
                        "type": "object",
                        "properties": {
                            "code": {
								"$ref": "cda_coded_entry"
                            },
                            "performer": {
                                "$ref": "cda_performer"
                            }
                        },
                        "additionalProperties": false
                    }
                },
                "additionalProperties": false
            },
            "guarantor": {
                "type": "object",
                "properties": {
                    "code": {
                        "$ref": "cda_coded_entry"

                    },
                    "identifiers": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_id"
                        },
                        "minItems": 1
                    },
                    "address": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_address"
                        }
                    },
                    "phone": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_phone"
                        }
                    },
                    "name": {
                        "type": "array",
                        "items": {
                            "type": "object"
                        }
                    }
                },
                "additionalProperties": false
            },
            "participant": {
                "type": "object",
                "properties": {
                    "date_time": {
                        "$ref": "cda_date"
                    },
                    "code": {
                        "$ref": "cda_coded_entry"

                    },
                    "performer": {
                        "$ref": "cda_performer"
                    },
                    "name": {
                        "type": "array",
                        "items": {
                            "type": "object"
                        }
                    }
                },
                "additionalProperties": false
            },
            "policy_holder": {
                "type": "object",
                "properties": {
                    "performer": {
                        "type": "object",
                        "properties": {
                            "identifiers": {
                                "type": "array",
                                "items": {
                                    "$ref": "cda_id"
                                },
                                "minItems": 1
                            },
                            "address": {
                                "type": "array",
                                "items": {
                                    "$ref": "cda_address"
                                }
                            }
                        },
                        "additionalProperties": false
                    }
                },
                "additionalProperties": false
            },
            "authorization": {
                "type": "object",
                "properties": {
                    "identifiers": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_id"
                        },
                        "minItems": 1
                    },
                    "procedure": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "$ref": "cda_coded_entry"
                            }

                        },
                        "additionalProperties": false
                    }
                }
            }
        },
        "required": [
            "policy",
            "participant"
        ],
        "additionalProperties": false
    }
};

},{}],67:[function(require,module,exports){
module.exports = {
	"id": "plan_of_care_entry",
    "type": "object",
    "properties": {
        "plan": {
            "$ref": "cda_coded_entry"
        },
        "type": {
            "type": "string"
        },
        "date_time": {
            "$ref": "cda_date"
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            },
            "minItems": 1
        },
        "status": {
            "type": "string"
        }
    },
    "required": [
        "type"
    ],
    "additionalProperties": false
};

},{}],68:[function(require,module,exports){
module.exports = {
	"id": "problem",
    "type": "object",
    "properties": {
        "date_time": {
            "$ref": "cda_date"
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            }
        },
        "problem": {
            "type": "object",
            "properties": {
                "code": {
                    "$ref": "cda_coded_entry"
                },
                "date_time": {
                    "$ref": "cda_date"
                }
            },
            "additionalProperties": false
        },
        "negation_indicator": {
            "type": "boolean"
        },
        "onset_age": {
            "type": "string"
        },
        "onset_age_unit": {
            "type": "string"
        },
        "patient_status": {
            "type": "string"
        },
        "status": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                }
            }
        },
        "source_list_identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            }
        }
    },
    "additionalProperties": false,
    "required": ["problem"]
};

},{}],69:[function(require,module,exports){
module.exports = {
	"id": "procedure",
    "type": "object",
    "properties": {
        "procedure": {
            "$ref": "cda_coded_entry"
        },
        "procedure_type": {
            "type": "string"
        },
        "body_sites": {
            "type": "array",
            "items": {
                "$ref": "cda_coded_entry"
            },
            "minItems": 1
        },
        "specimen": {
            "type": "object",
            "properties": {
                "code": {
                    "$ref": "cda_coded_entry"
                },
                "identifiers": {
                    "type": "array",
                    "items": {
                        "$ref": "cda_id"
                    }
                }
            },
            "additionalProperties": false
        },
        "priority": {
            "$ref": "cda_coded_entry"
        },
        "date_time": {
            "$ref": "cda_date"
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            },
            "minItems": 1
        },
        "status": {
            "type": "string"
        },
        "performer": {
            "type": "array",
            "items": {
                "$ref": "cda_performer"
            }
        },
        "locations": {
            "type": "array",
            "items": {
                "$ref": "cda_location"
            }
        }
    },
    "required": [
        "procedure"
    ],
    "additionalProperties": false
}

},{}],70:[function(require,module,exports){
module.exports = {
	"id": "provider",
    "type": "object",
    "properties": {
        "date_time": {
            "$ref": "cda_date"
        },
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            }
        },
        "type": {
            "$ref": "cda_coded_entry"
        },
        "role": {
            "$ref": "cda_coded_entry"
        },
        "name": {
            "$ref": "cda_name"
        },
        "address": {
            "$ref": "cda_address"
        },
        "phone": {
            "type": "array",
            "items": {
                "$ref": "cda_phone"
            }
        },
        "email": {
            "type": "array",
            "items": {
                "$ref": "cda_phone"
            }
        },
        "organization": {
            "$ref": "cda_organization"
        }
    },
    "additionalProperties": false
};

},{}],71:[function(require,module,exports){
module.exports = {
	"id": "result",
    "type": "object",
    "properties": {
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            },
            "minItems": 1
        },
        "result_set": {
            "$ref": "cda_coded_entry"
        },
        "results": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "properties": {
                    "date_time": {
                        "$ref": "cda_date"
                    },
                    "identifiers": {
                        "type": "array",
                        "items": {
                            "$ref": "cda_id"
                        }
                    },
                    "interpretations": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "result": {
                        "$ref": "cda_coded_entry"
                    },
                    "status": {
                        "type": "string"
                    },
                    "unit": {
                        "type": "string"
                    },
                    "value": {
                        "type": "number"
                    },
                    "text": {
                        "type": "string"
                    },
                    "reference_range": {
                        "type": "object",
                        "properties": {
                            "text": {
                                "type": "string"
                            },
                            "low_value": {
                                "type": "number"
                            },
                            "low_unit": {
                                "type": "string"
                            },
                            "high_value": {
                                "type": "number"
                            },
                            "high_unit": {
                                "type": "string"
                            }
                        }
                    }
                },
                "required": [
                    "result",
                    "date_time",
                    "status"
                ],
                "additionalProperties": false
            }

        }
    },
    "additionalProperties": false,
    "required": [
        "results"
    ]
};

},{}],72:[function(require,module,exports){
module.exports = {
	"id": "social_history",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "date_time": {
                "$ref": "cda_date"
            },
            "value": {
                "type": "string"
            },
            "code": {
                "$ref": "cda_coded_entry"
            },
            "observation_value": {
                "type": "string"
            },
            "identifiers": {
                "type": "array",
                "items": {
                    "$ref": "cda_id"
                }
            }
        },
        "required": [
            "value"
        ],
        "additionalProperties": false
    },
    "additionalProperties": true
};

},{}],73:[function(require,module,exports){
module.exports = {
	"id": "vital",
    "type": "object",
    "properties": {
        "identifiers": {
            "type": "array",
            "items": {
                "$ref": "cda_id"
            },
            "minItems": 1
        },
        "vital": {
            "$ref": "cda_coded_entry"
        },
        "status": {
            "type": "string"
        },
        "date_time": {
            "$ref": "cda_date"
        },
        "interpretations": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "value": {
            "type": "number"
        },
        "unit": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": ["vital"]
};

},{}],74:[function(require,module,exports){
"use strict";

var ZSchema = require("z-schema");

var schemas = require('./schemas');

var Validator = function () {
    var zschema = new ZSchema({
        noExtraKeywords: true,
        noEmptyArrays: true
    });

    schemas.forEach(function (schema) {
        var schemasValid = zschema.validateSchema(schema);
    });

    this.schemaMap = schemas.reduce(function (r, schema) {
        r[schema.id] = schema;
        return r;
    }, {});

    this.zschema = zschema;
};

Validator.prototype.getLastError = function () {
    return this.lastError;
};

Validator.prototype.validate = function (obj, schemaName) {
    var schema = this.schemaMap[schemaName];
    if (schema) {
        var valid = this.zschema.validate(obj, schema);
        this.lastError = this.zschema.getLastErrors();
        return valid;
    } else {
        return false;
    }
};

Validator.prototype.validateDocumentModel = function (documentModel) {
    return this.validate(documentModel, 'document_model');
};

module.exports = new Validator();

},{"./schemas":63,"z-schema":84}],75:[function(require,module,exports){
"use strict";

module.exports = {

    INVALID_TYPE:                           "Expected type {0} but found type {1}",
    INVALID_FORMAT:                         "Object didn't pass validation for format {0}: {1}",
    ENUM_MISMATCH:                          "No enum match for: {0}",
    ANY_OF_MISSING:                         "Data does not match any schemas from 'anyOf'",
    ONE_OF_MISSING:                         "Data does not match any schemas from 'oneOf'",
    ONE_OF_MULTIPLE:                        "Data is valid against more than one schema from 'oneOf'",
    NOT_PASSED:                             "Data matches schema from 'not'",

    // Array errors
    ARRAY_LENGTH_SHORT:                     "Array is too short ({0}), minimum {1}",
    ARRAY_LENGTH_LONG:                      "Array is too long ({0}), maximum {1}",
    ARRAY_UNIQUE:                           "Array items are not unique (indexes {0} and {1})",
    ARRAY_ADDITIONAL_ITEMS:                 "Additional items not allowed",

    // Numeric errors
    MULTIPLE_OF:                            "Value {0} is not a multiple of {1}",
    MINIMUM:                                "Value {0} is less than minimum {1}",
    MINIMUM_EXCLUSIVE:                      "Value {0} is equal or less than exclusive minimum {1}",
    MAXIMUM:                                "Value {0} is greater than maximum {1}",
    MAXIMUM_EXCLUSIVE:                      "Value {0} is equal or greater than exclusive maximum {1}",

    // Object errors
    OBJECT_PROPERTIES_MINIMUM:              "Too few properties defined ({0}), minimum {1}",
    OBJECT_PROPERTIES_MAXIMUM:              "Too many properties defined ({0}), maximum {1}",
    OBJECT_MISSING_REQUIRED_PROPERTY:       "Missing required property: {0}",
    OBJECT_ADDITIONAL_PROPERTIES:           "Additional properties not allowed: {0}",
    OBJECT_DEPENDENCY_KEY:                  "Dependency failed - key must exist: {0} (due to key: {1})",

    // String errors
    MIN_LENGTH:                             "String is too short ({0} chars), minimum {1}",
    MAX_LENGTH:                             "String is too long ({0} chars), maximum {1}",
    PATTERN:                                "String does not match pattern {0}: {1}",

    // Schema validation errors
    KEYWORD_TYPE_EXPECTED:                  "Keyword '{0}' is expected to be of type '{1}'",
    KEYWORD_UNDEFINED_STRICT:               "Keyword '{0}' must be defined in strict mode",
    KEYWORD_UNEXPECTED:                     "Keyword '{0}' is not expected to appear in the schema",
    KEYWORD_MUST_BE:                        "Keyword '{0}' must be {1}",
    KEYWORD_DEPENDENCY:                     "Keyword '{0}' requires keyword '{1}'",
    KEYWORD_PATTERN:                        "Keyword '{0}' is not a valid RegExp pattern: {1}",
    KEYWORD_VALUE_TYPE:                     "Each element of keyword '{0}' array must be a '{1}'",
    UNKNOWN_FORMAT:                         "There is no validation function for format '{0}'",
    CUSTOM_MODE_FORCE_PROPERTIES:           "{0} must define at least one property if present",

    // Remote errors
    REF_UNRESOLVED:                         "Reference has not been resolved during compilation: {0}",
    UNRESOLVABLE_REFERENCE:                 "Reference could not be resolved: {0}",
    SCHEMA_NOT_REACHABLE:                   "Validator was not able to read schema with uri: {0}",
    SCHEMA_TYPE_EXPECTED:                   "Schema is expected to be of type 'object'",
    SCHEMA_NOT_AN_OBJECT:                   "Schema is not an object: {0}",
    ASYNC_TIMEOUT:                          "{0} asynchronous task(s) have timed out after {1} ms",
    PARENT_SCHEMA_VALIDATION_FAILED:        "Schema failed to validate against its parent schema, see inner errors for details.",
    REMOTE_NOT_VALID:                       "Remote reference didn't compile successfully: {0}"

};

},{}],76:[function(require,module,exports){
/*jshint maxlen: false*/

var FormatValidators = {
    "date": function (date) {
        if (typeof date !== "string") {
            return true;
        }
        // full-date from http://tools.ietf.org/html/rfc3339#section-5.6
        var matches = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(date);
        if (matches === null) {
            return false;
        }
        // var year = matches[1];
        // var month = matches[2];
        // var day = matches[3];
        if (matches[2] < "01" || matches[2] > "12" || matches[3] < "01" || matches[3] > "31") {
            return false;
        }
        return true;
    },
    "date-time": function (dateTime) {
        if (typeof dateTime !== "string") {
            return true;
        }
        // date-time from http://tools.ietf.org/html/rfc3339#section-5.6
        var s = dateTime.toLowerCase().split("t");
        if (!FormatValidators.date(s[0])) {
            return false;
        }
        var matches = /^([0-9]{2}):([0-9]{2}):([0-9]{2})(.[0-9]+)?(z|([+-][0-9]{2}:[0-9]{2}))$/.exec(s[1]);
        if (matches === null) {
            return false;
        }
        // var hour = matches[1];
        // var minute = matches[2];
        // var second = matches[3];
        // var fraction = matches[4];
        // var timezone = matches[5];
        if (matches[1] > "23" || matches[2] > "59" || matches[3] > "59") {
            return false;
        }
        return true;
    },
    "email": function (email) {
        if (typeof email !== "string") {
            return true;
        }
        // use regex from owasp: https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository
        return /^[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(email);
    },
    "hostname": function (hostname) {
        if (typeof hostname !== "string") {
            return true;
        }
        /*
            http://json-schema.org/latest/json-schema-validation.html#anchor114
            A string instance is valid against this attribute if it is a valid
            representation for an Internet host name, as defined by RFC 1034, section 3.1 [RFC1034].

            http://tools.ietf.org/html/rfc1034#section-3.5

            <digit> ::= any one of the ten digits 0 through 9
            var digit = /[0-9]/;

            <letter> ::= any one of the 52 alphabetic characters A through Z in upper case and a through z in lower case
            var letter = /[a-zA-Z]/;

            <let-dig> ::= <letter> | <digit>
            var letDig = /[0-9a-zA-Z]/;

            <let-dig-hyp> ::= <let-dig> | "-"
            var letDigHyp = /[-0-9a-zA-Z]/;

            <ldh-str> ::= <let-dig-hyp> | <let-dig-hyp> <ldh-str>
            var ldhStr = /[-0-9a-zA-Z]+/;

            <label> ::= <letter> [ [ <ldh-str> ] <let-dig> ]
            var label = /[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?/;

            <subdomain> ::= <label> | <subdomain> "." <label>
            var subdomain = /^[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?(\.[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?)*$/;

            <domain> ::= <subdomain> | " "
            var domain = null;
        */
        var valid = /^[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?(\.[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?)*$/.test(hostname);
        if (valid) {
            // the sum of all label octets and label lengths is limited to 255.
            if (hostname.length > 255) { return false; }
            // Each node has a label, which is zero to 63 octets in length
            var labels = hostname.split(".");
            for (var i = 0; i < labels.length; i++) { if (labels[i].length > 63) { return false; } }
        }
        return valid;
    },
    "host-name": function (hostname) {
        return FormatValidators.hostname.call(this, hostname);
    },
    "ipv4": function (ipv4) {
        if (typeof ipv4 !== "string") { return true; }
        if (ipv4.indexOf(".") === -1) { return false; }
        // https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipv4);
    },
    "ipv6": function (ipv6) {
        // Stephen Ryan at Dartware @ http://forums.intermapper.com/viewtopic.php?t=452
        return typeof ipv6 !== "string" || /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(ipv6);
    },
    "regex": function (str) {
        try {
            RegExp(str);
            return true;
        } catch (e) {
            return false;
        }
    },
    "uri": function (uri) {
        if (this.options.strictUris) {
            return FormatValidators["strict-uri"].apply(this, arguments);
        }
        // https://github.com/zaggino/z-schema/issues/18
        // RegExp from http://tools.ietf.org/html/rfc3986#appendix-B
        return typeof uri !== "string" || RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?").test(uri);
    },
    "strict-uri": function (uri) {
        // http://mathiasbynens.be/demo/url-regex
        // https://gist.github.com/dperini/729294
        return typeof uri !== "string" || RegExp(
            "^" +
                // protocol identifier
                "(?:(?:https?|ftp)://)" +
                // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                    // IP address exclusion
                    // private & local networks
                    "(?!10(?:\\.\\d{1,3}){3})" +
                    "(?!127(?:\\.\\d{1,3}){3})" +
                    "(?!169\\.254(?:\\.\\d{1,3}){2})" +
                    "(?!192\\.168(?:\\.\\d{1,3}){2})" +
                    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                    // IP address dotted notation octets
                    // excludes loopback network 0.0.0.0
                    // excludes reserved space >= 224.0.0.0
                    // excludes network & broacast addresses
                    // (first & last IP address of each class)
                    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                    // host name
                    "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
                    // domain name
                    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
                    // TLD identifier
                    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                ")" +
                // port number
                "(?::\\d{2,5})?" +
                // resource path
                "(?:/[^\\s]*)?" +
            "$", "i"
        ).test(uri);
    }
};

module.exports = FormatValidators;

},{}],77:[function(require,module,exports){
"use strict";

var FormatValidators  = require("./FormatValidators"),
    Report            = require("./Report"),
    Utils             = require("./Utils");

var JsonValidators = {
    multipleOf: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.1.2
        if (typeof json !== "number") {
            return;
        }
        if (Utils.whatIs(json / schema.multipleOf) !== "integer") {
            report.addError("MULTIPLE_OF", [json, schema.multipleOf], null, schema.description);
        }
    },
    maximum: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.2.2
        if (typeof json !== "number") {
            return;
        }
        if (schema.exclusiveMaximum !== true) {
            if (json > schema.maximum) {
                report.addError("MAXIMUM", [json, schema.maximum], null, schema.description);
            }
        } else {
            if (json >= schema.maximum) {
                report.addError("MAXIMUM_EXCLUSIVE", [json, schema.maximum], null, schema.description);
            }
        }
    },
    exclusiveMaximum: function () {
        // covered in maximum
    },
    minimum: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.3.2
        if (typeof json !== "number") {
            return;
        }
        if (schema.exclusiveMinimum !== true) {
            if (json < schema.minimum) {
                report.addError("MINIMUM", [json, schema.minimum], null, schema.description);
            }
        } else {
            if (json <= schema.minimum) {
                report.addError("MINIMUM_EXCLUSIVE", [json, schema.minimum], null, schema.description);
            }
        }
    },
    exclusiveMinimum: function () {
        // covered in minimum
    },
    maxLength: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.1.2
        if (typeof json !== "string") {
            return;
        }
        if (json.length > schema.maxLength) {
            report.addError("MAX_LENGTH", [json.length, schema.maxLength], null, schema.description);
        }
    },
    minLength: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.2.2
        if (typeof json !== "string") {
            return;
        }
        if (json.length < schema.minLength) {
            report.addError("MIN_LENGTH", [json.length, schema.minLength], null, schema.description);
        }
    },
    pattern: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.3.2
        if (typeof json !== "string") {
            return;
        }
        if (RegExp(schema.pattern).test(json) === false) {
            report.addError("PATTERN", [schema.pattern, json], null, schema.description);
        }
    },
    additionalItems: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.1.2
        if (!Array.isArray(json)) {
            return;
        }
        // if the value of "additionalItems" is boolean value false and the value of "items" is an array,
        // the json is valid if its size is less than, or equal to, the size of "items".
        if (schema.additionalItems === false && Array.isArray(schema.items)) {
            if (json.length > schema.items.length) {
                report.addError("ARRAY_ADDITIONAL_ITEMS", null, null, schema.description);
            }
        }
    },
    items: function () { /*report, schema, json*/
        // covered in additionalItems
    },
    maxItems: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.2.2
        if (!Array.isArray(json)) {
            return;
        }
        if (json.length > schema.maxItems) {
            report.addError("ARRAY_LENGTH_LONG", [json.length, schema.maxItems], null, schema.description);
        }
    },
    minItems: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.3.2
        if (!Array.isArray(json)) {
            return;
        }
        if (json.length < schema.minItems) {
            report.addError("ARRAY_LENGTH_SHORT", [json.length, schema.minItems], null, schema.description);
        }
    },
    uniqueItems: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.4.2
        if (!Array.isArray(json)) {
            return;
        }
        if (schema.uniqueItems === true) {
            var matches = [];
            if (Utils.isUniqueArray(json, matches) === false) {
                report.addError("ARRAY_UNIQUE", matches, null, schema.description);
            }
        }
    },
    maxProperties: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.1.2
        if (Utils.whatIs(json) !== "object") {
            return;
        }
        var keysCount = Object.keys(json).length;
        if (keysCount > schema.maxProperties) {
            report.addError("OBJECT_PROPERTIES_MAXIMUM", [keysCount, schema.maxProperties], null, schema.description);
        }
    },
    minProperties: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.2.2
        if (Utils.whatIs(json) !== "object") {
            return;
        }
        var keysCount = Object.keys(json).length;
        if (keysCount < schema.minProperties) {
            report.addError("OBJECT_PROPERTIES_MINIMUM", [keysCount, schema.minProperties], null, schema.description);
        }
    },
    required: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.3.2
        if (Utils.whatIs(json) !== "object") {
            return;
        }
        var idx = schema.required.length;
        while (idx--) {
            var requiredPropertyName = schema.required[idx];
            if (json[requiredPropertyName] === undefined) {
                report.addError("OBJECT_MISSING_REQUIRED_PROPERTY", [requiredPropertyName], null, schema.description);
            }
        }
    },
    additionalProperties: function (report, schema, json) {
        // covered in properties and patternProperties
        if (schema.properties === undefined && schema.patternProperties === undefined) {
            return JsonValidators.properties.call(this, report, schema, json);
        }
    },
    patternProperties: function (report, schema, json) {
        // covered in properties
        if (schema.properties === undefined) {
            return JsonValidators.properties.call(this, report, schema, json);
        }
    },
    properties: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.4.2
        if (Utils.whatIs(json) !== "object") {
            return;
        }
        var properties = schema.properties !== undefined ? schema.properties : {};
        var patternProperties = schema.patternProperties !== undefined ? schema.patternProperties : {};
        if (schema.additionalProperties === false) {
            // The property set of the json to validate.
            var s = Object.keys(json);
            // The property set from "properties".
            var p = Object.keys(properties);
            // The property set from "patternProperties".
            var pp = Object.keys(patternProperties);
            // remove from "s" all elements of "p", if any;
            s = Utils.difference(s, p);
            // for each regex in "pp", remove all elements of "s" which this regex matches.
            var idx = pp.length;
            while (idx--) {
                var regExp = RegExp(pp[idx]),
                    idx2 = s.length;
                while (idx2--) {
                    if (regExp.test(s[idx2]) === true) {
                        s.splice(idx2, 1);
                    }
                }
            }
            // Validation of the json succeeds if, after these two steps, set "s" is empty.
            if (s.length > 0) {
                report.addError("OBJECT_ADDITIONAL_PROPERTIES", [s], null, schema.description);
            }
        }
    },
    dependencies: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.5.2
        if (Utils.whatIs(json) !== "object") {
            return;
        }

        var keys = Object.keys(schema.dependencies),
            idx = keys.length;

        while (idx--) {
            // iterate all dependencies
            var dependencyName = keys[idx];
            if (json[dependencyName]) {
                var dependencyDefinition = schema.dependencies[dependencyName];
                if (Utils.whatIs(dependencyDefinition) === "object") {
                    // if dependency is a schema, validate against this schema
                    exports.validate.call(this, report, dependencyDefinition, json);
                } else { // Array
                    // if dependency is an array, object needs to have all properties in this array
                    var idx2 = dependencyDefinition.length;
                    while (idx2--) {
                        var requiredPropertyName = dependencyDefinition[idx2];
                        if (json[requiredPropertyName] === undefined) {
                            report.addError("OBJECT_DEPENDENCY_KEY", [requiredPropertyName, dependencyName], null, schema.description);
                        }
                    }
                }
            }
        }
    },
    enum: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.1.2
        var match = false,
            idx = schema.enum.length;
        while (idx--) {
            if (Utils.areEqual(json, schema.enum[idx])) {
                match = true;
                break;
            }
        }
        if (match === false) {
            report.addError("ENUM_MISMATCH", [json], null, schema.description);
        }
    },
    /*
    type: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.2.2
        // type is handled before this is called so ignore
    },
    */
    allOf: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.3.2
        var idx = schema.allOf.length;
        while (idx--) {
            if (exports.validate.call(this, report, schema.allOf[idx], json) === false) {
                break;
            }
        }
    },
    anyOf: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.4.2
        var subReports = [],
            passed = false,
            idx = schema.anyOf.length;

        while (idx-- && passed === false) {
            var subReport = new Report(report);
            subReports.push(subReport);
            passed = exports.validate.call(this, subReport, schema.anyOf[idx], json);
        }

        if (passed === false) {
            report.addError("ANY_OF_MISSING", undefined, subReports, schema.description);
        }
    },
    oneOf: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.5.2
        var passes = 0,
            subReports = [],
            idx = schema.oneOf.length;

        while (idx--) {
            var subReport = new Report(report);
            subReports.push(subReport);
            if (exports.validate.call(this, subReport, schema.oneOf[idx], json) === true) {
                passes++;
            }
        }

        if (passes === 0) {
            report.addError("ONE_OF_MISSING", undefined, subReports, schema.description);
        } else if (passes > 1) {
            report.addError("ONE_OF_MULTIPLE", null, null, schema.description);
        }
    },
    not: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.6.2
        var subReport = new Report(report);
        if (exports.validate.call(this, subReport, schema.not, json) === true) {
            report.addError("NOT_PASSED", null, null, schema.description);
        }
    },
    definitions: function () { /*report, schema, json*/
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.7.2
        // nothing to do here
    },
    format: function (report, schema, json) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.2
        var formatValidatorFn = FormatValidators[schema.format];
        if (typeof formatValidatorFn === "function") {
            if (formatValidatorFn.length === 2) {
                // async
                report.addAsyncTask(formatValidatorFn, [json], function (result) {
                    if (result !== true) {
                        report.addError("INVALID_FORMAT", [schema.format, json], null, schema.description);
                    }
                });
            } else {
                // sync
                if (formatValidatorFn.call(this, json) !== true) {
                    report.addError("INVALID_FORMAT", [schema.format, json], null, schema.description);
                }
            }
        } else {
            report.addError("UNKNOWN_FORMAT", [schema.format], null, schema.description);
        }
    }
};

var recurseArray = function (report, schema, json) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.2

    var idx = json.length;

    // If "items" is an array, this situation, the schema depends on the index:
    // if the index is less than, or equal to, the size of "items",
    // the child instance must be valid against the corresponding schema in the "items" array;
    // otherwise, it must be valid against the schema defined by "additionalItems".
    if (Array.isArray(schema.items)) {

        while (idx--) {
            // equal to doesnt make sense here
            if (idx < schema.items.length) {
                report.path.push(idx.toString());
                exports.validate.call(this, report, schema.items[idx], json[idx]);
                report.path.pop();
            } else {
                // might be boolean, so check that it's an object
                if (typeof schema.additionalItems === "object") {
                    report.path.push(idx.toString());
                    exports.validate.call(this, report, schema.additionalItems, json[idx]);
                    report.path.pop();
                }
            }
        }

    } else if (typeof schema.items === "object") {

        // If items is a schema, then the child instance must be valid against this schema,
        // regardless of its index, and regardless of the value of "additionalItems".
        while (idx--) {
            report.path.push(idx.toString());
            exports.validate.call(this, report, schema.items, json[idx]);
            report.path.pop();
        }

    }
};

var recurseObject = function (report, schema, json) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3

    // If "additionalProperties" is absent, it is considered present with an empty schema as a value.
    // In addition, boolean value true is considered equivalent to an empty schema.
    var additionalProperties = schema.additionalProperties;
    if (additionalProperties === true || additionalProperties === undefined) {
        additionalProperties = {};
    }

    // p - The property set from "properties".
    var p = schema.properties ? Object.keys(schema.properties) : [];

    // pp - The property set from "patternProperties". Elements of this set will be called regexes for convenience.
    var pp = schema.patternProperties ? Object.keys(schema.patternProperties) : [];

    // m - The property name of the child.
    var keys = Object.keys(json),
        idx = keys.length;

    while (idx--) {
        var m = keys[idx],
            propertyValue = json[m];

        // s - The set of schemas for the child instance.
        var s = [];

        // 1. If set "p" contains value "m", then the corresponding schema in "properties" is added to "s".
        if (p.indexOf(m) !== -1) {
            s.push(schema.properties[m]);
        }

        // 2. For each regex in "pp", if it matches "m" successfully, the corresponding schema in "patternProperties" is added to "s".
        var idx2 = pp.length;
        while (idx2--) {
            var regexString = pp[idx2];
            if (RegExp(regexString).test(m) === true) {
                s.push(schema.patternProperties[regexString]);
            }
        }

        // 3. The schema defined by "additionalProperties" is added to "s" if and only if, at this stage, "s" is empty.
        if (s.length === 0 && additionalProperties !== false) {
            s.push(additionalProperties);
        }

        // we are passing tests even without this assert because this is covered by properties check
        // if s is empty in this stage, no additionalProperties are allowed
        // report.expect(s.length !== 0, 'E001', m);

        // Instance property value must pass all schemas from s
        idx2 = s.length;
        while (idx2--) {
            report.path.push(m);
            exports.validate.call(this, report, s[idx2], propertyValue);
            report.path.pop();
        }
    }
};

exports.validate = function (report, schema, json) {

    // check if schema is an object
    var to = Utils.whatIs(schema);
    if (to !== "object") {
        report.addError("SCHEMA_NOT_AN_OBJECT", [to], null, schema.description);
        return false;
    }

    // check if schema is empty, everything is valid against empty schema
    var keys = Object.keys(schema);
    if (keys.length === 0) {
        return true;
    }

    // this method can be called recursively, so we need to remember our root
    var isRoot = false;
    if (!report.rootSchema) {
        report.rootSchema = schema;
        isRoot = true;
    }

    // follow schema.$ref keys
    if (schema.$ref !== undefined) {
        // avoid infinite loop with maxRefs
        var maxRefs = 99;
        while (schema.$ref && maxRefs > 0) {
            if (!schema.__$refResolved) {
                report.addError("REF_UNRESOLVED", [schema.$ref], null, schema.description);
                break;
            } else if (schema.__$refResolved === schema) {
                break;
            } else {
                schema = schema.__$refResolved;
                keys = Object.keys(schema);
            }
            maxRefs--;
        }
        if (maxRefs === 0) {
            throw new Error("Circular dependency by $ref references!");
        }
    }

    // type checking first
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.2.2
    var jsonType = Utils.whatIs(json);
    if (schema.type) {
        if (typeof schema.type === "string") {
            if (jsonType !== schema.type && (jsonType !== "integer" || schema.type !== "number")) {
                report.addError("INVALID_TYPE", [schema.type, jsonType], null, schema.description);
                return false;
            }
        } else {
            if (schema.type.indexOf(jsonType) === -1 && (jsonType !== "integer" || schema.type.indexOf("number") === -1)) {
                report.addError("INVALID_TYPE", [schema.type, jsonType], null, schema.description);
                return false;
            }
        }
    }

    // now iterate all the keys in schema and execute validation methods
    var idx = keys.length;
    while (idx--) {
        if (JsonValidators[keys[idx]]) {
            JsonValidators[keys[idx]].call(this, report, schema, json);
            if (report.errors.length) { break; }
        }
    }

    if (jsonType === "array") {
        recurseArray.call(this, report, schema, json);
    } else if (jsonType === "object") {
        recurseObject.call(this, report, schema, json);
    }

    // we don't need the root pointer anymore
    if (isRoot) {
        report.rootSchema = undefined;
    }

    // return valid just to be able to break at some code points
    return report.errors.length === 0;

};

},{"./FormatValidators":76,"./Report":79,"./Utils":83}],78:[function(require,module,exports){
// Number.isFinite polyfill
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isfinite
if (typeof Number.isFinite !== "function") {
    Number.isFinite = function isFinite(value) {
        // 1. If Type(number) is not Number, return false.
        if (typeof value !== "number") {
            return false;
        }
        // 2. If number is NaN, +∞, or −∞, return false.
        if (value !== value || value === Infinity || value === -Infinity) {
            return false;
        }
        // 3. Otherwise, return true.
        return true;
    };
}

},{}],79:[function(require,module,exports){
(function (process){
"use strict";

var Errors = require("./Errors");

function Report(parentOrOptions) {
    this.parentReport = parentOrOptions instanceof Report ?
                            parentOrOptions :
                            undefined;

    this.options = parentOrOptions instanceof Report ?
                       parentOrOptions.options :
                       parentOrOptions || {};

    this.errors = [];
    this.path = [];
    this.asyncTasks = [];
}

Report.prototype.isValid = function () {
    if (this.asyncTasks.length > 0) {
        throw new Error("Async tasks pending, can't answer isValid");
    }
    return this.errors.length === 0;
};

Report.prototype.addAsyncTask = function (fn, args, asyncTaskResultProcessFn) {
    this.asyncTasks.push([fn, args, asyncTaskResultProcessFn]);
};

Report.prototype.processAsyncTasks = function (timeout, callback) {

    var validationTimeout = timeout || 2000,
        tasksCount        = this.asyncTasks.length,
        idx               = tasksCount,
        timedOut          = false,
        self              = this;

    function finish() {
        process.nextTick(function () {
            var valid = self.errors.length === 0,
                err   = valid ? undefined : self.errors;
            callback(err, valid);
        });
    }

    function respond(asyncTaskResultProcessFn) {
        return function (asyncTaskResult) {
            if (timedOut) { return; }
            asyncTaskResultProcessFn(asyncTaskResult);
            if (--tasksCount === 0) {
                finish();
            }
        };
    }

    if (tasksCount === 0 || this.errors.length > 0) {
        finish();
        return;
    }

    while (idx--) {
        var task = this.asyncTasks[idx];
        task[0].apply(null, task[1].concat(respond(task[2])));
    }

    setTimeout(function () {
        if (tasksCount > 0) {
            timedOut = true;
            self.addError("ASYNC_TIMEOUT", [tasksCount, validationTimeout]);
            callback(self.errors, false);
        }
    }, validationTimeout);

};

Report.prototype.getPath = function () {
    var path = [];
    if (this.parentReport) {
        path = path.concat(this.parentReport.path);
    }
    path = path.concat(this.path);

    if (this.options.reportPathAsArray !== true) {
        // Sanitize the path segments (http://tools.ietf.org/html/rfc6901#section-4)
        path = "#/" + path.map(function (segment) {
            return segment.replace("~", "~0").replace("/", "~1");
        }).join("/");
    }
    return path;
};

Report.prototype.addError = function (errorCode, params, subReports, schemaDescription) {
    if (!errorCode) { throw new Error("No errorCode passed into addError()"); }
    if (!Errors[errorCode]) { throw new Error("No errorMessage known for code " + errorCode); }

    params = params || [];

    var idx = params.length,
        errorMessage = Errors[errorCode];
    while (idx--) {
        errorMessage = errorMessage.replace("{" + idx + "}", params[idx]);
    }

    var err = {
        code: errorCode,
        params: params,
        message: errorMessage,
        path: this.getPath()
    };

    if (schemaDescription) {
        err.description = schemaDescription;
    }

    if (subReports != null) {
        if (!Array.isArray(subReports)) {
            subReports = [subReports];
        }
        err.inner = [];
        idx = subReports.length;
        while (idx--) {
            var subReport = subReports[idx],
                idx2 = subReport.errors.length;
            while (idx2--) {
                err.inner.push(subReport.errors[idx2]);
            }
        }
        if (err.inner.length === 0) {
            err.inner = undefined;
        }
    }

    this.errors.push(err);
};

module.exports = Report;

}).call(this,require('_process'))
},{"./Errors":75,"_process":86}],80:[function(require,module,exports){
"use strict";

var Report              = require("./Report");
var SchemaCompilation   = require("./SchemaCompilation");
var SchemaValidation    = require("./SchemaValidation");

function decodeJSONPointer(str) {
    // http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-07#section-3
    return decodeURIComponent(str).replace(/~[0-1]/g, function (x) {
        return x === "~1" ? "/" : "~";
    });
}

function getRemotePath(uri) {
    var io = uri.indexOf("#");
    return io === -1 ? uri : uri.slice(0, io);
}

function getQueryPath(uri) {
    var io = uri.indexOf("#");
    var res = io === -1 ? undefined : uri.slice(io + 1);
    // WARN: do not slice slash, #/ means take root and go down from it
    // if (res && res[0] === "/") { res = res.slice(1); }
    return res;
}

function findId(schema, id) {
    // process only arrays and objects
    if (typeof schema !== "object" || schema === null) {
        return;
    }

    // no id means root so return itself
    if (!id) {
        return schema;
    }

    if (schema.id) {
        if (schema.id === id || schema.id[0] === "#" && schema.id.substring(1) === id) {
            return schema;
        }
    }

    var idx, result;
    if (Array.isArray(schema)) {
        idx = schema.length;
        while (idx--) {
            result = findId(schema[idx], id);
            if (result) { return result; }
        }
    } else {
        var keys = Object.keys(schema);
        idx = keys.length;
        while (idx--) {
            var k = keys[idx];
            if (k.indexOf("__$") === 0) {
                continue;
            }
            result = findId(schema[k], id);
            if (result) { return result; }
        }
    }
}

exports.cacheSchemaByUri = function (uri, schema) {
    var remotePath = getRemotePath(uri);
    if (remotePath) {
        this.cache[remotePath] = schema;
    }
};

exports.removeFromCacheByUri = function (uri) {
    var remotePath = getRemotePath(uri);
    if (remotePath) {
        this.cache[remotePath] = undefined;
    }
};

exports.checkCacheForUri = function (uri) {
    var remotePath = getRemotePath(uri);
    return remotePath ? this.cache[remotePath] != null : false;
};

exports.getSchemaByUri = function (report, uri, root) {
    var remotePath = getRemotePath(uri),
        queryPath = getQueryPath(uri),
        result = remotePath ? this.cache[remotePath] : root;

    if (result && remotePath) {
        // we need to avoid compiling schemas in a recursive loop
        var compileRemote = result !== root;
        // now we need to compile and validate resolved schema (in case it's not already)
        if (compileRemote) {

            report.path.push(remotePath);

            var remoteReport = new Report(report);
            if (SchemaCompilation.compileSchema.call(this, remoteReport, result)) {
                SchemaValidation.validateSchema.call(this, remoteReport, result);
            }
            var remoteReportIsValid = remoteReport.isValid();
            if (!remoteReportIsValid) {
                report.addError("REMOTE_NOT_VALID", [uri], remoteReport);
            }

            report.path.pop();

            if (!remoteReportIsValid) {
                return undefined;
            }
        }
    }

    if (result && queryPath) {
        var parts = queryPath.split("/");
        for (var idx = 0, lim = parts.length; idx < lim; idx++) {
            var key = decodeJSONPointer(parts[idx]);
            if (idx === 0) { // it's an id
                result = findId(result, key);
            } else { // it's a path behind id
                result = result[key];
            }
        }
    }

    return result;
};

exports.getRemotePath = getRemotePath;

},{"./Report":79,"./SchemaCompilation":81,"./SchemaValidation":82}],81:[function(require,module,exports){
"use strict";

var Report = require("./Report");
var SchemaCache = require("./SchemaCache");

function isAbsoluteUri(uri) {
    return /^https?:\/\//.test(uri);
}

function isRelativeUri(uri) {
    // relative URIs that end with a hash sign, issue #56
    return /.+#/.test(uri);
}

function mergeReference(scope, ref) {
    if (isAbsoluteUri(ref)) {
        return ref;
    }

    var joinedScope = scope.join(""),
        isScopeAbsolute = isAbsoluteUri(joinedScope),
        isScopeRelative = isRelativeUri(joinedScope),
        isRefRelative = isRelativeUri(ref),
        toRemove;

    if (isScopeAbsolute && isRefRelative) {
        toRemove = joinedScope.match(/\/[^\/]*$/);
        if (toRemove) {
            joinedScope = joinedScope.slice(0, toRemove.index + 1);
        }
    } else if (isScopeRelative && isRefRelative) {
        joinedScope = "";
    } else {
        toRemove = joinedScope.match(/[^#/]+$/);
        if (toRemove) {
            joinedScope = joinedScope.slice(0, toRemove.index);
        }
    }

    var res = joinedScope + ref;
    res = res.replace(/##/, "#");
    return res;
}

function collectReferences(obj, results, scope, path) {
    results = results || [];
    scope = scope || [];
    path = path || [];

    if (typeof obj !== "object" || obj === null) {
        return results;
    }

    if (typeof obj.id === "string") {
        scope.push(obj.id);
    }

    if (typeof obj.$ref === "string") {
        results.push({
            ref: mergeReference(scope, obj.$ref),
            key: "$ref",
            obj: obj,
            path: path.slice(0)
        });
    }
    if (typeof obj.$schema === "string") {
        results.push({
            ref: mergeReference(scope, obj.$schema),
            key: "$schema",
            obj: obj,
            path: path.slice(0)
        });
    }

    var idx;
    if (Array.isArray(obj)) {
        idx = obj.length;
        while (idx--) {
            path.push(idx.toString());
            collectReferences(obj[idx], results, scope, path);
            path.pop();
        }
    } else {
        var keys = Object.keys(obj);
        idx = keys.length;
        while (idx--) {
            // do not recurse through resolved references and other z-schema props
            if (keys[idx].indexOf("__$") === 0) { continue; }
            path.push(keys[idx]);
            collectReferences(obj[keys[idx]], results, scope, path);
            path.pop();
        }
    }

    if (typeof obj.id === "string") {
        scope.pop();
    }

    return results;
}

var compileArrayOfSchemasLoop = function (mainReport, arr) {
    var idx = arr.length,
        compiledCount = 0;

    while (idx--) {

        // try to compile each schema separately
        var report = new Report(mainReport);
        var isValid = exports.compileSchema.call(this, report, arr[idx]);
        if (isValid) { compiledCount++; }

        // copy errors to report
        mainReport.errors = mainReport.errors.concat(report.errors);

    }

    return compiledCount;
};

var compileArrayOfSchemas = function (report, arr) {

    var compiled = 0,
        lastLoopCompiled;

    do {

        // remove all UNRESOLVABLE_REFERENCE errors before compiling array again
        var idx = report.errors.length;
        while (idx--) {
            if (report.errors[idx].code === "UNRESOLVABLE_REFERENCE") {
                report.errors.splice(idx, 1);
            }
        }

        // remember how many were compiled in the last loop
        lastLoopCompiled = compiled;

        // count how many are compiled now
        compiled = compileArrayOfSchemasLoop.call(this, report, arr);

        // keep repeating if not all compiled and at least one more was compiled in the last loop
    } while (compiled !== arr.length && compiled !== lastLoopCompiled);

    return report.isValid();

};

exports.compileSchema = function (report, schema) {

    // if schema is a string, assume it's a uri
    if (typeof schema === "string") {
        var loadedSchema = SchemaCache.getSchemaByUri.call(this, report, schema);
        if (!loadedSchema) {
            report.addError("SCHEMA_NOT_REACHABLE", [schema]);
            return false;
        }
        schema = loadedSchema;
    }

    // if schema is an array, assume it's an array of schemas
    if (Array.isArray(schema)) {
        return compileArrayOfSchemas.call(this, report, schema);
    }

    // if we have an id than it should be cached already (if this instance has compiled it)
    if (schema.__$compiled && schema.id && SchemaCache.checkCacheForUri.call(this, schema.id) === false) {
        schema.__$compiled = undefined;
    }

    // do not re-compile schemas
    if (schema.__$compiled) {
        return true;
    }

    if (schema.id) {
        // add this to our schemaCache (before compilation in case we have references including id)
        SchemaCache.cacheSchemaByUri.call(this, schema.id, schema);
    }

    // collect all references that need to be resolved - $ref and $schema
    var refs = collectReferences.call(this, schema),
        idx = refs.length;
    while (idx--) {
        // resolve all the collected references into __xxxResolved pointer
        var refObj = refs[idx];
        var response = SchemaCache.getSchemaByUri.call(this, report, refObj.ref, schema);
        if (!response) {
            if (!isAbsoluteUri(refObj.ref) || this.options.ignoreUnresolvableReferences !== true) {
                Array.prototype.push.apply(report.path, refObj.path);
                report.addError("UNRESOLVABLE_REFERENCE", [refObj.ref]);
                report.path.slice(0, -refObj.path.length);
            }
        }
        // this might create circular references
        refObj.obj["__" + refObj.key + "Resolved"] = response;
    }

    var isValid = report.isValid();
    if (isValid) {
        schema.__$compiled = true;
    } else {
        if (schema.id) {
            // remove this schema from schemaCache because it failed to compile
            SchemaCache.removeFromCacheByUri.call(this, schema.id);
        }
    }
    return isValid;

};

},{"./Report":79,"./SchemaCache":80}],82:[function(require,module,exports){
"use strict";

var FormatValidators = require("./FormatValidators"),
    JsonValidation   = require("./JsonValidation"),
    Report           = require("./Report"),
    Utils            = require("./Utils");

var SchemaValidators = {
    $ref: function (report, schema) {
        // http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-07
        // http://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03
        if (typeof schema.$ref !== "string") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["$ref", "string"]);
        }
    },
    $schema: function (report, schema) {
        // http://json-schema.org/latest/json-schema-core.html#rfc.section.6
        if (typeof schema.$schema !== "string") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["$schema", "string"]);
        }
    },
    multipleOf: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.1.1
        if (typeof schema.multipleOf !== "number") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["multipleOf", "number"]);
        } else if (schema.multipleOf <= 0) {
            report.addError("KEYWORD_MUST_BE", ["multipleOf", "strictly greater than 0"]);
        }
    },
    maximum: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.2.1
        if (typeof schema.maximum !== "number") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["maximum", "number"]);
        }
    },
    exclusiveMaximum: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.2.1
        if (typeof schema.exclusiveMaximum !== "boolean") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["exclusiveMaximum", "boolean"]);
        } else if (schema.maximum === undefined) {
            report.addError("KEYWORD_DEPENDENCY", ["exclusiveMaximum", "maximum"]);
        }
    },
    minimum: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.3.1
        if (typeof schema.minimum !== "number") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["minimum", "number"]);
        }
    },
    exclusiveMinimum: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.3.1
        if (typeof schema.exclusiveMinimum !== "boolean") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["exclusiveMinimum", "boolean"]);
        } else if (schema.minimum === undefined) {
            report.addError("KEYWORD_DEPENDENCY", ["exclusiveMinimum", "minimum"]);
        }
    },
    maxLength: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.1.1
        if (Utils.whatIs(schema.maxLength) !== "integer") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["maxLength", "integer"]);
        } else if (schema.maxLength < 0) {
            report.addError("KEYWORD_MUST_BE", ["maxLength", "greater than, or equal to 0"]);
        }
    },
    minLength: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.2.1
        if (Utils.whatIs(schema.minLength) !== "integer") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["minLength", "integer"]);
        } else if (schema.minLength < 0) {
            report.addError("KEYWORD_MUST_BE", ["minLength", "greater than, or equal to 0"]);
        }
    },
    pattern: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.3.1
        if (typeof schema.pattern !== "string") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["pattern", "string"]);
        } else {
            try {
                RegExp(schema.pattern);
            } catch (e) {
                report.addError("KEYWORD_PATTERN", ["pattern", schema.pattern]);
            }
        }
    },
    additionalItems: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.1.1
        var type = Utils.whatIs(schema.additionalItems);
        if (type !== "boolean" && type !== "object") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["additionalItems", ["boolean", "object"]]);
        } else if (type === "object") {
            report.path.push("additionalItems");
            exports.validateSchema.call(this, report, schema.additionalItems);
            report.path.pop();
        }
    },
    items: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.1.1
        var type = Utils.whatIs(schema.items);

        if (type === "object") {
            report.path.push("items");
            exports.validateSchema.call(this, report, schema.items);
            report.path.pop();
        } else if (type === "array") {
            var idx = schema.items.length;
            while (idx--) {
                report.path.push("items");
                report.path.push(idx.toString());
                exports.validateSchema.call(this, report, schema.items[idx]);
                report.path.pop();
                report.path.pop();
            }
        } else {
            report.addError("KEYWORD_TYPE_EXPECTED", ["items", ["array", "object"]]);
        }

        // custom - strict mode
        if (this.options.forceAdditional === true && schema.additionalItems === undefined && Array.isArray(schema.items)) {
            report.addError("KEYWORD_UNDEFINED_STRICT", ["additionalItems"]);
        }
        // custome - assume defined false mode
        if (this.options.assumeAdditional === true && schema.additionalItems === undefined && Array.isArray(schema.items)) {
            schema.additionalItems = false;
        }
    },
    maxItems: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.2.1
        if (typeof schema.maxItems !== "number") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["maxItems", "integer"]);
        } else if (schema.maxItems < 0) {
            report.addError("KEYWORD_MUST_BE", ["maxItems", "greater than, or equal to 0"]);
        }
    },
    minItems: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.3.1
        if (Utils.whatIs(schema.minItems) !== "integer") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["minItems", "integer"]);
        } else if (schema.minItems < 0) {
            report.addError("KEYWORD_MUST_BE", ["minItems", "greater than, or equal to 0"]);
        }
    },
    uniqueItems: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.4.1
        if (typeof schema.uniqueItems !== "boolean") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["uniqueItems", "boolean"]);
        }
    },
    maxProperties: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.1.1
        if (Utils.whatIs(schema.maxProperties) !== "integer") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["maxProperties", "integer"]);
        } else if (schema.maxProperties < 0) {
            report.addError("KEYWORD_MUST_BE", ["maxProperties", "greater than, or equal to 0"]);
        }
    },
    minProperties: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.2.1
        if (Utils.whatIs(schema.minProperties) !== "integer") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["minProperties", "integer"]);
        } else if (schema.minProperties < 0) {
            report.addError("KEYWORD_MUST_BE", ["minProperties", "greater than, or equal to 0"]);
        }
    },
    required: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.3.1
        if (Utils.whatIs(schema.required) !== "array") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["required", "array"]);
        } else if (schema.required.length === 0) {
            report.addError("KEYWORD_MUST_BE", ["required", "an array with at least one element"]);
        } else {
            var idx = schema.required.length;
            while (idx--) {
                if (typeof schema.required[idx] !== "string") {
                    report.addError("KEYWORD_VALUE_TYPE", ["required", "string"]);
                }
            }
            if (Utils.isUniqueArray(schema.required) === false) {
                report.addError("KEYWORD_MUST_BE", ["required", "an array with unique items"]);
            }
        }
    },
    additionalProperties: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.4.1
        var type = Utils.whatIs(schema.additionalProperties);
        if (type !== "boolean" && type !== "object") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["additionalProperties", ["boolean", "object"]]);
        } else if (type === "object") {
            report.path.push("additionalProperties");
            exports.validateSchema.call(this, report, schema.additionalProperties);
            report.path.pop();
        }
    },
    properties: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.4.1
        if (Utils.whatIs(schema.properties) !== "object") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["properties", "object"]);
            return;
        }

        var keys = Object.keys(schema.properties),
            idx = keys.length;
        while (idx--) {
            var key = keys[idx],
                val = schema.properties[key];
            report.path.push("properties");
            report.path.push(key);
            exports.validateSchema.call(this, report, val);
            report.path.pop();
            report.path.pop();
        }

        // custom - strict mode
        if (this.options.forceAdditional === true && schema.additionalProperties === undefined) {
            report.addError("KEYWORD_UNDEFINED_STRICT", ["additionalProperties"]);
        }
        // custome - assume defined false mode
        if (this.options.assumeAdditional === true && schema.additionalProperties === undefined) {
            schema.additionalProperties = false;
        }
        // custom - forceProperties
        if (this.options.forceProperties === true && keys.length === 0) {
            report.addError("CUSTOM_MODE_FORCE_PROPERTIES", ["properties"]);
        }
    },
    patternProperties: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.4.1
        if (Utils.whatIs(schema.patternProperties) !== "object") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["patternProperties", "object"]);
            return;
        }

        var keys = Object.keys(schema.patternProperties),
            idx = keys.length;
        while (idx--) {
            var key = keys[idx],
                val = schema.patternProperties[key];
            try {
                RegExp(key);
            } catch (e) {
                report.addError("KEYWORD_PATTERN", ["patternProperties", key]);
            }
            report.path.push("patternProperties");
            report.path.push(key.toString());
            exports.validateSchema.call(this, report, val);
            report.path.pop();
            report.path.pop();
        }

        // custom - forceProperties
        if (this.options.forceProperties === true && keys.length === 0) {
            report.addError("CUSTOM_MODE_FORCE_PROPERTIES", ["patternProperties"]);
        }
    },
    dependencies: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.5.1
        if (Utils.whatIs(schema.dependencies) !== "object") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["dependencies", "object"]);
        } else {
            var keys = Object.keys(schema.dependencies),
                idx = keys.length;
            while (idx--) {
                var schemaKey = keys[idx],
                    schemaDependency = schema.dependencies[schemaKey],
                    type = Utils.whatIs(schemaDependency);

                if (type === "object") {
                    report.path.push("dependencies");
                    report.path.push(schemaKey);
                    exports.validateSchema.call(this, report, schemaDependency);
                    report.path.pop();
                    report.path.pop();
                } else if (type === "array") {
                    var idx2 = schemaDependency.length;
                    if (idx2 === 0) {
                        report.addError("KEYWORD_MUST_BE", ["dependencies", "not empty array"]);
                    }
                    while (idx2--) {
                        if (typeof schemaDependency[idx2] !== "string") {
                            report.addError("KEYWORD_VALUE_TYPE", ["dependensices", "string"]);
                        }
                    }
                    if (Utils.isUniqueArray(schemaDependency) === false) {
                        report.addError("KEYWORD_MUST_BE", ["dependencies", "an array with unique items"]);
                    }
                } else {
                    report.addError("KEYWORD_VALUE_TYPE", ["dependencies", "object or array"]);
                }
            }
        }
    },
    enum: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.1.1
        if (Array.isArray(schema.enum) === false) {
            report.addError("KEYWORD_TYPE_EXPECTED", ["enum", "array"]);
        } else if (schema.enum.length === 0) {
            report.addError("KEYWORD_MUST_BE", ["enum", "an array with at least one element"]);
        } else if (Utils.isUniqueArray(schema.enum) === false) {
            report.addError("KEYWORD_MUST_BE", ["enum", "an array with unique elements"]);
        }
    },
    type: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.2.1
        var primitiveTypes = ["array", "boolean", "integer", "number", "null", "object", "string"],
            primitiveTypeStr = primitiveTypes.join(","),
            isArray = Array.isArray(schema.type);

        if (isArray) {
            var idx = schema.type.length;
            while (idx--) {
                if (primitiveTypes.indexOf(schema.type[idx]) === -1) {
                    report.addError("KEYWORD_TYPE_EXPECTED", ["type", primitiveTypeStr]);
                }
            }
            if (Utils.isUniqueArray(schema.type) === false) {
                report.addError("KEYWORD_MUST_BE", ["type", "an object with unique properties"]);
            }
        } else if (typeof schema.type === "string") {
            if (primitiveTypes.indexOf(schema.type) === -1) {
                report.addError("KEYWORD_TYPE_EXPECTED", ["type", primitiveTypeStr]);
            }
        } else {
            report.addError("KEYWORD_TYPE_EXPECTED", ["type", ["string", "array"]]);
        }

        if (this.options.noEmptyStrings === true) {
            if (schema.type === "string" || isArray && schema.type.indexOf("string") !== -1) {
                if (schema.minLength === undefined) {
                    schema.minLength = 1;
                }
            }
        }
        if (this.options.noEmptyArrays === true) {
            if (schema.type === "array" || isArray && schema.type.indexOf("array") !== -1) {
                if (schema.minItems === undefined) {
                    schema.minItems = 1;
                }
            }
        }
        if (this.options.forceProperties === true) {
            if (schema.type === "object" || isArray && schema.type.indexOf("object") !== -1) {
                if (schema.properties === undefined && schema.patternProperties === undefined) {
                    report.addError("KEYWORD_UNDEFINED_STRICT", ["properties"]);
                }
            }
        }
        if (this.options.forceItems === true) {
            if (schema.type === "array" || isArray && schema.type.indexOf("array") !== -1) {
                if (schema.items === undefined) {
                    report.addError("KEYWORD_UNDEFINED_STRICT", ["items"]);
                }
            }
        }
        if (this.options.forceMaxLength === true) {
            if (schema.type === "string" || isArray && schema.type.indexOf("string") !== -1) {
                if (schema.maxLength === undefined && schema.format === undefined && schema.enum === undefined) {
                    report.addError("KEYWORD_UNDEFINED_STRICT", ["maxLength"]);
                }
            }
        }
    },
    allOf: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.3.1
        if (Array.isArray(schema.allOf) === false) {
            report.addError("KEYWORD_TYPE_EXPECTED", ["allOf", "array"]);
        } else if (schema.allOf.length === 0) {
            report.addError("KEYWORD_MUST_BE", ["allOf", "an array with at least one element"]);
        } else {
            var idx = schema.allOf.length;
            while (idx--) {
                report.path.push("allOf");
                report.path.push(idx.toString());
                exports.validateSchema.call(this, report, schema.allOf[idx]);
                report.path.pop();
                report.path.pop();
            }
        }
    },
    anyOf: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.4.1
        if (Array.isArray(schema.anyOf) === false) {
            report.addError("KEYWORD_TYPE_EXPECTED", ["anyOf", "array"]);
        } else if (schema.anyOf.length === 0) {
            report.addError("KEYWORD_MUST_BE", ["anyOf", "an array with at least one element"]);
        } else {
            var idx = schema.anyOf.length;
            while (idx--) {
                report.path.push("anyOf");
                report.path.push(idx.toString());
                exports.validateSchema.call(this, report, schema.anyOf[idx]);
                report.path.pop();
                report.path.pop();
            }
        }
    },
    oneOf: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.5.1
        if (Array.isArray(schema.oneOf) === false) {
            report.addError("KEYWORD_TYPE_EXPECTED", ["oneOf", "array"]);
        } else if (schema.oneOf.length === 0) {
            report.addError("KEYWORD_MUST_BE", ["oneOf", "an array with at least one element"]);
        } else {
            var idx = schema.oneOf.length;
            while (idx--) {
                report.path.push("oneOf");
                report.path.push(idx.toString());
                exports.validateSchema.call(this, report, schema.oneOf[idx]);
                report.path.pop();
                report.path.pop();
            }
        }
    },
    not: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.6.1
        if (Utils.whatIs(schema.not) !== "object") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["not", "object"]);
        } else {
            report.path.push("not");
            exports.validateSchema.call(this, report, schema.not);
            report.path.pop();
        }
    },
    definitions: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.7.1
        if (Utils.whatIs(schema.definitions) !== "object") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["definitions", "object"]);
        } else {
            var keys = Object.keys(schema.definitions),
                idx = keys.length;
            while (idx--) {
                var key = keys[idx],
                    val = schema.definitions[key];
                report.path.push("definitions");
                report.path.push(key);
                exports.validateSchema.call(this, report, val);
                report.path.pop();
                report.path.pop();
            }
        }
    },
    format: function (report, schema) {
        if (typeof schema.format !== "string") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["format", "string"]);
        } else {
            if (FormatValidators[schema.format] === undefined) {
                report.addError("UNKNOWN_FORMAT", [schema.format]);
            }
        }
    },
    id: function (report, schema) {
        // http://json-schema.org/latest/json-schema-core.html#rfc.section.7.2
        if (typeof schema.id !== "string") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["id", "string"]);
        }
    },
    title: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1
        if (typeof schema.title !== "string") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["title", "string"]);
        }
    },
    description: function (report, schema) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1
        if (typeof schema.description !== "string") {
            report.addError("KEYWORD_TYPE_EXPECTED", ["description", "string"]);
        }
    },
    "default": function (/* report, schema */) {
        // http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2
        // There are no restrictions placed on the value of this keyword.
    }
};

var validateArrayOfSchemas = function (report, arr) {
    var idx = arr.length;
    while (idx--) {
        exports.validateSchema.call(this, report, arr[idx]);
    }
    return report.isValid();
};

exports.validateSchema = function (report, schema) {

    // if schema is an array, assume it's an array of schemas
    if (Array.isArray(schema)) {
        return validateArrayOfSchemas.call(this, report, schema);
    }

    // do not revalidate schema that has already been validated once
    if (schema.__$validated) {
        return true;
    }

    // if $schema is present, this schema should validate against that $schema
    var hasParentSchema = schema.$schema && schema.id !== schema.$schema;
    if (hasParentSchema) {
        if (schema.__$schemaResolved && schema.__$schemaResolved !== schema) {
            var subReport = new Report(report);
            var valid = JsonValidation.validate.call(this, subReport, schema.__$schemaResolved, schema);
            if (valid === false) {
                report.addError("PARENT_SCHEMA_VALIDATION_FAILED", null, subReport);
            }
        } else {
            if (this.options.ignoreUnresolvableReferences !== true) {
                report.addError("REF_UNRESOLVED", [schema.$schema]);
            }
        }
    }

    if (this.options.noTypeless === true) {
        // issue #36 - inherit type to anyOf, oneOf, allOf if noTypeless is defined
        if (schema.type !== undefined) {
            var schemas = [];
            if (Array.isArray(schema.anyOf)) { schemas = schemas.concat(schema.anyOf); }
            if (Array.isArray(schema.oneOf)) { schemas = schemas.concat(schema.oneOf); }
            if (Array.isArray(schema.allOf)) { schemas = schemas.concat(schema.allOf); }
            schemas.forEach(function (sch) {
                if (!sch.type) { sch.type = schema.type; }
            });
        }
        // end issue #36
        if (schema.type === undefined &&
            schema.anyOf === undefined &&
            schema.oneOf === undefined &&
            schema.not === undefined &&
            schema.$ref === undefined) {
            report.addError("KEYWORD_UNDEFINED_STRICT", ["type"]);
        }
    }

    var keys = Object.keys(schema),
        idx = keys.length;
    while (idx--) {
        var key = keys[idx];
        if (key.indexOf("__") === 0) { continue; }
        if (SchemaValidators[key] !== undefined) {
            SchemaValidators[key].call(this, report, schema);
        } else if (!hasParentSchema) {
            if (this.options.noExtraKeywords === true) {
                report.addError("KEYWORD_UNEXPECTED", [key]);
            }
        }
    }

    var isValid = report.isValid();
    if (isValid) {
        schema.__$validated = true;
    }
    return isValid;

};

},{"./FormatValidators":76,"./JsonValidation":77,"./Report":79,"./Utils":83}],83:[function(require,module,exports){
"use strict";

exports.whatIs = function (what) {

    var to = typeof what;

    if (to === "object") {
        if (what === null) {
            return "null";
        }
        if (Array.isArray(what)) {
            return "array";
        }
        return "object"; // typeof what === 'object' && what === Object(what) && !Array.isArray(what);
    }

    if (to === "number") {
        if (Number.isFinite(what)) {
            if (what % 1 === 0) {
                return "integer";
            } else {
                return "number";
            }
        }
        if (Number.isNaN(what)) {
            return "not-a-number";
        }
        return "unknown-number";
    }

    return to; // undefined, boolean, string, function

};

exports.areEqual = function areEqual(json1, json2) {
    // http://json-schema.org/latest/json-schema-core.html#rfc.section.3.6

    // Two JSON values are said to be equal if and only if:
    // both are nulls; or
    // both are booleans, and have the same value; or
    // both are strings, and have the same value; or
    // both are numbers, and have the same mathematical value; or
    if (json1 === json2) {
        return true;
    }

    var i, len;

    // both are arrays, and:
    if (Array.isArray(json1) && Array.isArray(json2)) {
        // have the same number of items; and
        if (json1.length !== json2.length) {
            return false;
        }
        // items at the same index are equal according to this definition; or
        len = json1.length;
        for (i = 0; i < len; i++) {
            if (!areEqual(json1[i], json2[i])) {
                return false;
            }
        }
        return true;
    }

    // both are objects, and:
    if (exports.whatIs(json1) === "object" && exports.whatIs(json2) === "object") {
        // have the same set of property names; and
        var keys1 = Object.keys(json1);
        var keys2 = Object.keys(json2);
        if (!areEqual(keys1, keys2)) {
            return false;
        }
        // values for a same property name are equal according to this definition.
        len = keys1.length;
        for (i = 0; i < len; i++) {
            if (!areEqual(json1[keys1[i]], json2[keys1[i]])) {
                return false;
            }
        }
        return true;
    }

    return false;
};

exports.isUniqueArray = function (arr, indexes) {
    var i, j, l = arr.length;
    for (i = 0; i < l; i++) {
        for (j = i + 1; j < l; j++) {
            if (exports.areEqual(arr[i], arr[j])) {
                if (indexes) { indexes.push(i, j); }
                return false;
            }
        }
    }
    return true;
};

exports.difference = function (bigSet, subSet) {
    var arr = [],
        idx = bigSet.length;
    while (idx--) {
        if (subSet.indexOf(bigSet[idx]) === -1) {
            arr.push(bigSet[idx]);
        }
    }
    return arr;
};

// NOT a deep version of clone
exports.clone = function (src) {
    if (typeof src !== "object" || src === null) { return src; }
    var res, idx;
    if (Array.isArray(src)) {
        res = [];
        idx = src.length;
        while (idx--) {
            res[idx] = src[idx];
        }
    } else {
        res = {};
        var keys = Object.keys(src);
        idx = keys.length;
        while (idx--) {
            var key = keys[idx];
            res[key] = src[key];
        }
    }
    return res;
};

},{}],84:[function(require,module,exports){
"use strict";

require("./Polyfills");
var Report            = require("./Report");
var FormatValidators  = require("./FormatValidators");
var JsonValidation    = require("./JsonValidation");
var SchemaCache       = require("./SchemaCache");
var SchemaCompilation = require("./SchemaCompilation");
var SchemaValidation  = require("./SchemaValidation");
var Utils             = require("./Utils");

/*
    default options
*/
var defaultOptions = {
    // default timeout for all async tasks
    asyncTimeout: 2000,
    // force additionalProperties and additionalItems to be defined on "object" and "array" types
    forceAdditional: false,
    // assume additionalProperties and additionalItems are defined as "false" where appropriate
    assumeAdditional: false,
    // force items to be defined on "array" types
    forceItems: false,
    // force maxLength to be defined on "string" types
    forceMaxLength: false,
    // force properties or patternProperties to be defined on "object" types
    forceProperties: false,
    // ignore references that cannot be resolved (remote schemas) // TODO: make sure this is only for remote schemas, not local ones
    ignoreUnresolvableReferences: false,
    // disallow usage of keywords that this validator can't handle
    noExtraKeywords: false,
    // disallow usage of schema's without "type" defined
    noTypeless: false,
    // disallow zero length strings in validated objects
    noEmptyStrings: false,
    // disallow zero length arrays in validated objects
    noEmptyArrays: false,
    // forces "uri" format to be in fully rfc3986 compliant
    strictUris: false,
    // turn on some of the above
    strictMode: false,
    // report error paths as an array of path segments to get to the offending node
    reportPathAsArray: false
};

/*
    constructor
*/
function ZSchema(options) {
    this.cache = {};

    // options
    if (typeof options === "object") {
        var keys = Object.keys(options),
            idx = keys.length;
        while (idx--) {
            var key = keys[idx];
            if (defaultOptions[key] === undefined) {
                throw new Error("Unexpected option passed to constructor: " + key);
            }
        }
        this.options = options;
    } else {
        this.options = Utils.clone(defaultOptions);
    }

    if (this.options.strictMode === true) {
        this.options.forceAdditional  = true;
        this.options.forceItems       = true;
        this.options.forceMaxLength   = true;
        this.options.forceProperties  = true;
        this.options.noExtraKeywords  = true;
        this.options.noTypeless       = true;
        this.options.noEmptyStrings   = true;
        this.options.noEmptyArrays    = true;
    }
}

/*
    instance methods
*/
ZSchema.prototype.compileSchema = function (schema) {
    var report = new Report(this.options);

    if (typeof schema === "string") {
        schema = SchemaCache.getSchemaByUri.call(this, report, schema);
    }

    SchemaCompilation.compileSchema.call(this, report, schema);

    this.lastReport = report;
    return report.isValid();
};
ZSchema.prototype.validateSchema = function (schema) {
    var report = new Report(this.options);

    if (typeof schema === "string") {
        schema = SchemaCache.getSchemaByUri.call(this, report, schema);
    }

    var compiled = SchemaCompilation.compileSchema.call(this, report, schema);
    if (compiled) { SchemaValidation.validateSchema.call(this, report, schema); }

    this.lastReport = report;
    return report.isValid();
};
ZSchema.prototype.validate = function (json, schema, callback) {
    var report = new Report(this.options);

    if (typeof schema === "string") {
        schema = SchemaCache.getSchemaByUri.call(this, report, schema);
    }

    var compiled = SchemaCompilation.compileSchema.call(this, report, schema);
    if (!compiled) {
        this.lastReport = report;
        return false;
    }

    var validated = SchemaValidation.validateSchema.call(this, report, schema);
    if (!validated) {
        this.lastReport = report;
        return false;
    }

    JsonValidation.validate.call(this, report, schema, json);

    if (callback) {
        report.processAsyncTasks(this.options.asyncTimeout, callback);
        return;
    } else if (report.asyncTasks.length > 0) {
        throw new Error("This validation has async tasks and cannot be done in sync mode, please provide callback argument.");
    }

    // assign lastReport so errors are retrievable in sync mode
    this.lastReport = report;
    return report.isValid();
};
ZSchema.prototype.getLastErrors = function () {
    return this.lastReport.errors.length > 0 ? this.lastReport.errors : undefined;
};
ZSchema.prototype.getMissingReferences = function () {
    var res = [],
        idx = this.lastReport.errors.length;
    while (idx--) {
        var error = this.lastReport.errors[idx];
        if (error.code === "UNRESOLVABLE_REFERENCE") {
            var reference = error.params[0];
            if (res.indexOf(reference) === -1) {
                res.push(reference);
            }
        }
    }
    return res;
};
ZSchema.prototype.getMissingRemoteReferences = function () {
    var missingReferences = this.getMissingReferences(),
        missingRemoteReferences = [],
        idx = missingReferences.length;
    while (idx--) {
        var remoteReference = SchemaCache.getRemotePath(missingReferences[idx]);
        if (remoteReference && missingRemoteReferences.indexOf(remoteReference) === -1) {
            missingRemoteReferences.push(remoteReference);
        }
    }
    return missingRemoteReferences;
};
ZSchema.prototype.setRemoteReference = function (uri, schema) {
    if (typeof schema === "string") {
        schema = JSON.parse(schema);
    }
    SchemaCache.cacheSchemaByUri.call(this, uri, schema);
};

/*
    static methods
*/
ZSchema.registerFormat = function (formatName, validatorFunction) {
    FormatValidators[formatName] = validatorFunction;
};
ZSchema.registerFormatter = function (/* formatterName, formatterFunction */) {

};

module.exports = ZSchema;

},{"./FormatValidators":76,"./JsonValidation":77,"./Polyfills":78,"./Report":79,"./SchemaCache":80,"./SchemaCompilation":81,"./SchemaValidation":82,"./Utils":83}],85:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],86:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],87:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],88:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":87,"_process":86,"inherits":85}],89:[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}],90:[function(require,module,exports){
module.exports={
  "name": "blue-button",
  "version": "1.3.0-beta.16",
  "description": "Blue Button (CCDA) to JSON Parser.",
  "main": "./index.js",
  "directories": {
    "doc": "doc",
    "lib": "lib"
  },
  "scripts": {
    "prepublish": "echo \"Prepublish Build script should go here.\"",
    "test": "grunt test"
  },
  "author": "Dmitry Kachaev <dmitry@amida-tech.com>",
  "contributors": [
    {
      "name": "Matthew McCall",
      "email": "matt@amida-tech.com"
    },
    {
      "name": "Afsin Ustundag",
      "email": "afsin.ustundag@us.pwc.com"
    }
  ],
  "license": "Apache-2.0",
  "engines": {
    "node": ">= 0.10.0"
  },
  "dependencies": {
    "blue-button-meta": "^1.3.0",
    "blue-button-generate": "^1.3.0",
    "blue-button-model": "^1.3.0",
    "blue-button-xml": "^1.3.0",
    "blue-button-cms": "^1.3.0",
    "underscore": "1.6.x",
    "winston": "^0.7.3"
  },
  "devDependencies": {
    "brfs": "^1.2.0",
    "chai": "1.8.x",
    "coveralls": "~2.10.0",
    "grunt": "0.4.x",
    "grunt-browserify": "3.2.x",
    "grunt-contrib-connect": "^0.9.0",
    "grunt-contrib-jshint": "0.8.x",
    "grunt-contrib-watch": "0.6.x",
    "grunt-coveralls": "*",
    "grunt-istanbul-coverage": "*",
    "grunt-jsbeautifier": "^0.2.7",
    "grunt-mocha-phantomjs": "^0.6.0",
    "grunt-mocha-test": "0.8.x",
    "karma-chai": "0.1.x",
    "mocha": "1.17.x",
    "mocha-lcov-reporter": "0.0.1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/amida-tech/bluebutton.git"
  },
  "keywords": [
    "bluebutton"
  ],
  "bugs": {
    "url": "https://github.com/amida-tech/blue-button/issues"
  },
  "homepage": "https://github.com/amida-tech/blue-button"
}

},{}],"blue-button":[function(require,module,exports){
//main module that exports all other sub modules

"use strict";

var sense = require("./lib/sense.js");
exports.senseXml = sense.senseXml;
exports.senseString = sense.senseString;

exports.xml = require("blue-button-xml").xmlUtil;

var parser = require("./lib/parser.js");
exports.parseXml = parser.parseXml;
exports.parseString = parser.parseString;
exports.parseText = parser.parseText;
exports.parseText2 = parser.parseText2;

//need to review if this is still needed
exports.parse = parser.parse;

// ccda generation
exports.generateCCDA = require("blue-button-generate").generateCCD;

// testing for ccda generation
//exports.testCCDA = require("./test/test-lib.js").testXML;

exports.validator = require("blue-button-model").validator;

/*
	//get access to current version of NPM package

	var version = require('./package.json').version;
	console.log(version);
*/

},{"./lib/parser.js":1,"./lib/sense.js":43,"blue-button-generate":"blue-button-generate","blue-button-model":54,"blue-button-xml":"blue-button-xml"}]},{},["blue-button"]);
