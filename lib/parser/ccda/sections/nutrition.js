var shared = require("../shared");
var component = require("@amida-tech/blue-button-xml").component.withNullFlavor();
var cleanup = require("../cleanup");

var exportNutritionSection = function () {
  var nutritionalStatusObservation;
  var nutritionSection;
  var nutritionAssessment;

  nutritionAssessment = component.define("nutritionAssessment")
    .templateRoot("2.16.840.1.113883.10.20.22.4.138")
    .fields([
      ["identifiers", "1..*", "h:id", shared.Identifier],
      ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
      ["value", "1..1", "h:value[@xsi:type='CD']/@displayName"],
    ]);

  nutritionalStatusObservation = component.define("nutritionalStatusObservation")
    .templateRoot("2.16.840.1.113883.10.20.22.4.124")
    .fields([
      ["identifiers", "1..*", "h:id", shared.Identifier],
      ["date_time", "1..1", "h:effectiveTime", shared.EffectiveTime],
      ["value", "1..1", "h:value[@xsi:type='CD']/@displayName"],
      ["assessments", "1..*", "h:entryRelationship/h:observation", nutritionAssessment],
    ]);

    nutritionSection = component.define("nutritionSection")
      .templateRoot("2.16.840.1.113883.10.20.22.2.57")
      .fields([
        ["observations", "0..*", "h:entry/h:observation", nutritionalStatusObservation],
      ]);

    nutritionSection.cleanupStep(cleanup.replaceWithField('observations'));
    return nutritionSection;
};

exports.nutritionSection = exportNutritionSection;
