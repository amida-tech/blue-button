//CCDA to JSON parser.

var components = {
   ccda_ccd: require('./ccda/ccd').CCD,
   ccda_demographics: require('./ccda/demographics').Patient,
   ccda_vitals: require('./ccda/vitals').VitalSignsSection,
   ccda_medications: require('./ccda/medications').MedicationsSection,
   ccda_problems: require('./ccda/problems').ProblemsSection,
   ccda_immunizations: require('./ccda/immunizations').ImmunizationsSection,
   ccda_results: require('./ccda/results').ResultsSection,
   ccda_allergies: require('./ccda/allergies').allergiesSection
};

var componentRouter = function(componentName) {
    if (componentName) {
        return components[componentName];
    } else {
        return components.ccda_ccd;
    }
};

module.exports.componentRouter = componentRouter;
