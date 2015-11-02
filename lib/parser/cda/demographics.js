"use strict";

var shared = require('./shared');
var processor = require("blue-button-xml").processor;
var component = require("blue-button-xml").component;

var Guardian = component.define("Guardian")
    .fields([
        ["relation", "0..1", "h:code", shared.ConceptDescriptor],
        ["addresses", "0..*", "h:addr", shared.Address],
        ["names", "1..*", "h:guardianPerson/h:name", shared.IndividualName],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
    ]);

var LanguageCommunication = component.define("LanguageCommunication")
    .fields([
        ["language", "1..1", "h:languageCode", shared.ConceptDescriptor],
        ["preferred", "1..1", "h:preferenceInd/@value", processor.asBoolean],
        ["mode", "0..1", "h:modeCode", shared.ConceptDescriptor],
        ["proficiency", "0..1", "h:proficiencyLevelCode", shared.ConceptDescriptor]
    ]);

exports.patient = component.define("Patient")
    .fields([
        ["name", "1..1", "h:patient/h:name", shared.IndividualName],
        ["dob", "1..1", "h:patient/h:birthTime", shared.EffectiveTime],
        ["gender", "1..1", "h:patient/h:administrativeGenderCode", shared.ConceptDescriptor],
        ["identifiers", "1..*", "h:id", shared.Identifier],
        ["marital_status", "0..1", "h:patient/h:maritalStatusCode", shared.ConceptDescriptor],
        ["addresses", "0..*", "h:addr", shared.Address],
        ["phone", "0..*", shared.phone.xpath(), shared.phone],
        ["email", "0..*", shared.email.xpath(), shared.email],
        ["race", "0..1", "h:patient/h:raceCode", shared.ConceptDescriptor],
        ["ethnicity", "0..1", "h:patient/h:ethnicGroupCode", shared.ConceptDescriptor],
        ["languages", "0..*", "h:patient/h:languageCommunication", LanguageCommunication],
        ["religion", "0..1", "h:patient/h:religiousAffiliationCode/@code", shared.ConceptDescriptor],
        ["birthplace", "0..1", "h:patient/h:birthplace/h:place/h:addr", shared.Address],
        ["guardians", "0..*", "h:patient/h:guardian", Guardian]
    ]);
