"use strict";

var shared = require('./shared');
var processor = require('./processor');
var component = require('./component');

var Guardian = component.define("Guardian")
    .fields([
        ["relation", "0..1", "h:code", shared.SimplifiedCode],
        ["addresses", "0..*", "h:addr", shared.Address],
        ["names", "1..*", "h:guardianPerson/h:name", shared.IndividualName],
        ["phone", "0..*", "h:telecom", shared.Phone],
        ["email", "0..*", "h:telecom", shared.Email],
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
        ["phone", "0..*", "h:telecom", shared.Phone],
        ["email", "0..*", "h:telecom", shared.Email],
        ["race_ethnicity", "0..1", "h:patient", RaceEthnicity],
        ["languages", "0..*", "h:patient/h:languageCommunication", LanguageCommunication],
        ["religion", "0..1", "h:patient/h:religiousAffiliationCode/@code", shared.SimpleCode("2.16.840.1.113883.5.1076")],
        ["birthplace", "0..1", "h:patient/h:birthplace/h:place/h:addr", shared.Address],
        ["guardians", "0..*", "h:patient/h:guardian", Guardian]
    ]);
