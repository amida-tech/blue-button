var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");

var Address = Component.define("Address")
.fields([
  ["streetLines",   "1..4",   "h:streetAddressLine/text()"],
  ["city",          "1..1",   "h:city/text()", Processor.asString],
  ["state",         "0..1",   "h:state/text()"],
  ["zip",           "0..1",   "h:postalCode/text()"],
  ["country",       "0..1",   "h:country/text()"],
  ["use",           "0..1",   "@use", shared.SimpleCode("2.16.840.1.113883.5.1119")]
]);

var Name = Component.define("Name")
.fields([
  ["prefixes", "0..*","h:prefix/text()"],
  ["givens", "1..*","h:given/text()"],
  ["family", "1..1","h:family/text()"],
  ["suffix", "0..1","h:suffix/text()"],
  ["use", "0..1", "@use", shared.SimpleCode("2.16.840.1.113883.5.45")]
]);

var Telecom = Component.define("Telecom")
.fields([
  ["value", "1..1","@value"],
  ["use", "0..1", "@use", shared.SimpleCode("2.16.840.1.113883.5.1119")]
]);

var Guardian = Component.define("Guardian")
.fields([
  ["relation","0..1", "h:code", shared.SimplifiedCode],
  ["addresses","0..*", "h:addr", Address],
  ["names","1..*", "h:guardianPerson/h:name", Name],
  ["telecoms","0..*", "h:telecom", Telecom],
]);

var LanguageCommunication = Component.define("LanguageCommunication")
.fields([
  ["mode","0..1", "h:modeCode", shared.SimplifiedCode],
  ["proficiency","0..1", "h:proficiencyLevelCode", shared.SimplifiedCode],
  ["code", "1..1","h:languageCode/@code"],
  ["preferred", "1..1","h:preferenceInd/@value", Processor.asBoolean],
]);

exports.Patient = Component.define("Patient")
.fields([
  ["name",                "1..1", "h:patient/h:name", Name],
  ["maritalStatus",       "0..1", "h:patient/h:maritalStatusCode", 
    shared.SimplifiedCode.shall({valueSetOid: "2.16.840.1.113883.1.11.12212"})],
  ["religion",            "0..1", "h:patient/h:religiousAffiliationCode", shared.ConceptDescriptor],
  ["race",                "0..1", "h:patient/h:raceCode", shared.ConceptDescriptor],
  ["ethnicity",           "0..1", "h:patient/h:ethnicGroupCode", shared.ConceptDescriptor],
  ["addresses",             "0..*", "h:addr", Address],
  ["guardians",            "0..*", "h:patient/h:guardian", Guardian],
  ["telecoms",             "0..*", "h:telecom", Telecom],
  ["languages",            "0..*", "h:patient/h:languageCommunication", LanguageCommunication],
  ["medicalRecordNumbers","1..*", "h:id", shared.Identifier],
  ["gender",              "1..1", "h:patient/h:administrativeGenderCode", shared.SimplifiedCode],
  ["birthTime",           "1..1", "h:patient/h:birthTime/@value", Processor.asTimestamp],
  ["birthTimeResolution", "1..1", "h:patient/h:birthTime/@value", Processor.asTimestampResolution],
])
.uriBuilder({
  category: "sections",
  type: "demographics"
});

