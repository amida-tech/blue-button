var shared = require('./shared');
var Processor = require('./processor');
var Component = require("./component");
var Cleanup = require("./cleanup");

var ImmunizationRefusalReason = Component.define("ImmunizationRefusalReason")
.templateRoot("2.16.840.1.113883.10.20.22.4.53");

var ImmunizationInformation = Component.define("ImmunizationInformation")
.templateRoot("2.16.840.1.113883.10.20.22.4.54")
.fields([
  ["productName","0..1", ".//h:manufacturedMaterial/h:code", shared.ConceptDescriptor],
  ["freeTextProductName","0..1", ".//h:manufacturedMaterial/h:code/h:originalText", shared.TextWithReference],
  ["lotNumber","0..1", "h:lotNumberText/text()"],
]);

var ImmunizationActivity = Component.define("ImmunizationActivity")
.templateRoot("2.16.840.1.113883.10.20.22.4.52")
.withMood("EVN")
.fields([
  ["sourceIds","1..*", "h:id", shared.Identifier],
  ["deliveryMethod","0..1", "h:code", shared.ConceptDescriptor],
  ["route","0..1", "h:routeCode", shared.SimplifiedCode],
  ["site","0..1", "h:approachSiteCode", shared.ConceptDescriptor],
  ["administrationUnit","0..1", "h:administrationUnitCode", shared.ConceptDescriptor],
  ["date", "1..1", "h:effectiveTime", shared.EffectiveTime],
  ["seriesNumber", "0..1", "h:repeatNumber/@value", shared.EffectiveTime],
  ["immunizationName", "1..1", "h:consumable/h:manufacturedProduct", ImmunizationInformation],
  ["freeText","0..1", "h:text", shared.TextWithReference],
  ["skippedFor", "0..1", ImmunizationRefusalReason.xpath()+"/h:code", shared.SimplifiedCode]
])
.uriBuilder({
  category: "entries",
  type: "immunizationsGiven"
})
.cleanupStep(Cleanup.extractAllFields(["immunizationName"]));

var PlannedImmunization = ImmunizationActivity.define("PlannedImmunization")
.withMood("INT")
.uriBuilder({
  category:"entries",
  type:"immunizationsPlanned"
});

var RefusedImmunization = ImmunizationActivity.define("RefusedImmunization")
.withNegationStatus(true)
.uriBuilder({
  category:"entries",
  type:"immunizationsSkipped"
});

exports.ImmunizationsSection = Component.define("ImmunizationsSection")
.templateRoot(["2.16.840.1.113883.10.20.22.2.2", "2.16.840.1.113883.10.20.22.2.2.1"])
.fields([
  ["immunizationsGiven","0..*", ImmunizationActivity.xpath(), ImmunizationActivity],
  ["immunizationsPlanned","0..*", PlannedImmunization.xpath(), PlannedImmunization],
  ["immunizationsSkipped","0..*", RefusedImmunization.xpath(), RefusedImmunization],
])
.uriBuilder({
  category: "sections",
  type: "immunizations"
})
.cleanupStep(Cleanup.ensureMutuallyExclusive([
  "immunizationsSkipped",
  "immunizationsGiven", 
  "immunizationsPlanned"
]));

